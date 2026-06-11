import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hashPassword } from "../src/lib/password";

const DATABASE_URL = process.env["DATABASE_URL"] ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 开始播种...\n");

  // ── 清理旧数据 ──
  await prisma.travelExperience.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ── 1. Admin 用户 ──
  const admin = await prisma.user.create({
    data: {
      name: "管理员",
      email: "admin@100ways.com",
      passwordHash: await hashPassword("admin123"),
      role: "ADMIN",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=admin",
      bio: "百途旅行的管理员，热爱旅行与代码。",
    },
  });
  console.log(`👤 Admin: ${admin.email} / admin123`);

  // ── 2. 5 个分类 ──
  const categoriesData = [
    { name: "城市探索", slug: "city-explore", description: "穿梭于大街小巷，感受都市脉搏与人文气息", icon: "🏙️" },
    { name: "自然风光", slug: "nature", description: "山川湖海，日月星辰，与大自然零距离接触", icon: "🏔️" },
    { name: "美食之旅", slug: "food-tour", description: "用味蕾丈量世界，从街头小吃到米其林餐桌", icon: "🍜" },
    { name: "极限冒险", slug: "adventure", description: "攀登、潜水、跳伞——突破自我，挑战极限", icon: "🧗" },
    { name: "文化体验", slug: "culture", description: "博物馆、古迹、民俗节庆，深度理解一方水土", icon: "🎭" },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.create({ data: c });
    categories[c.slug] = cat.id;
  }
  console.log(`📂 ${categoriesData.length} 个分类已创建`);

  // ── 3. 8 个旅行体验 ──
  const experiencesData: Array<{
    title: string; slug: string; description: string; location: string;
    price: number; duration: string; images: string; featured: boolean;
    published: boolean; categorySlug: string;
  }> = [
    {
      title: "东京深夜拉面巡礼", slug: "tokyo-ramen-tour",
      description: "深夜的新宿街头，霓虹灯映照着拉面馆的暖帘。从酱油到味噌，从豚骨到蘸面——三个小时，六家名店，一碗一碗吃透东京的深夜灵魂。",
      location: "日本 · 东京", price: 880, duration: "3 小时",
      images: JSON.stringify(["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800","https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"]),
      featured: true, published: true, categorySlug: "food-tour",
    },
    {
      title: "冰岛极光环岛自驾", slug: "iceland-aurora-drive",
      description: "驾驶越野车穿越冰岛一号公路，追逐北极光的足迹。从黄金瀑布到蓝冰洞，从黑沙滩到地热温泉——12 天环岛，遇见地球上最不像地球的风景。",
      location: "冰岛", price: 32800, duration: "12 天",
      images: JSON.stringify(["https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800","https://images.unsplash.com/photo-1476610182048-b716b8518aaa?w=800","https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=800"]),
      featured: true, published: true, categorySlug: "nature",
    },
    {
      title: "曼谷水上市场一日游", slug: "bangkok-floating-market",
      description: "清晨的丹嫩沙多水上市场，木船载满热带水果与手工艺品在运河中穿梭。品尝船面、芒果糯米饭，感受泰国最鲜活的水上生活。",
      location: "泰国 · 曼谷", price: 420, duration: "1 天",
      images: JSON.stringify(["https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800","https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800"]),
      featured: false, published: true, categorySlug: "city-explore",
    },
    {
      title: "巴黎卢浮宫深度导览", slug: "louvre-deep-tour",
      description: "避开人潮，跟随艺术史学家用 4 小时深度解读卢浮宫。从蒙娜丽莎到自由引导人民，从汉谟拉比法典到米洛的维纳斯——这不是打卡，是一场穿越 5000 年的对话。",
      location: "法国 · 巴黎", price: 1500, duration: "4 小时",
      images: JSON.stringify(["https://images.unsplash.com/photo-1565034946487-077786996e27?w=800","https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800"]),
      featured: true, published: true, categorySlug: "culture",
    },
    {
      title: "尼泊尔安纳普尔纳大环线徒步", slug: "annapurna-circuit-trek",
      description: "21 天徒步穿越安纳普尔纳山脉，从亚热带丛林到 5416 米的陀龙垭口。牦牛驼队、藏传佛寺、喜马拉雅雪峰——每一步都是对自我极限的叩问。",
      location: "尼泊尔", price: 16800, duration: "21 天",
      images: JSON.stringify(["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800","https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=800","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"]),
      featured: true, published: true, categorySlug: "adventure",
    },
    {
      title: "成都苍蝇馆子美食猎人", slug: "chengdu-street-food-hunt",
      description: "跟着本地老饕钻进成都最隐蔽的苍蝇馆子。从钵钵鸡到冒菜，从甜水面到蛋烘糕——一天八顿，吃懂川菜的 24 种味型。辣到流泪，香到想哭。",
      location: "中国 · 成都", price: 380, duration: "8 小时",
      images: JSON.stringify(["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800","https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"]),
      featured: false, published: true, categorySlug: "food-tour",
    },
    {
      title: "京都岚山竹林禅修体验", slug: "kyoto-bamboo-zen",
      description: "清晨 5 点的岚山竹林，薄雾中跟随临济宗禅师打坐、抄经、品抹茶。午后天龙寺庭园漫步，傍晚渡月桥看夕阳——在千年古都，找回内心的宁静。",
      location: "日本 · 京都", price: 2200, duration: "2 天",
      images: JSON.stringify(["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800","https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800"]),
      featured: false, published: true, categorySlug: "culture",
    },
    {
      title: "新西兰皇后镇跳伞", slug: "queenstown-skydive",
      description: "从 15000 英尺一跃而下，南阿尔卑斯山与瓦卡蒂普湖的全景铺展在脚下。45 秒自由落体，5 分钟滑翔——这是肾上腺素与美景的双重暴击。",
      location: "新西兰 · 皇后镇", price: 2800, duration: "半天",
      images: JSON.stringify(["https://images.unsplash.com/photo-1508615070457-7baeba4003e3?w=800","https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800"]),
      featured: true, published: true, categorySlug: "adventure",
    },
  ];

  for (const { categorySlug, ...data } of experiencesData) {
    await prisma.travelExperience.create({
      data: { ...data, authorId: admin.id, categoryId: categories[categorySlug] },
    });
  }
  console.log(`✈️  ${experiencesData.length} 个旅行体验已创建`);

  console.log("\n✅ 种子数据播种完成！");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 后台登录: admin@100ways.com / admin123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => { console.error("❌ 播种失败:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
