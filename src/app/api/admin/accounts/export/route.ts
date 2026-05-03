import { NextRequest, NextResponse } from "next/server"
import { AccountExportAction, AccountExportFormat, AccountSecretStatus, ProductType, type AccountSecret } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

type ExportPayload = {
  productId?: string
  productIds?: string[]
  secretIds?: string[]
  quantity?: number
  format?: AccountExportFormat
  action?: AccountExportAction
}

const FORMAT_CONTENT_TYPES: Record<AccountExportFormat, string> = {
  CSV: "text/csv; charset=utf-8",
  TXT: "text/plain; charset=utf-8",
  JSON: "application/json; charset=utf-8",
}

type ExportedAccountSecret = AccountSecret & {
  product: {
    type: ProductType
    category: { name: string }
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await request.json() as ExportPayload
  const format = payload.format ?? AccountExportFormat.CSV
  const action = payload.action ?? AccountExportAction.EXPORT_ONLY
  const quantity = Math.max(1, Math.min(payload.quantity ?? payload.secretIds?.length ?? 50, 1000))

  if (!Object.values(AccountExportFormat).includes(format)) {
    return NextResponse.json({ error: "Unsupported export format" }, { status: 400 })
  }

  if (!Object.values(AccountExportAction).includes(action)) {
    return NextResponse.json({ error: "Unsupported export action" }, { status: 400 })
  }

  const secrets = await prisma.accountSecret.findMany({
    where: {
      ...(payload.secretIds?.length ? { id: { in: payload.secretIds } } : {}),
      ...(payload.productIds?.length ? { productId: { in: payload.productIds } } : payload.productId ? { productId: payload.productId } : {}),
      isSold: false,
      status: AccountSecretStatus.AVAILABLE,
    },
    include: {
      product: {
        select: {
          type: true,
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: quantity,
  })

  if (secrets.length === 0) {
    return NextResponse.json({ error: "No available accounts to export" }, { status: 404 })
  }

  const fileName = `account-export-${new Date().toISOString().replace(/[:.]/g, "-")}.${format.toLowerCase()}`

  const batch = await prisma.accountExportBatch.create({
    data: {
      productId: payload.productIds?.length ? undefined : payload.productId,
      exportedById: session.user.id,
      format,
      action,
      quantity: secrets.length,
      fileName,
    },
  })

  if (action === AccountExportAction.EXPORT_AND_DISABLE) {
    await prisma.accountSecret.updateMany({
      where: { id: { in: secrets.map((secret) => secret.id) } },
      data: {
        status: AccountSecretStatus.EXPORTED,
        exportedAt: new Date(),
        exportedById: session.user.id,
        exportBatchId: batch.id,
        exportFormat: format,
      },
    })
  }

  const content = formatExportContent(secrets, format)

  return new NextResponse(content, {
    headers: {
      "Content-Type": FORMAT_CONTENT_TYPES[format],
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "X-Export-Batch-Id": batch.id,
    },
  })
}

function formatExportContent(secrets: ExportedAccountSecret[], format: AccountExportFormat) {
  const rows = secrets.map((secret) => ({
    productTitle: secret.product.category.name,
    productType: secret.product.type,
    category: secret.product.category.name,
    accountId: secret.accountId ?? "",
    username: secret.username,
    password: secret.password,
    extraInfo: secret.extraInfo ?? "",
  }))

  if (format === AccountExportFormat.JSON) {
    return JSON.stringify(rows, null, 2)
  }

  return rows
    .map((row) => [row.username, row.password, row.accountId].filter(Boolean).join("|"))
    .join("\n")
}
