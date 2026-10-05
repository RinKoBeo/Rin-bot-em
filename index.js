require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");

const TOKEN = process.env.TOKEN;
// Điền ID Kênh mày muốn bot tự gửi bảng shop vào đây (hoặc để trong file .env)
const CHANNEL_ID = process.env.CHANNEL_ID || "1556570409015582722";

// ============================================================
// DANH SÁCH MẶT HÀNG — sửa/thêm/bớt thoải mái ở đây
// ============================================================
const ITEMS = [
  {
    name: " Yêu Từ Bé Premium 1 Tháng",
    iconUrl: "https://raw.githubusercontent.com/ten-repo/ten-anh/main/youtube.png",
    options: [
      { label: "1 tháng", price: "30.000đ" },
      { label: "3 tháng", price: "110.000đ" },
      { label: "6 tháng", price: "150.000đ" },
      { label: "1 năm", price: "270.000đ" }
    ],
  },
  {
    name: " N1tr0 Bút",
    iconUrl: "https://raw.githubusercontent.com/ten-repo/ten-anh/main/nitro.png",
    options: [
      { label: "1 tháng", price: "110.000đ" },
      { label: "2 tháng", price: "130.000đ" },
      { label: "3 tháng", price: "120.000đ" },
      { label: "1 năm", price: "900.000đ" }
    ],
    note: "Đây là dạng log nên cần Tài khoản/mật khẩu",
  },
  {
    name: "Robux 120h / Plus / Group / Gift Gamepass",
    iconUrl: "https://raw.githubusercontent.com/ten-repo/ten-anh/main/robux.png",
    options: [
      { label: "120h [Bank]", price: "10.000đ", note: "70 Robux chưa thuế" },
      { label: "120h [Card]", price: "10.000đ", note: "60 Robux chưa thuế" },
      { label: "Plus [Bank]", price: "10.000đ", note: "30 Robux chưa thuế" },
      { label: "Plus [Card]", price: "10.000đ", note: "20 Robux chưa thuế" },
      { label: "Group [Bank]", price: "10.000đ", note: "50 Robux chưa thuế" },
      { label: "Group [Card]", price: "10.000đ", note: "40 Robux chưa thuế" },
      { label: "Gift Gamepass [Bank]", price: "10.000đ", note: "60 Robux chưa thuế" },
      { label: "Gift Gamepass [Card]", price: "10.000đ", note: "50 Robux chưa thuế" },
    ]
  },
  {
    name: "Giá Decor Log Dis cọt",
    iconUrl: "https://raw.githubusercontent.com/ten-repo/ten-anh/main/roblox.png",
    note: " Lưu ý: Đây là dạng log (cần cung cấp tài khoản và mật khẩu)",
    options: [
      { label: "Gói Decor 1", price: "66.000đ -> 40.000đ" },
      { label: "Gói Decor 2", price: "72.000đ -> 50.000đ" },
      { label: "Gói Decor 3", price: "92.000đ -> 60.000đ" },
      { label: "Gói Decor 4", price: "105.000đ -> 75.000đ" },
      { label: "Gói Decor 5", price: "111.000đ -> 80.000đ" },
      { label: "Gói Decor 6", price: "131.000đ -> 95.000đ" },
      { label: "Gói Decor 7", price: "141.000đ -> 100.000đ" },
    ]
  },
  {
    name: "Gói Decor Gíp Dis cọt",
    iconUrl: "https://raw.githubusercontent.com/ten-repo/ten-anh/main/roblox.png",
    note: " Lưu ý: Đây là dạng Gíp (Không cần cung cấp tài khoản và mật khẩu)",
    options: [
      { label: "Gói Decor 1", price: "66.000đ -> 55.000đ" },
      { label: "Gói Decor 2", price: "72.000đ -> 65.000đ" },
      { label: "Gói Decor 3", price: "92.000đ -> 75.000đ" },
      { label: "Gói Decor 4", price: "105.000đ -> 85.000đ" },
      { label: "Gói Decor 5", price: "111.000đ -> 95.000đ" },
      { label: "Gói Decor 6", price: "131.000đ -> 120.000đ" },
      { label: "Gói Decor 7", price: "141.000đ -> 125.000đ" },
      { label: "Gói Decor 8", price: "189.000đ -> 150.000đ" },
    ]
  },
  {
    name: "Bảng giá N1tr0 random",
    iconUrl: "https://raw.githubusercontent.com/ten-repo/ten-anh/main/roblox.png",
    note: "Cần T0k3n Bot để Bot làm nitro tỉ lệ là 49% basic/49% là bút / 2% là decor limited hoặc item thưởng"
  },
  {
    name: "Bảng giá Spotify Premium",
    iconUrl: "https://raw.githubusercontent.com/ten-repo/ten-anh/main/roblox.png",
    options: [
      { label: "3 tháng chính chủ", price: "130.000đ" },
      { label: "6 tháng chính chủ", price: "175.000đ" },
      { label: "1 năm chính chủ", price: "300.000đ" }
    ]
  },
  {
    name: "Bảng giá Bút server",
    iconUrl: "https://raw.githubusercontent.com/ten-repo/ten-anh/main/roblox.png",
    note: "Tạo Ticket để biết giá,giá dao động từ 100k-400k cho 1-3 tháng ( có bán lẻ từ 2 cái trở lên )"
  }
];
// ============================================================

// ============================================================
// postShopItem - Gửi 1 mặt hàng vào kênh (Tên TO NẰM TRONG EMBED)
// ============================================================
async function postShopItem(channel, item) {
  const embed = new EmbedBuilder()
    .setThumbnail(item.iconUrl)
    .setColor(0x2b2d31);

  // Đưa tên món dạng Header (##) vào thẳng Mô tả để chữ TO và nằm TRONG Embed
  let desc = `## ${item.name}\n\n`;

  // 1. Nếu món có mảng options (nhiều gói giá)
  if (item.options && item.options.length > 0) {
    const lines = item.options.map(opt => {
      let line = `• **${opt.label}:** \`${opt.price}\``;
      if (opt.note) line += ` ➔ *${opt.note}*`;
      return line;
    });
    desc += lines.join("\n");
  }

  // 2. Nếu món có price lẻ
  if (item.price) {
    if (desc && !desc.endsWith("\n\n")) desc += "\n";
    desc += `> **Giá:** \`${item.price}\``;
  }

  // 3. Nếu món có note chung ở ngoài
  if (item.note) {
    if (desc) desc += "\n\n";
    desc += `> ${item.note}`;
  }

  embed.setDescription(desc);

  // Chỉ gửi Embed, không gửi text nằm ngoài
  return channel.send({
    embeds: [embed],
  });
}

// Gửi toàn bộ danh sách ITEMS
async function postShopList(channel, items) {
  for (const item of items) {
    await postShopItem(channel, item);
  }
}

// ============================================================
// KHỞI TẠO BOT & TỰ ĐỘNG GỬI KHIN ONLINE
// ============================================================
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  console.log(`Bot online thành công với tên: ${client.user.tag}`);

  // Tìm kênh theo ID đã cài đặt
  const channel = await client.channels.fetch(CHANNEL_ID).catch(err => {
    console.error("Lỗi khi tìm kênh ID:", err.message);
    return null;
  });

  if (!channel) {
    console.error("❌ Không tìm thấy kênh! Mày hãy kiểm tra lại CHANNEL_ID xem đã chính xác chưa.");
    return;
  }

  console.log(`🚀 Đang tiến hành tự động đăng bảng shop vào kênh: #${channel.name}...`);

  try {
    await postShopList(channel, ITEMS);
    console.log("✅ Đã gửi bảng shop vào kênh thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi gửi tin nhắn vào kênh:", err.message);
  }
});

// ===== LOGIN =====
client.login(process.env.TOKEN);