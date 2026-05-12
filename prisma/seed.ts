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
  await prisma.gameService.deleteMany({})
  await prisma.hackTool.deleteMany({})

  // ... (giữ nguyên phần tạo admin và category groups)

  // 2. Find or create an Admin user for Blog Posts and Product Uploads
  console.log('--- ĐANG TẠO TÀI KHOẢN ADMIN ---')
  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!admin) {
    const hashedPassword = await bcrypt.hash("111111", 10);
    admin = await prisma.user.create({
      data: {
        name: "Admin",
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
  const cat1xx = await prisma.category.create({
    data: {
      name: "ACC 1XX - 5XX",
      slug: "acc-1xx-5xx",
      groupId: groupPlay.id,
      startingPrice: 100000,
      image: "/images/categories/1xx-5xx.gif"
    }
  })

  const cat5xx = await prisma.category.create({
    data: {
      name: "ACC 5XX - 1M",
      slug: "acc-5xx-1m",
      groupId: groupPlay.id,
      startingPrice: 500000,
      image: "/images/categories/5xx-1m.gif"
    }
  })

  const cat1m = await prisma.category.create({
    data: {
      name: "ACC 1M - 1M5",
      slug: "acc-1m-1m5",
      groupId: groupPlay.id,
      startingPrice: 1000000,
      image: "/images/categories/1m-1m5.gif"
    }
  })

  const cat1m5 = await prisma.category.create({
    data: {
      name: "ACC 1M5 - 2M",
      slug: "acc-1m5-2m",
      groupId: groupPlay.id,
      startingPrice: 1500000,
      image: "/images/categories/1m5-2m.gif"
    }
  })

  // 4. Create Categories for RANDOM
  const catCoKhi = await prisma.category.create({
    data: {
      name: "ACC CƠ KHÍ",
      slug: "acc-co-khi",
      groupId: groupRandom.id,
      startingPrice: 50000,
      image: "/images/categories/random1.png"
    }
  })

  const cat99k = await prisma.category.create({
    data: {
      name: "ACC 99K",
      slug: "acc-99k",
      groupId: groupRandom.id,
      startingPrice: 99000,
      image: "/images/categories/random2.png"
    }
  })

  // 5. Create Sample Products & Real Secrets
  const categories = [cat1xx, cat5xx, cat1m, cat1m5, catCoKhi, cat99k]

  for (const cat of categories) {
    const isRandom = cat.groupId === groupRandom.id
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
        bankName: "ACB",
        accountNumber: "955786",
        accountName: "HUYNH QUYET THANG",
        logo: "/images/banks/acb.svg",
        isActive: true
      }
    ]
  })

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
    { key: "DEPOSIT_PREFIX", value: "" },
    { key: "DEPOSIT_SUFFIX", value: "chuyen tien" },
    { key: "DEPOSIT_MIN_AMOUNT", value: "10000" },
    { key: "PAY2S_TOKEN", value: "96d615f68f46ac53577295014a0cd8501595572b4d65ec58b8" },
    { key: "TELEGRAM_TOKEN", value: "7816461580:AAGg4fEoHLEbuEd8uE9l-FsX9pg2VkQUMqk" },
    { key: "TELEGRAM_ID", value: "5661137513" },
    { key: "TELEGRAM_ENABLED", value: "true" },
    { key: "TELEGRAM_NOTIFY_ORDER", value: "true" },
    { key: "TELEGRAM_NOTIFY_WITHDRAW", value: "true" },
    { key: "TELEGRAM_NOTIFY_TOPUP_QR", value: "true" },
    { key: "siteLogo", value: "" },
    { key: "siteFavicon", value: "" },
    { key: "siteBanner", value: "/images/hero/banner_bg.png" },
    { key: "siteFooterLogo", value: "" },
    { key: "HACKVIET_EMAIL", value: "acckidphong02@gmail.com" },
    { key: "HACKVIET_PASSWORD", value: "Oneone111@" },
    { key: "HACKVIET_BASE_URL", value: "https://hackviet.io" },
    { key: "HACKVIET_SHOP_SLUG", value: "shop-82-kcvara" },
    { key: "HACKVIET_GAME_SLUG", value: "play-together" },
    { key: "HACKVIET_KEEP_ALIVE_MINUTES", value: "90" },
    { key: "LINK4M_API_TOKEN", value: "6601738a18be877d2b4c6fd5" },
    { key: "NAPGAME_HOT_CONFIG", value: JSON.stringify([
      { name: "Thành viên Plus (7 Ngày)", order: 1 },
      { name: "Thành Viên Bán Tức Thì", order: 2 },
      { name: "Thành viên Plus (30 Ngày)", order: 3 },
      { name: "Chọn công cụ Chào mừng!", order: 4 }
    ])},
    { key: "NAPGAME_MARKUP_PERCENT", value: "20" },
    { key: "MAINTENANCE_MODE", value: "false" },
    { key: "PUSHER_APP_ID", value: "2033163" },
    { key: "PUSHER_KEY", value: "bcba1808f86c8b328f4c" },
    { key: "PUSHER_SECRET", value: "cfcefe0bd62ec56815a9" },
    { key: "PUSHER_CLUSTER", value: "ap1" }
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

  // 8. Create Game Services
  console.log('--- ĐANG TẠO DỊCH VỤ GAME ---')
  await prisma.gameService.create({
    data: {
      name: "DỊCH VỤ CÀY THUÊ",
      slug: "dich-vu-cay-thue",
      thumbnail: "/images/categories/cat_service.png",
      description: "Dịch vụ cày thuê Play Together uy tín, nhanh chóng, bảo mật thông tin tài khoản tuyệt đối.",
      type: "LEVELING",
      status: "ACTIVE",
      options: {
        create: [
          { name: "Gói Cày Tiền 500k", price: 50000, status: "ACTIVE" },
          { name: "Gói Cày Tiền 1M", price: 100000, status: "ACTIVE" }
        ]
      }
    }
  })

  // 9. Create Hack Tools
  console.log('--- ĐANG TẠO HACK TOOLS ---')
  await prisma.hackTool.create({
    data: {
      name: "Hack Play Together",
      slug: "play-together",
      version: "2.26.0",
      externalId: 1,
      description: "Phầm Mềm Hỗ Trợ Chơi Game Cùng Nhiều Tính Năng Hay",
      thumbnail: "/uploads/hacks/default.webp",
      downloadUrl: [
        { label: "PLAY TOGETHER VNG", url: "https://www.mediafire.com/file/3rpkoow23j3d7ki/PLAY_TOGETHER_VNG_2.26.0.apk/file" },
        { label: "PLAY TOGETHER GLOBAL", url: "https://www.mediafire.com/file/on6ipzf1ibayny7/PLAY_TOGETHER_GLOBAL_2.26.0.apk/file" }
      ],
      fileName: "PLAY_TOGETHER_VNG_2.26.0.apk",
      fileSize: "2.2GB",
      features: [
        { name: "Tự Động Tới", category: "Chung", isVip: true },
        { name: "Sửa Dụng Cụ", category: "Chung" },
        { name: "Bảo Quản", category: "Chung" },
        { name: "Mở Hộp Quà/Gói Thẻ", category: "Chung", isVip: true },
        { name: "Chức Năng Gói Bán Nhanh", category: "Chung", isVip: true },
        { name: "Hiện Bảng Thông Tin", category: "Chung", isVip: true },
        { name: "Khôi Phục Trạng Thái", category: "Chung" },
        { name: "Nhận Thành Tích", category: "Chung" },
        { name: "Câu Cá", category: "Câu Cá" },
        { name: "Kích Hoạt Lọc", category: "Câu Cá", isVip: true },
        { name: "Lọc Bóng 1", category: "Câu Cá" },
        { name: "Lọc Bóng 2", category: "Câu Cá" },
        { name: "Lọc Bóng 3", category: "Câu Cá" },
        { name: "Lọc Bóng 4", category: "Câu Cá" },
        { name: "Lọc Bóng 5", category: "Câu Cá" },
        { name: "Lọc Bóng 6", category: "Câu Cá" },
        { name: "Lọc Bóng 7", category: "Câu Cá", isVip: true },
        { name: "Tự Động Đập Đá", category: "Thu Thập" },
        { name: "Nhặt Thẻ", category: "Thu Thập", isVip: true },
        { name: "Nhặt Nguyên Liệu", category: "Thu Thập", isVip: true },
        { name: "Tự Động Đổi Map", category: "Thu Thập" },
        { name: "Tốc Độ Đổi Map", category: "Thu Thập", isVip: true },
        { name: "Tốc Độ Đập Đá", category: "Thu Thập" },
        { name: "Lọc Mạch Khoáng/Ngọc/Quặng", category: "Thu Thập" },
        { name: "Tự Động Bắt Côn Trùng", category: "Côn Trùng" },
        { name: "Đóng Băng Côn Trùng", category: "Côn Trùng", isVip: true },
        { name: "Bắt Côn Trùng Trên Trời", category: "Côn Trùng", isVip: true },
        { name: "Tự Động Bán Côn Trùng", category: "Côn Trùng" },
        { name: "Tốc Độ Bắt Côn Trùng", category: "Côn Trùng", isVip: true },
        { name: "Lọc Côn Trùng Hiếm", category: "Côn Trùng", isVip: true },
        { name: "Săn Quái Vật", category: "Sự Kiện", isVip: true },
        { name: "Auto Nông Trại", category: "Sự Kiện" },
        { name: "Định Vị Sự Kiện", category: "Sự Kiện" },
        { name: "Đổi Map Nhanh (Plaza/Camp/City...)", category: "Bản Đồ" },
        { name: "Dịch Chuyển NPC Trong Map", category: "Bản Đồ", isVip: true },
        { name: "Auto Mini Game (Zombie/Leo Tháp...)", category: "Mini Game", isVip: true },
        { name: "Auto Kho Báu/Obby/Sky High", category: "Mini Game" },
      ],
      requirements: "Android 10+ Hoặc Máy Ảo Android 10+",
      changelog: [
        { version: "2.26.0", content: "Cập nhật tương thích phiên bản game mới nhất, fix lỗi auto câu cá, thêm tính năng bắt côn trùng tự động.", date: "09/05/2026" }
      ],
      prices: [
        { label: "1 Ngày", price: 10000 },
        { label: "1 Tuần", price: 50000 },
        { label: "2 Tuần", price: 80000 },
        { label: "3 Tuần", price: 120000 },
        { label: "1 Tháng", price: 150000 },
        { label: "6 Tháng", price: 750000 },
        { label: "1 Năm", price: 1500000 }
      ],
      videoUrl: "https://youtube.com",
      status: "ACTIVE",
    }
  })

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
