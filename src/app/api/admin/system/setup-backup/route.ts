import { NextResponse } from "next/server";
import { auth } from "@/auth";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Kiểm tra hệ điều hành
    if (process.platform !== "linux") {
      return NextResponse.json({ 
        error: "Tính năng này chỉ hỗ trợ hệ điều hành Linux (VPS). Vui lòng cài đặt thủ công nếu bạn dùng Windows/macOS." 
      }, { status: 400 });
    }

    const projectRoot = process.cwd();
    const scriptsDir = path.join(projectRoot, "scripts");
    const scriptPath = path.join(scriptsDir, "backup.sh");

    // 1. Tạo thư mục scripts nếu chưa có
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }

    // 2. Nội dung script backup
    const scriptContent = `#!/bin/bash
# Script tự động backup ShopOnePlay - Được tạo bởi Admin Panel
PROJECT_ROOT="${projectRoot}"
DATABASE_URL=$(grep "DATABASE_URL" $PROJECT_ROOT/.env | cut -d '=' -f2- | tr -d '"' | tr -d "'")

# Lấy cấu hình từ DB
ENABLED=$(psql $DATABASE_URL -t -c "SELECT value FROM \\"Config\\" WHERE key='BACKUP_ENABLED';")
PASSWORD=$(psql $DATABASE_URL -t -c "SELECT value FROM \\"Config\\" WHERE key='BACKUP_PASSWORD';")
TOKEN=$(psql $DATABASE_URL -t -c "SELECT value FROM \\"Config\\" WHERE key='TELEGRAM_TOKEN';")
CHAT_ID=$(psql $DATABASE_URL -t -c "SELECT value FROM \\"Config\\" WHERE key='TELEGRAM_ID';")

# Trim whitespace
ENABLED=$(echo $ENABLED | xargs)
PASSWORD=$(echo $PASSWORD | xargs)
TOKEN=$(echo $TOKEN | xargs)
CHAT_ID=$(echo $CHAT_ID | xargs)

if [ "$ENABLED" != "true" ]; then
    echo "Backup is disabled in Admin Panel."
    exit 0
fi

if [ -z "$TOKEN" ] || [ -z "$CHAT_ID" ]; then
    echo "Telegram Token or Chat ID is missing."
    exit 0
fi

# Thực hiện backup
DATE=$(date +%d%m%Y_%H%M)
FILENAME="backup_$DATE.sql"
ZIPNAME="shop_backup_$DATE.zip"

cd $PROJECT_ROOT
pg_dump $DATABASE_URL > $FILENAME

if [ -n "$PASSWORD" ]; then
    zip -P "$PASSWORD" $ZIPNAME $FILENAME
else
    zip $ZIPNAME $FILENAME
fi

# Gửi qua Telegram
curl -F document=@"$ZIPNAME" "https://api.telegram.org/bot$TOKEN/sendDocument?chat_id=$CHAT_ID"

# Dọn dẹp
rm $FILENAME $ZIPNAME
`;

    // 3. Ghi file script
    fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });

    // 4. Đăng ký Cron Job (Chạy lúc 00:00 hằng ngày)
    // Kiểm tra xem đã có cron job chưa để tránh trùng lặp
    const cronJob = `0 0 * * * /bin/bash ${scriptPath} >> ${path.join(scriptsDir, "backup.log")} 2>&1`;
    
    try {
      const { stdout: currentCrontab } = await execPromise("crontab -l").catch(() => ({ stdout: "" }));
      
      if (!currentCrontab.includes(scriptPath)) {
        const newCrontab = currentCrontab.endsWith('\n') ? `${currentCrontab}${cronJob}\n` : `${currentCrontab}\n${cronJob}\n`;
        const tempCrontabFile = path.join(scriptsDir, "temp_cron");
        fs.writeFileSync(tempCrontabFile, newCrontab);
        await execPromise(`crontab ${tempCrontabFile}`);
        fs.unlinkSync(tempCrontabFile);
      }
    } catch (cronErr) {
      console.error("Cron Error:", cronErr);
      return NextResponse.json({ 
        error: "Đã tạo xong script nhưng không thể đăng ký Cron Job. Bạn có thể cần đăng ký thủ công: 0 0 * * * /bin/bash " + scriptPath 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "VPS backup setup completed" });
  } catch (error: any) {
    console.error("Setup VPS Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
