/**
 * Integration Guides - Tutorial untuk membantu user non-teknis
 * mendapatkan API keys dari berbagai layanan
 */

export type IntegrationGuide = {
  title: string
  description: string
  steps: string[]
  link: string
  linkText: string
  icon: string
  videoUrl?: string
  tips?: string[]
}

export type ProviderConfig = {
  name: string
  icon: string
  color: string
  fields: {
    key: string
    label: string
    type: "text" | "password" | "tel" | "email"
    placeholder: string
    required: boolean
    helpText?: string
  }[]
  guide: IntegrationGuide
}

export const INTEGRATION_PROVIDERS: Record<string, ProviderConfig> = {
  WHATSAPP: {
    name: "WhatsApp Business",
    icon: "💬",
    color: "#25D366",
    fields: [
      {
        key: "phoneNumber",
        label: "Nomor WhatsApp Business",
        type: "tel",
        placeholder: "+62812xxxxxxxx",
        required: true,
        helpText: "Nomor yang terdaftar di WhatsApp Business API",
      },
      {
        key: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "Masukkan API Key dari provider",
        required: true,
      },
      {
        key: "businessId",
        label: "Business Account ID",
        type: "text",
        placeholder: "ID akun bisnis Anda",
        required: true,
      },
    ],
    guide: {
      title: "Cara Mendapatkan WhatsApp Business API",
      description: "WhatsApp Business API memungkinkan Anda mengirim pesan otomatis ke pelanggan.",
      steps: [
        "Daftar ke WhatsApp Business Solution Provider (BSP) seperti Wati.io, Twilio, atau 360dialog",
        "Verifikasi bisnis Anda dengan Facebook Business Manager",
        "Setelah disetujui, Anda akan mendapat akses ke dashboard provider",
        "Di dashboard, cari bagian 'API Keys' atau 'Credentials'",
        "Copy API Key dan Business Account ID",
        "Paste ke form di sebelah kiri ini",
      ],
      link: "https://business.whatsapp.com/products/business-api",
      linkText: "Pelajari lebih lanjut di WhatsApp Business",
      icon: "💬",
      tips: [
        "Pastikan nomor WhatsApp belum pernah digunakan untuk WhatsApp personal",
        "Proses verifikasi bisnis biasanya memakan waktu 1-3 hari kerja",
        "Pilih BSP yang menyediakan free trial untuk testing",
      ],
    },
  },

  TELEGRAM: {
    name: "Telegram Bot",
    icon: "✈️",
    color: "#0088cc",
    fields: [
      {
        key: "botToken",
        label: "Bot Token",
        type: "password",
        placeholder: "123456789:ABCdefGHI...",
        required: true,
        helpText: "Token dari BotFather",
      },
      {
        key: "chatId",
        label: "Chat ID (opsional)",
        type: "text",
        placeholder: "-1001234567890",
        required: false,
        helpText: "ID grup atau channel untuk notifikasi",
      },
    ],
    guide: {
      title: "Cara Membuat Telegram Bot",
      description: "Buat bot Telegram untuk mengirim notifikasi otomatis ke grup atau channel Anda.",
      steps: [
        "Buka Telegram dan cari @BotFather",
        "Ketik /newbot dan ikuti instruksi",
        "Berikan nama untuk bot Anda (contoh: Toko Saya Bot)",
        "Berikan username untuk bot (harus diakhiri 'bot', contoh: tokosaya_bot)",
        "BotFather akan memberikan Token API - copy token tersebut",
        "Paste token ke form di sebelah kiri",
        "(Opsional) Untuk Chat ID, tambahkan bot ke grup lalu gunakan @getidsbot",
      ],
      link: "https://core.telegram.org/bots#botfather",
      linkText: "Dokumentasi Telegram Bot",
      icon: "✈️",
      tips: [
        "Simpan token dengan aman, jangan share ke orang lain",
        "Untuk mengirim ke grup, bot harus dijadikan admin",
        "Gunakan /setdescription di BotFather untuk menambah deskripsi bot",
      ],
    },
  },

  SMS_GATEWAY: {
    name: "SMS Gateway",
    icon: "📱",
    color: "#FF6B6B",
    fields: [
      {
        key: "provider",
        label: "Provider",
        type: "text",
        placeholder: "twilio / nexmo / zenziva",
        required: true,
        helpText: "Nama provider SMS gateway Anda",
      },
      {
        key: "apiKey",
        label: "API Key / Account SID",
        type: "password",
        placeholder: "API Key dari provider",
        required: true,
      },
      {
        key: "apiSecret",
        label: "API Secret / Auth Token",
        type: "password",
        placeholder: "API Secret dari provider",
        required: true,
      },
      {
        key: "senderId",
        label: "Sender ID",
        type: "text",
        placeholder: "TOKOSAYA",
        required: false,
        helpText: "Nama pengirim yang muncul di SMS",
      },
    ],
    guide: {
      title: "Cara Setup SMS Gateway",
      description: "SMS Gateway memungkinkan Anda mengirim SMS notifikasi ke pelanggan.",
      steps: [
        "Pilih provider SMS: Twilio (internasional), Zenziva/Raja SMS (Indonesia)",
        "Daftar akun di website provider pilihan Anda",
        "Verifikasi email dan nomor telepon",
        "Top up saldo (biasanya mulai dari Rp 50.000)",
        "Buka menu API/Developer di dashboard",
        "Copy API Key dan API Secret",
        "Paste ke form di sebelah kiri",
      ],
      link: "https://www.twilio.com/docs/sms",
      linkText: "Dokumentasi Twilio SMS",
      icon: "📱",
      tips: [
        "Untuk Indonesia, Zenziva dan Raja SMS lebih murah dari Twilio",
        "Sender ID memerlukan registrasi khusus di beberapa provider",
        "Test kirim SMS ke nomor Anda sendiri sebelum production",
      ],
    },
  },

  EMAIL: {
    name: "Email SMTP",
    icon: "📧",
    color: "#4A90D9",
    fields: [
      {
        key: "smtpHost",
        label: "SMTP Host",
        type: "text",
        placeholder: "smtp.gmail.com",
        required: true,
      },
      {
        key: "smtpPort",
        label: "SMTP Port",
        type: "text",
        placeholder: "587",
        required: true,
      },
      {
        key: "smtpUser",
        label: "Email / Username",
        type: "email",
        placeholder: "email@domain.com",
        required: true,
      },
      {
        key: "smtpPass",
        label: "Password / App Password",
        type: "password",
        placeholder: "Password atau App Password",
        required: true,
      },
      {
        key: "fromName",
        label: "Nama Pengirim",
        type: "text",
        placeholder: "Toko Saya",
        required: false,
      },
    ],
    guide: {
      title: "Cara Setup Email SMTP",
      description: "Kirim email otomatis seperti konfirmasi order, invoice, dan newsletter.",
      steps: [
        "Pilih layanan email: Gmail, Outlook, atau SMTP provider (SendGrid, Mailgun)",
        "Untuk Gmail: Aktifkan 2-Factor Authentication di akun Google",
        "Buka myaccount.google.com > Security > App passwords",
        "Generate App Password baru untuk 'Mail'",
        "Copy password 16 karakter yang muncul",
        "Gunakan smtp.gmail.com port 587 dengan email dan app password tadi",
      ],
      link: "https://support.google.com/accounts/answer/185833",
      linkText: "Cara membuat App Password Google",
      icon: "📧",
      tips: [
        "Jangan gunakan password akun utama, selalu gunakan App Password",
        "Untuk volume tinggi (>500 email/hari), gunakan SendGrid atau Mailgun",
        "Test kirim email ke diri sendiri sebelum production",
      ],
    },
  },

  SHOPEE: {
    name: "Shopee",
    icon: "🛒",
    color: "#EE4D2D",
    fields: [
      {
        key: "shopId",
        label: "Shop ID",
        type: "text",
        placeholder: "ID toko Shopee Anda",
        required: true,
      },
      {
        key: "partnerId",
        label: "Partner ID",
        type: "text",
        placeholder: "Partner ID dari Shopee Open Platform",
        required: true,
      },
      {
        key: "partnerKey",
        label: "Partner Key",
        type: "password",
        placeholder: "Partner Key / Secret",
        required: true,
      },
    ],
    guide: {
      title: "Cara Integrasi Shopee Open Platform",
      description: "Sync order, produk, dan stok dari toko Shopee Anda secara otomatis.",
      steps: [
        "Buka open.shopee.com dan login dengan akun Shopee",
        "Klik 'Console' dan buat aplikasi baru",
        "Isi detail aplikasi dan pilih permissions yang dibutuhkan",
        "Setelah approved, Anda akan mendapat Partner ID dan Partner Key",
        "Shop ID bisa dilihat di URL toko Shopee Anda",
        "Paste semua credentials ke form di sebelah kiri",
        "Lakukan authorization flow untuk menghubungkan toko",
      ],
      link: "https://open.shopee.com/documents",
      linkText: "Dokumentasi Shopee Open Platform",
      icon: "🛒",
      tips: [
        "Proses approval aplikasi memakan waktu 3-7 hari kerja",
        "Pastikan toko sudah terverifikasi sebelum mengajukan API access",
        "Gunakan sandbox environment untuk testing",
      ],
    },
  },

  TOKOPEDIA: {
    name: "Tokopedia",
    icon: "🏪",
    color: "#42B549",
    fields: [
      {
        key: "shopId",
        label: "Shop ID",
        type: "text",
        placeholder: "ID toko Tokopedia",
        required: true,
      },
      {
        key: "clientId",
        label: "Client ID",
        type: "text",
        placeholder: "Client ID dari Tokopedia",
        required: true,
      },
      {
        key: "clientSecret",
        label: "Client Secret",
        type: "password",
        placeholder: "Client Secret",
        required: true,
      },
    ],
    guide: {
      title: "Cara Integrasi Tokopedia API",
      description: "Sync order dan produk dari toko Tokopedia secara otomatis.",
      steps: [
        "Buka developer.tokopedia.com",
        "Daftar sebagai developer dan verifikasi akun",
        "Buat aplikasi baru di dashboard",
        "Request akses ke API yang dibutuhkan (Order, Product, dll)",
        "Setelah approved, dapatkan Client ID dan Client Secret",
        "Shop ID bisa dilihat di Seller Center",
        "Paste credentials ke form di sebelah kiri",
      ],
      link: "https://developer.tokopedia.com/openapi/guide",
      linkText: "Dokumentasi Tokopedia API",
      icon: "🏪",
      tips: [
        "Tokopedia memerlukan approval manual untuk akses API",
        "Pastikan toko sudah Power Merchant atau Official Store",
        "Refresh token secara berkala untuk menjaga koneksi",
      ],
    },
  },

  LAZADA: {
    name: "Lazada",
    icon: "📦",
    color: "#0F146D",
    fields: [
      {
        key: "appKey",
        label: "App Key",
        type: "text",
        placeholder: "App Key dari Lazada",
        required: true,
      },
      {
        key: "appSecret",
        label: "App Secret",
        type: "password",
        placeholder: "App Secret",
        required: true,
      },
      {
        key: "accessToken",
        label: "Access Token",
        type: "password",
        placeholder: "Access Token",
        required: true,
      },
    ],
    guide: {
      title: "Cara Integrasi Lazada Open Platform",
      description: "Sync order dan produk dari toko Lazada secara otomatis.",
      steps: [
        "Buka open.lazada.com dan daftar akun developer",
        "Buat aplikasi baru di console",
        "Isi detail aplikasi dan kategori",
        "Request API permissions yang dibutuhkan",
        "Setelah approved, dapatkan App Key dan App Secret",
        "Generate Access Token melalui authorization flow",
        "Paste semua credentials ke form",
      ],
      link: "https://open.lazada.com/apps/doc/doc",
      linkText: "Dokumentasi Lazada Open Platform",
      icon: "📦",
      tips: [
        "Access Token perlu di-refresh setiap 7 hari",
        "Gunakan refresh token untuk auto-renewal",
        "Test di sandbox sebelum production",
      ],
    },
  },

  TIKTOK: {
    name: "TikTok Shop",
    icon: "🎵",
    color: "#000000",
    fields: [
      {
        key: "appKey",
        label: "App Key",
        type: "text",
        placeholder: "App Key TikTok Shop",
        required: true,
      },
      {
        key: "appSecret",
        label: "App Secret",
        type: "password",
        placeholder: "App Secret",
        required: true,
      },
      {
        key: "shopId",
        label: "Shop ID",
        type: "text",
        placeholder: "ID toko TikTok Shop",
        required: true,
      },
    ],
    guide: {
      title: "Cara Integrasi TikTok Shop API",
      description: "Sync order dan produk dari TikTok Shop secara otomatis.",
      steps: [
        "Buka partner.tiktokshop.com dan login",
        "Daftar sebagai developer partner",
        "Buat aplikasi baru di developer console",
        "Request API permissions untuk order dan product",
        "Dapatkan App Key dan App Secret setelah approved",
        "Shop ID bisa ditemukan di TikTok Seller Center",
        "Paste credentials ke form di sebelah kiri",
      ],
      link: "https://partner.tiktokshop.com/doc",
      linkText: "Dokumentasi TikTok Shop API",
      icon: "🎵",
      tips: [
        "TikTok Shop API masih relatif baru, dokumentasi mungkin terbatas",
        "Pastikan toko sudah diverifikasi sebagai seller",
        "Join TikTok Shop seller community untuk support",
      ],
    },
  },
}

// Helper function to get all providers as array
export const getProvidersList = () => {
  return Object.entries(INTEGRATION_PROVIDERS).map(([key, value]) => ({
    key,
    ...value,
  }))
}

// Helper function to get specific provider config
export const getProviderConfig = (provider: string): ProviderConfig | undefined => {
  return INTEGRATION_PROVIDERS[provider.toUpperCase()]
}
