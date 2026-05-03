import 'dotenv/config'
import { PrismaClient, ProductType } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { slugify } from '../src/lib/utils'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Clean up existing data
  console.log('--- ĐANG DỌN DẸP DATA CŨ ---')
  await prisma.accountSecret.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.cartItem.deleteMany({})
  await prisma.bankInfo.deleteMany({})
  await prisma.post.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.categoryGroup.deleteMany({})

  // 2. Find or create an Admin user for Blog Posts and Product Uploads
  console.log('--- ĐANG TẠO TÀI KHOẢN ADMIN ---')
  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!admin) {
    const hashedPassword = await bcrypt.hash("111111", 10);
    admin = await prisma.user.create({
      data: {
        name: "Admin ShopOnePlay",
        email: "admin@shoponeplay.com",
        password: hashedPassword,
        role: 'ADMIN',
      }
    })
  }

  // 3. Create Category Groups
  const groupPlay = await prisma.categoryGroup.create({
    data: {
      name: "TÀI KHOẢN PLAY",
      slug: "tai-khoan-play",
    }
  })

  const groupRandom = await prisma.categoryGroup.create({
    data: {
      name: "TÀI KHOẢN RANDOM",
      slug: "tai-khoan-random",
    }
  })

  const groupService = await prisma.categoryGroup.create({
    data: {
      name: "DỊCH VỤ",
      slug: "dich-vu",
    }
  })

  // 3. Create Categories for PLAY
  const catVip = await prisma.category.create({
    data: {
      name: "Acc Play VIP",
      slug: "acc-play-vip",
      groupId: groupPlay.id,
      startingPrice: 500000,
      image: "/images/categories/cat_play.png"
    }
  })

  const catSoSinh = await prisma.category.create({
    data: {
      name: "Acc Play Sơ Sinh",
      slug: "acc-play-so-sinh",
      groupId: groupPlay.id,
      startingPrice: 20000,
      image: "/images/categories/cat_play.png"
    }
  })

  // 4. Create Categories for RANDOM
  const catRand9k = await prisma.category.create({
    data: {
      name: "Random 9k",
      slug: "random-9k",
      groupId: groupRandom.id,
      startingPrice: 9000,
      image: "/images/categories/cat_rand.png"
    }
  })

  const catRand20k = await prisma.category.create({
    data: {
      name: "Random 20k",
      slug: "random-20k",
      groupId: groupRandom.id,
      startingPrice: 20000,
      image: "/images/categories/cat_rand.png"
    }
  })

  // 5. Create Sample Products & Real Secrets
  const categories = [catVip, catSoSinh, catRand9k, catRand20k]

  for (const cat of categories) {
    const isRandom = cat.slug.includes('random')
    const stockToCreate = isRandom ? 50 : 1

    // Tạo Sản phẩm
    const product = await prisma.product.create({
      data: {
        price: cat.startingPrice || 50000,
        type: isRandom ? ProductType.RANDOM : ProductType.PLAY,
        categoryId: cat.id,
        uploaderId: admin.id, // Gán admin làm người đăng mặc định
        thumbnail: "/images/product.png",
        images: ["/images/product.png", "/images/product.png"],
        description: [
          "Acc Cần Cơ Khí - Gió Mùa",
          "1.500.000 Tiền Sao",
          "Full Thông Tin - Bảo Hành"
        ],
        stock: stockToCreate, // Gán stock ban đầu
        stats: isRandom ? { "Tỉ lệ trúng VIP": "20%" } : { "Level": 350, "Rank": "Kim Cương" }
      }
    })

    // Nạp Tài khoản vào Kho (AccountSecret)
    const secretsData = []
    for (let i = 1; i <= stockToCreate; i++) {
      secretsData.push({
        productId: product.id,
        uploaderId: admin.id, // Gán admin làm người đăng mặc định
        username: `user_${cat.slug}_${i}`,
        password: `pass_${Math.random().toString(36).substring(7)}`,
        extraInfo: `Code: ${Math.floor(100000 + Math.random() * 900000)}`
      })
    }

    await prisma.accountSecret.createMany({
      data: secretsData
    })

    console.log(`- Đã tạo: ${cat.name} | Kho thực tế: ${stockToCreate} tài khoản.`)
  }

  // 6. Create Bank Info
  await prisma.bankInfo.createMany({
    data: [
      {
        bankName: "MBBank",
        accountNumber: "0329000000",
        accountName: "NGUYEN VAN A",
        logo: "/images/banks/mbbank.svg",
        isActive: true
      }
    ]
  })

  // 6. Create Bank Info

  const postsData = [
    {
      title: "Cách bảo mật tài khoản Play Together tuyệt đối trong năm 2026",
      excerpt: "Trong bối cảnh các hành vi lừa đảo ngày càng tinh vi, việc bảo vệ tài khoản game của bạn là ưu tiên hàng đầu. Khám phá các bước để bảo mật tài khoản của bạn ngay hôm nay...",
      content: `
        <p>Trong bối cảnh các hành vi lừa đảo ngày càng tinh vi, việc bảo vệ tài khoản game của bạn là ưu tiên hàng đầu. Dưới đây là hướng dẫn chi tiết giúp bạn bảo vệ tài sản ảo của mình.</p>
        
        <h2>1. Kích hoạt xác thực 2 lớp (2FA)</h2>
        <p>Đây là bước quan trọng nhất mà bất kỳ game thủ nào cũng không nên bỏ qua. Việc cài đặt 2FA giúp ngăn chặn sự truy cập trái phép ngay cả khi kẻ xấu biết mật khẩu của bạn.</p>
        <h3>Sử dụng Google Authenticator</h3>
        <p>Google Authenticator là ứng dụng phổ biến và an toàn nhất hiện nay. Bạn chỉ cần quét mã QR và nhập mã 6 số được làm mới mỗi 30 giây.</p>
        <h3>Xác thực qua Email dự phòng</h3>
        <p>Đảm bảo email dự phòng của bạn cũng được bảo mật tốt. Đây là "chìa khóa" cuối cùng để khôi phục tài khoản khi gặp sự cố.</p>

        <h2>2. Cảnh giác với các trang web lừa đảo</h2>
        <p>Kẻ xấu thường tạo ra các trang web có giao diện giống hệt trang chủ hoặc trang nạp thẻ để đánh cắp thông tin đăng nhập.</p>
        <h3>Kiểm tra tên miền (Domain)</h3>
        <p>Luôn kiểm tra kỹ địa chỉ URL trên thanh trình duyệt. Các trang giả mạo thường sai khác một vài ký tự nhỏ mà bạn có thể không để ý.</p>
        
        <h2>3. Không chia sẻ thông tin tài khoản</h2>
        <p>Tuyệt đối không đưa mật khẩu hay mã OTP cho bất kỳ ai, kể cả những người tự xưng là Admin hoặc nhân viên hỗ trợ của trò chơi.</p>
      `,
      category: "guides",
      image: "/images/categories/cat_play.png",
      featured: true,
      published: true,
      readTime: "5 phút đọc",
      authorId: admin.id
    },
    {
      title: "Sự kiện siêu ưu đãi: Nạp Kim Cương nhận ngay 20% chiết khấu",
      excerpt: "Chào mừng phiên bản mới của Play Together, ShopOnePlay mang đến chương trình ưu đãi cực lớn cho toàn bộ khách hàng...",
      content: `
        <p>Chào mừng phiên bản mới của Play Together, ShopOnePlay mang đến chương trình ưu đãi cực lớn cho toàn bộ khách hàng khi thực hiện giao dịch trên hệ thống.</p>
        
        <h2>Thông tin chi tiết chương trình</h2>
        <p>Chương trình áp dụng cho tất cả các hình thức nạp thẻ và chuyển khoản qua ngân hàng, ví điện tử trên website ShopOnePlay.</p>
        
        <h2>Thời gian diễn ra sự kiện</h2>
        <p>Sự kiện bắt đầu từ ngày 01/01/2026 và dự kiến kéo dài đến hết ngày 31/01/2026 hoặc cho đến khi hết ngân sách khuyến mãi.</p>

        <h2>Các mức chiết khấu hấp dẫn</h2>
        <h3>Nạp qua ATM/Momo</h3>
        <p>Nhận ngay 20% giá trị nạp vào số dư tài khoản shop. Ví dụ: Nạp 100k nhận 120k.</p>
        <h3>Nạp qua thẻ cào</h3>
        <p>Nhận ngay 10% giá trị nạp sau khi đã trừ phí gạch thẻ từ nhà mạng.</p>
      `,
      category: "events",
      image: "/images/categories/cat_service.png",
      featured: false,
      published: true,
      readTime: "3 phút đọc",
      authorId: admin.id
    },
    {
      title: "Tổng hợp Giftcode Play Together mới nhất tuần này",
      excerpt: "Đừng bỏ lỡ cơ hội nhận hàng ngàn phần quà giá trị với bộ Giftcode vừa được nhà phát hành tung ra...",
      content: `
        <p>Dưới đây là danh sách tổng hợp các mã Giftcode còn hạn sử dụng cho tựa game Play Together trong tuần này. Hãy nhanh tay nhập mã để nhận quà nhé!</p>
        
        <h2>Danh sách Giftcode mới nhất</h2>
        <p>Các mã code này thường có số lượng giới hạn, vì vậy bạn nên nhập ngay khi xem được bài viết này.</p>
        <h3>Code dành cho tân thủ</h3>
        <p>Mã: <strong>PLAYTOGETHER2026</strong> - Quà tặng: 500 Tiền sao, 1 trang phục thỏ hồng.</p>
        <h3>Code sự kiện mừng năm mới</h3>
        <p>Mã: <strong>WELCOME2026</strong> - Quà tặng: 10 Kim cương, 2 hộp quà may mắn.</p>
        
        <h2>Hướng dẫn cách nhập Code</h2>
        <p>Để nhập code, bạn vui lòng truy cập vào phần Cài đặt trong game, chọn mục "Nhập mã quà tặng" và điền chính xác các ký tự phía trên.</p>
      `,
      category: "giftcode",
      image: "/images/categories/cat_play.png",
      featured: false,
      published: true,
      readTime: "2 phút đọc",
      authorId: admin.id
    }
  ]

  for (const post of postsData) {
    const shortId = Math.random().toString(36).substring(7, 11);
    const dynamicSlug = `${slugify(post.title)}-${shortId}`;

    await prisma.post.create({
      data: {
        ...post,
        slug: dynamicSlug
      }
    })
  }

  // 7. Create Config (Key-Value)
  console.log('--- ĐANG TẠO CẤU HÌNH WEBSITE (CONFIG) ---')
  const defaultConfigs = [
    { key: "siteName", value: "ShopOnePlay" },
    { key: "siteTitle", value: "ShopOnePlay - Shop Bán Acc Uy Tín" },
    { key: "siteDescription", value: "Hệ Thống Mua Bán Tài Khoản Game Uy Tín" },
    { key: "contactEmail", value: "shoponeplay.com@gmail.com" },
    { key: "contactPhone", value: "0999999999" },
    { key: "facebookUrl", value: "https://facebook.com" },
    { key: "zaloUrl", value: "https://zalo.me" },
    { key: "siteLogo", value: "" },
    { key: "siteFavicon", value: "" },
    { key: "siteBanner", value: "" },
    { key: "siteFooterLogo", value: "" }
  ];

  for (const config of defaultConfigs) {
    await prisma.config.upsert({
      where: { key: config.key },
      update: {
        value: config.value
      },
      create: {
        key: config.key,
        value: config.value
      }
    });
  }

  console.log('--- HOÀN TẤT NẠP DỮ LIỆU ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
