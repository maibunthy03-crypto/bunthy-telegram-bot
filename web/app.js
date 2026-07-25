/* =========================================================
   MALINE SMART ASSISTANT V4
   web/app.js
   ========================================================= */

"use strict";

/* =========================================================
   TELEGRAM MINI APP
   ========================================================= */

const telegramWebApp =
  window.Telegram &&
  window.Telegram.WebApp
    ? window.Telegram.WebApp
    : null;

if (telegramWebApp) {
  telegramWebApp.ready();
  telegramWebApp.expand();

  try {
    telegramWebApp.setHeaderColor("#d92f85");
    telegramWebApp.setBackgroundColor("#fffafb");
  } catch (error) {
    console.warn(
      "Telegram theme settings were not applied:",
      error
    );
  }
}

/* =========================================================
   GLOBAL APP STATE
   ========================================================= */

const appState = {
  config: null,
  apartments: [],
  facilities: [],
  includedServices: [],
  excludedServices: [],

  activeFilter: "all",
  activeLanguage: "en",

  selectedApartment: null,
  currentGalleryIndex: 0,

  touchStartX: 0,
  touchEndX: 0,
};

/* =========================================================
   FALLBACK DATA
   Used if /api/config cannot load
   ========================================================= */

const fallbackApartments = [
  {
    key: "studio-50",
    category: "studio",
    title: "Studio Apartment",
    shortTitle: "Studio",
    size: "50 sqm",
    bedrooms: "Studio",
    bathrooms: "1 bathroom",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "A comfortable studio residence with a living area, kitchen and private bathroom.",
    images: createLocalImageList("studio"),
  },

  {
    key: "one-bedroom-84",
    category: "one",
    title: "One Bedroom Apartment",
    shortTitle: "1 Bedroom",
    size: "84 sqm",
    bedrooms: "1 bedroom",
    bathrooms: "1 bathroom",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "A spacious one-bedroom residence designed for comfortable long-term living.",
    images: createLocalImageList(
      "one-bedroom-84"
    ),
  },

  {
    key: "one-bedroom-91",
    category: "one",
    title: "One Bedroom Apartment",
    shortTitle: "1 Bedroom",
    size: "91 sqm",
    bedrooms: "1 bedroom",
    bathrooms: "1 bathroom",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "A generous one-bedroom residence with a separate living room and fully equipped kitchen.",
    images: createLocalImageList(
      "one-bedroom-91"
    ),
  },

  {
    key: "two-bedroom-130",
    category: "two",
    title: "Two Bedroom Apartment",
    shortTitle: "2 Bedroom",
    size: "130 sqm",
    bedrooms: "2 bedrooms",
    bathrooms: "2 bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "A spacious two-bedroom residence suitable for couples, families and long-term tenants.",
    images: createLocalImageList(
      "two-bedroom-130"
    ),
  },

  {
    key: "two-bedroom-138",
    category: "two",
    title: "Two Bedroom Apartment",
    shortTitle: "2 Bedroom",
    size: "138 sqm",
    bedrooms: "2 bedrooms",
    bathrooms: "2 bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "A comfortable two-bedroom residence with generous living and dining spaces.",
    images: createLocalImageList(
      "two-bedroom-138"
    ),
  },

  {
    key: "two-bedroom-148",
    category: "two",
    title: "Two Bedroom Apartment",
    shortTitle: "2 Bedroom",
    size: "148 sqm",
    bedrooms: "2 bedrooms",
    bathrooms: "2 bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "A premium two-bedroom residence with spacious bedrooms, living room and kitchen.",
    images: createLocalImageList(
      "two-bedroom-148"
    ),
  },

  {
    key: "two-bedroom-150",
    category: "two",
    title: "Two Bedroom Apartment",
    shortTitle: "2 Bedroom",
    size: "150 sqm",
    bedrooms: "2 bedrooms",
    bathrooms: "2 bathrooms with bathtub",
    price: "$2,500 per month",
    availability:
      "Available on selected floors",
    description:
      "A luxury two-bedroom apartment with a bathtub, fully equipped kitchen and spacious living area.",
    images: createLocalImageList(
      "two-bedroom-150"
    ),
  },

  {
    key: "three-bedroom",
    category: "three",
    title: "Three Bedroom Apartment",
    shortTitle: "3 Bedroom",
    size: "Contact us",
    bedrooms: "3 bedrooms",
    bathrooms: "Multiple bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "A large three-bedroom residence created for family living and long-term comfort.",
    images: createLocalImageList(
      "three-bedroom"
    ),
  },

  {
    key: "penthouse-pha",
    category: "penthouse",
    title: "Penthouse A",
    shortTitle: "PHA",
    size: "551 sqm",
    bedrooms:
      "Luxury penthouse residence",
    bathrooms: "Multiple bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "Penthouse A is Maline Apartments' largest residence, offering 551 sqm of premium private living space.",
    images: createLocalImageList(
      "penthouse-pha"
    ),
  },

  {
    key: "penthouse-phb",
    category: "penthouse",
    title: "Penthouse B",
    shortTitle: "PHB",
    size: "465 sqm",
    bedrooms:
      "Luxury penthouse residence",
    bathrooms: "Multiple bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "Penthouse B offers 465 sqm of spacious luxury living with generous private areas.",
    images: createLocalImageList(
      "penthouse-phb"
    ),
  },

  {
    key: "penthouse-phc",
    category: "penthouse",
    title: "Penthouse C",
    shortTitle: "PHC",
    size: "435 sqm",
    bedrooms:
      "Luxury penthouse residence",
    bathrooms: "Multiple bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "Penthouse C provides 435 sqm of refined living space above central Phnom Penh.",
    images: createLocalImageList(
      "penthouse-phc"
    ),
  },
];

const fallbackFacilities = [
  {
    key: "swimming-pool",
    title: "Swimming Pool",
    icon: "🏊",
    description:
      "Relax and enjoy the outdoor swimming pool.",
  },

  {
    key: "gym",
    title: "Fitness Center",
    icon: "🏋️",
    description:
      "Modern fitness equipment for daily exercise.",
  },

  {
    key: "steam",
    title: "Steam Room",
    icon: "♨️",
    description:
      "A peaceful steam room for relaxation.",
  },

  {
    key: "sauna",
    title: "Sauna",
    icon: "🧖",
    description:
      "Comfortable sauna facilities for residents.",
  },

  {
    key: "playground",
    title: "Children's Playground",
    icon: "🛝",
    description:
      "A dedicated play area for children and families.",
  },

  {
    key: "parking",
    title: "Private Parking",
    icon: "🚗",
    description:
      "Convenient in-house parking for residents.",
  },

  {
    key: "security",
    title: "24-Hour Security",
    icon: "🛡️",
    description:
      "Professional security and reception assistance.",
  },

  {
    key: "reception",
    title: "Reception Service",
    icon: "🛎️",
    description:
      "Friendly reception support for tenants and guests.",
  },
];

const fallbackIncludedServices = [
  "Cable TV in the living room and master bedroom",
  "Fully equipped kitchen",
  "Iron and ironing board",
  "Safe deposit box",
  "Washing machine",
  "Dining table with chairs",
  "Management fee",
  "One in-house parking space",
  "Daily newspaper available at the lobby",
  "Access to modern fitness equipment",
  "Access to swimming pool",
  "Access to steam room and sauna",
  "Access to children's playground",
  "Wi-Fi internet",
  "Cleaning and linen change two times per week",
  "Water supply",
  "Lift maintenance",
  "Building maintenance",
];

const fallbackExcludedServices = [
  "Telephone IDD usage",
  "Electricity usage at $0.25 per kWh",
  "Rooftop sky bar charges",
];

/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {
  en: {
    code: "EN",

    eyebrow:
      "EXCLUSIVE SERVICED APARTMENTS",

    heroTitle:
      "Luxury Living<br>in Phnom Penh",

    heroText:
      "Spacious residences, premium facilities and attentive service in the heart of Phnom Penh.",

    explore:
      "Explore Apartments",

    bookViewing:
      "Book a Viewing",

    sizes:
      "sqm residences",

    security:
      "Security & reception",

    languages:
      "App languages",

    scroll:
      "Scroll to discover",

    residences:
      "OUR RESIDENCES",

    chooseApartment:
      "Choose your apartment",

    galleryNote:
      "Open any apartment to view its gallery, size, price and availability.",

    premiumComfort:
      "PREMIUM COMFORT",

    privateHome:
      "Your private home above the city",

    showcaseText:
      "Enjoy generous living spaces, thoughtful service and convenient access to central Phnom Penh.",

    propertyDetail:
      "PROPERTY DETAILS",

    serviceIncluded:
      "Services Included",

    serviceExcluded:
      "Services Excluded",

    lifestyle:
      "LIFESTYLE",

    facilitiesTitle:
      "Premium Facilities",

    facilitiesText:
      "Everything you need for wellness, relaxation and comfortable family living.",

    schedule:
      "SCHEDULE A VIEWING",

    contactTitle:
      "Schedule Your Private Viewing",

    staffReceive:
      "Our reception and leasing staff will receive your request immediately.",

    sendInquiry:
      "Send Your Inquiry",

    fullName:
      "Full name *",

    phone:
      "Phone number *",

    apartment:
      "Apartment *",

    checkIn:
      "Check-in date *",

    checkOut:
      "Check-out date",

    stay:
      "Length of stay *",

    budget:
      "Monthly budget",

    request:
      "Special request",

    submit:
      "Send Inquiry",

    chooseThisRoom:
      "Choose This Apartment",

    viewGallery:
      "View Gallery",

    photos:
      "photos",

    all:
      "All",

    studio:
      "Studio",

    oneBedroom:
      "1 Bedroom",

    twoBedroom:
      "2 Bedroom",

    threeBedroom:
      "3 Bedroom",

    penthouse:
      "Penthouse",

    loading:
      "Loading...",

    sending:
      "Sending your inquiry...",

    sent:
      "Your inquiry was sent successfully.",

    error:
      "Something went wrong. Please try again.",

    required:
      "Please complete all required fields.",

    invalidEmail:
      "Please enter a valid email address.",

    invalidDate:
      "Check-out date cannot be before check-in date.",

    roomNotFound:
      "Apartment information was not found.",
  },

  km: {
    code: "KH",

    eyebrow:
      "អាផាតមិនសេវាកម្មប្រណីត",

    heroTitle:
      "ការរស់នៅបែបប្រណីត<br>នៅភ្នំពេញ",

    heroText:
      "លំនៅដ្ឋានធំទូលាយ បរិក្ខារប្រណីត និងសេវាកម្មយកចិត្តទុកដាក់ នៅកណ្តាលរាជធានីភ្នំពេញ។",

    explore:
      "មើលប្រភេទបន្ទប់",

    bookViewing:
      "កក់ពេលមើលបន្ទប់",

    sizes:
      "ម៉ែត្រការ៉េ",

    security:
      "សន្តិសុខ និងទទួលភ្ញៀវ",

    languages:
      "ភាសាក្នុងកម្មវិធី",

    scroll:
      "អូសចុះក្រោម",

    residences:
      "លំនៅដ្ឋានរបស់យើង",

    chooseApartment:
      "ជ្រើសរើសអាផាតមិនរបស់អ្នក",

    galleryNote:
      "ចុចលើអាផាតមិនណាមួយ ដើម្បីមើលរូបភាព ទំហំ តម្លៃ និងស្ថានភាព។",

    premiumComfort:
      "ផាសុកភាពប្រណីត",

    privateHome:
      "ផ្ទះឯកជនរបស់អ្នកលើទីក្រុង",

    showcaseText:
      "រីករាយជាមួយកន្លែងរស់នៅធំទូលាយ សេវាកម្មយកចិត្តទុកដាក់ និងទីតាំងងាយស្រួលនៅកណ្តាលភ្នំពេញ។",

    propertyDetail:
      "ព័ត៌មានអចលនទ្រព្យ",

    serviceIncluded:
      "សេវាកម្មរួមបញ្ចូល",

    serviceExcluded:
      "សេវាកម្មមិនរួមបញ្ចូល",

    lifestyle:
      "ជីវិតរស់នៅ",

    facilitiesTitle:
      "បរិក្ខារប្រណីត",

    facilitiesText:
      "មានគ្រប់យ៉ាងសម្រាប់សុខភាព ការសម្រាក និងការរស់នៅរបស់គ្រួសារ។",

    schedule:
      "កំណត់ពេលមើលបន្ទប់",

    contactTitle:
      "កក់ពេលមើលបន្ទប់ឯកជន",

    staffReceive:
      "ក្រុមការងារទទួលភ្ញៀវ និងជួលបន្ទប់នឹងទទួលសំណើរបស់អ្នកភ្លាមៗ។",

    sendInquiry:
      "ផ្ញើសំណើរបស់អ្នក",

    fullName:
      "ឈ្មោះពេញ *",

    phone:
      "លេខទូរស័ព្ទ *",

    apartment:
      "ប្រភេទអាផាតមិន *",

    checkIn:
      "ថ្ងៃចូលស្នាក់នៅ *",

    checkOut:
      "ថ្ងៃចាកចេញ",

    stay:
      "រយៈពេលស្នាក់នៅ *",

    budget:
      "ថវិកាប្រចាំខែ",

    request:
      "សំណើពិសេស",

    submit:
      "ផ្ញើសំណើ",

    chooseThisRoom:
      "ជ្រើសរើសអាផាតមិននេះ",

    viewGallery:
      "មើលរូបភាព",

    photos:
      "រូបភាព",

    all:
      "ទាំងអស់",

    studio:
      "ស្ទូឌីយោ",

    oneBedroom:
      "១ បន្ទប់គេង",

    twoBedroom:
      "២ បន្ទប់គេង",

    threeBedroom:
      "៣ បន្ទប់គេង",

    penthouse:
      "ផេនហោស៍",

    loading:
      "កំពុងដំណើរការ...",

    sending:
      "កំពុងផ្ញើសំណើរបស់អ្នក...",

    sent:
      "សំណើរបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ។",

    error:
      "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត។",

    required:
      "សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់។",

    invalidEmail:
      "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។",

    invalidDate:
      "ថ្ងៃចាកចេញមិនអាចមុនថ្ងៃចូលបានទេ។",

    roomNotFound:
      "រកមិនឃើញព័ត៌មានអាផាតមិន។",
  },

  zh: {
    code: "中文",

    eyebrow:
      "高端服务式公寓",

    heroTitle:
      "金边市中心<br>奢华生活",

    heroText:
      "宽敞住宅、高端设施和贴心服务，位于金边市中心。",

    explore:
      "查看公寓",

    bookViewing:
      "预约看房",

    sizes:
      "平方米住宅",

    security:
      "安保与前台服务",

    languages:
      "应用语言",

    scroll:
      "向下滑动",

    residences:
      "我们的住宅",

    chooseApartment:
      "选择您的公寓",

    galleryNote:
      "打开任意公寓，查看照片、面积、价格和可用情况。",

    premiumComfort:
      "高端舒适体验",

    privateHome:
      "城市之上的私人住宅",

    showcaseText:
      "享受宽敞的生活空间、贴心服务以及金边市中心的便利位置。",

    propertyDetail:
      "公寓详情",

    serviceIncluded:
      "包含服务",

    serviceExcluded:
      "不包含服务",

    lifestyle:
      "生活方式",

    facilitiesTitle:
      "高端设施",

    facilitiesText:
      "满足健康、休闲和家庭舒适生活的各种需要。",

    schedule:
      "预约看房",

    contactTitle:
      "预约私人看房",

    staffReceive:
      "我们的前台和租赁团队将立即收到您的请求。",

    sendInquiry:
      "发送咨询",

    fullName:
      "姓名 *",

    phone:
      "电话号码 *",

    apartment:
      "公寓类型 *",

    checkIn:
      "入住日期 *",

    checkOut:
      "退房日期",

    stay:
      "入住时长 *",

    budget:
      "每月预算",

    request:
      "特别要求",

    submit:
      "发送咨询",

    chooseThisRoom:
      "选择此公寓",

    viewGallery:
      "查看照片",

    photos:
      "张照片",

    all:
      "全部",

    studio:
      "单间公寓",

    oneBedroom:
      "一居室",

    twoBedroom:
      "两居室",

    threeBedroom:
      "三居室",

    penthouse:
      "顶层公寓",

    loading:
      "加载中...",

    sending:
      "正在发送您的咨询...",

    sent:
      "您的咨询已成功发送。",

    error:
      "出现问题，请重试。",

    required:
      "请填写所有必填信息。",

    invalidEmail:
      "请输入有效的电子邮箱。",

    invalidDate:
      "退房日期不能早于入住日期。",

    roomNotFound:
      "未找到公寓信息。",
  },
};

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const elements = {
  splash:
    document.getElementById("splash"),

  langBtn:
    document.getElementById("langBtn"),

  rooms:
    document.getElementById("rooms"),

  roomFilters:
    document.querySelectorAll(
      "[data-filter]"
    ),

  roomSelect:
    document.getElementById("roomSelect"),

  included:
    document.getElementById("included"),

  excluded:
    document.getElementById("excluded"),

  facilitiesGrid:
    document.getElementById(
      "facilitiesGrid"
    ),

  bookingForm:
    document.getElementById("form"),

  formStatus:
    document.getElementById("status"),

  checkIn:
    document.getElementById("checkIn"),

  checkOut:
    document.getElementById("checkOut"),

  submitButton:
    document.querySelector(
      ".submit-btn"
    ),

  submitText:
    document.querySelector(
      "[data-submit-text]"
    ),

  submitLoader:
    document.querySelector(
      ".submit-btn .loader"
    ),

  modal:
    document.getElementById("modal"),

  modalTitle:
    document.getElementById("modalTitle"),

  modalSize:
    document.getElementById("modalSize"),

  modalMeta:
    document.getElementById("modalMeta"),

  gallery:
    document.getElementById("gallery"),

  galleryImg:
    document.getElementById("galleryImg"),

  galleryCounter:
    document.getElementById("counter"),

  galleryDots:
    document.getElementById("dots"),

  previousButton:
    document.getElementById("prev"),

  nextButton:
    document.getElementById("next"),

  chooseButton:
    document.getElementById("choose"),

  closeButtons:
    document.querySelectorAll(
      "[data-close]"
    ),

  currentYear:
    document.getElementById("currentYear"),

  phoneLink:
    document.getElementById("phoneLink"),

  phoneText:
    document.getElementById("phoneText"),

  emailLink:
    document.getElementById("emailLink"),

  emailText:
    document.getElementById("emailText"),

  websiteLink:
    document.getElementById("websiteLink"),

  facebookLink:
    document.getElementById("facebookLink"),

  instagramLink:
    document.getElementById("instagramLink"),

  tiktokLink:
    document.getElementById("tiktokLink"),

  telegramLink:
    document.getElementById("telegramLink"),

  whatsappLink:
    document.getElementById("whatsappLink"),

  mapsLink:
    document.getElementById("mapsLink"),

  bottomNavigationLinks:
    document.querySelectorAll(
      ".bottom-nav a"
    ),

  sections:
    document.querySelectorAll(
      "main section[id]"
    ),
};

/* =========================================================
   BASIC HELPER FUNCTIONS
   ========================================================= */

function createLocalImageList(
  folder,
  total = 10
) {
  return Array.from(
    {
      length: total,
    },
    (_, index) =>
      `/web/images/${folder}/${index + 1}.jpg`
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTranslation(key) {
  return (
    translations[
      appState.activeLanguage
    ]?.[key] ||
    translations.en[key] ||
    key
  );
}

function getApartmentByKey(key) {
  return appState.apartments.find(
    (apartment) =>
      apartment.key === key
  );
}

function normalizeImageList(apartment) {
  if (
    Array.isArray(apartment.images) &&
    apartment.images.length > 0
  ) {
    return apartment.images;
  }

  return [
    "/web/images/building.jpg",
  ];
}

function setStatus(message, type = "") {
  if (!elements.formStatus) {
    return;
  }

  elements.formStatus.textContent =
    message;

  if (type) {
    elements.formStatus.dataset.type =
      type;
  } else {
    delete elements.formStatus.dataset.type;
  }
}

function hideSplashScreen() {
  if (!elements.splash) {
    return;
  }

  setTimeout(() => {
    elements.splash.classList.add(
      "hide"
    );
  }, 600);

  setTimeout(() => {
    elements.splash.remove();
  }, 1200);
}

function formatPhoneNumber(phone) {
  if (!phone) {
    return "";
  }

  return phone
    .replace(/\s+/g, " ")
    .trim();
}

function safeSetLink(element, url) {
  if (!element || !url) {
    return;
  }

  element.href = url;
}

function openExternalLink(url) {
  if (!url || url === "#") {
    return;
  }

  if (
    telegramWebApp &&
    typeof telegramWebApp.openLink ===
      "function"
  ) {
    telegramWebApp.openLink(url);
    return;
  }

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}

/* =========================================================
   LOAD CONFIGURATION
   ========================================================= */

async function loadConfiguration() {
  try {
    const response = await fetch(
      "/api/config",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Config request failed with ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        "Configuration response was unsuccessful."
      );
    }

    appState.config = data;

    appState.apartments =
      Array.isArray(data.apartments) &&
      data.apartments.length
        ? data.apartments
        : fallbackApartments;

    appState.facilities =
      Array.isArray(data.facilities) &&
      data.facilities.length
        ? data.facilities
        : fallbackFacilities;

    appState.includedServices =
      Array.isArray(
        data.serviceIncluded
      ) &&
      data.serviceIncluded.length
        ? data.serviceIncluded
        : fallbackIncludedServices;

    appState.excludedServices =
      Array.isArray(
        data.serviceExcluded
      ) &&
      data.serviceExcluded.length
        ? data.serviceExcluded
        : fallbackExcludedServices;

    return data;
  } catch (error) {
    console.error(
      "Unable to load configuration:",
      error
    );

    appState.config = {
      property: {
        name:
          "Maline Exclusive Serviced Apartments",
        website:
          "https://malineapartments.com.kh",
        phone: "+85500000000",
        email:
          "info@malineapartments.com.kh",
        address:
          "Phnom Penh, Cambodia",
      },

      socialLinks: {
        website:
          "https://malineapartments.com.kh",
        facebook: "#",
        instagram: "#",
        tiktok: "#",
        telegram: "#",
        whatsapp: "#",
        googleMaps: "#",
        phone: "tel:+85500000000",
        email:
          "mailto:info@malineapartments.com.kh",
      },
    };

    appState.apartments =
      fallbackApartments;

    appState.facilities =
      fallbackFacilities;

    appState.includedServices =
      fallbackIncludedServices;

    appState.excludedServices =
      fallbackExcludedServices;

    return appState.config;
  }
}

/* =========================================================
   LANGUAGE
   ========================================================= */

function detectInitialLanguage() {
  const savedLanguage =
    localStorage.getItem(
      "maline-language"
    );

  if (
    savedLanguage &&
    translations[savedLanguage]
  ) {
    return savedLanguage;
  }

  const telegramLanguage =
    telegramWebApp?.initDataUnsafe
      ?.user?.language_code;

  if (
    telegramLanguage === "km"
  ) {
    return "km";
  }

  if (
    telegramLanguage === "zh" ||
    telegramLanguage === "zh-hans" ||
    telegramLanguage === "zh-hant"
  ) {
    return "zh";
  }

  const browserLanguage =
    navigator.language
      ?.toLowerCase()
      .slice(0, 2);

  if (browserLanguage === "km") {
    return "km";
  }

  if (browserLanguage === "zh") {
    return "zh";
  }

  return "en";
}

function setLanguage(language) {
  if (!translations[language]) {
    return;
  }

  appState.activeLanguage = language;

  localStorage.setItem(
    "maline-language",
    language
  );

  document.documentElement.lang =
    language;

  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {
      const key =
        element.dataset.i18n;

      const value =
        translations[language][key];

      if (!value) {
        return;
      }

      if (value.includes("<br>")) {
        element.innerHTML = value;
      } else {
        element.textContent = value;
      }
    });

  if (elements.langBtn) {
    const languageText =
      elements.langBtn.querySelector(
        "span"
      );

    if (languageText) {
      languageText.textContent =
        translations[language].code;
    }
  }

  updateFilterLabels();
  renderApartments();
  populateApartmentSelect();

  if (appState.selectedApartment) {
    updateModalContent(
      appState.selectedApartment
    );
  }
}

function cycleLanguage() {
  const languageOrder = [
    "en",
    "km",
    "zh",
  ];

  const currentIndex =
    languageOrder.indexOf(
      appState.activeLanguage
    );

  const nextIndex =
    (currentIndex + 1) %
    languageOrder.length;

  setLanguage(
    languageOrder[nextIndex]
  );
}

function updateFilterLabels() {
  const labels = {
    all: getTranslation("all"),
    studio: getTranslation("studio"),
    one: getTranslation(
      "oneBedroom"
    ),
    two: getTranslation(
      "twoBedroom"
    ),
    three: getTranslation(
      "threeBedroom"
    ),
    penthouse:
      getTranslation("penthouse"),
  };

  elements.roomFilters.forEach(
    (button) => {
      const filter =
        button.dataset.filter;

      if (labels[filter]) {
        button.textContent =
          labels[filter];
      }
    }
  );
}

/* =========================================================
   APARTMENT RENDERING
   ========================================================= */

function getVisibleApartments() {
  if (
    appState.activeFilter === "all"
  ) {
    return appState.apartments;
  }

  return appState.apartments.filter(
    (apartment) =>
      apartment.category ===
      appState.activeFilter
  );
}

function renderApartments() {
  if (!elements.rooms) {
    return;
  }

  const apartments =
    getVisibleApartments();

  if (!apartments.length) {
    elements.rooms.innerHTML = `
      <div class="detail-card">
        <p>
          ${escapeHtml(
            getTranslation(
              "roomNotFound"
            )
          )}
        </p>
      </div>
    `;

    return;
  }

  elements.rooms.innerHTML =
    apartments
      .map((apartment) => {
        const images =
          normalizeImageList(
            apartment
          );

        const firstImage =
          images[0] ||
          "/web/images/building.jpg";

        return `
          <article
            class="room reveal visible"
            data-room-key="${escapeHtml(
              apartment.key
            )}"
          >
            <div class="room-media">
              <img
                src="${escapeHtml(
                  firstImage
                )}"
                alt="${escapeHtml(
                  apartment.title
                )}"
                loading="lazy"
                onerror="this.onerror=null;this.src='/web/images/building.jpg';"
              >

              <span class="room-chip">
                ${escapeHtml(
                  apartment.size
                )}
              </span>

              <span class="photo-count">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  ></rect>

                  <circle
                    cx="8.5"
                    cy="10"
                    r="1.5"
                  ></circle>

                  <path d="m21 15-5-5L5 19"></path>
                </svg>

                ${images.length}
                ${escapeHtml(
                  getTranslation(
                    "photos"
                  )
                )}
              </span>
            </div>

            <div class="room-body">
              <h3>
                ${escapeHtml(
                  apartment.title
                )}
              </h3>

              <div class="room-meta">
                <span>
                  ${escapeHtml(
                    apartment.bedrooms
                  )}
                </span>

                <span>
                  ${escapeHtml(
                    apartment.bathrooms
                  )}
                </span>

                <span>
                  ${escapeHtml(
                    apartment.price
                  )}
                </span>
              </div>

              <button
                class="room-view"
                type="button"
                data-open-room="${escapeHtml(
                  apartment.key
                )}"
              >
                ${escapeHtml(
                  getTranslation(
                    "viewGallery"
                  )
                )}

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
          </article>
        `;
      })
      .join("");

  document
    .querySelectorAll(
      "[data-open-room]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          openApartmentModal(
            button.dataset.openRoom
          );
        }
      );
    });
}

function setRoomFilter(filter) {
  appState.activeFilter = filter;

  elements.roomFilters.forEach(
    (button) => {
      button.classList.toggle(
        "active",
        button.dataset.filter === filter
      );
    }
  );

  renderApartments();
}

function populateApartmentSelect() {
  if (!elements.roomSelect) {
    return;
  }

  const currentValue =
    elements.roomSelect.value;

  const defaultText =
    appState.activeLanguage === "km"
      ? "ជ្រើសរើសអាផាតមិន"
      : appState.activeLanguage === "zh"
        ? "选择公寓"
        : "Choose your apartment";

  elements.roomSelect.innerHTML = `
    <option
      value=""
      disabled
    >
      ${escapeHtml(defaultText)}
    </option>

    ${appState.apartments
      .map(
        (apartment) => `
          <option value="${escapeHtml(
            apartment.key
          )}">
            ${escapeHtml(
              apartment.title
            )} — ${escapeHtml(
              apartment.size
            )}
          </option>
        `
      )
      .join("")}
  `;

  if (
    currentValue &&
    getApartmentByKey(currentValue)
  ) {
    elements.roomSelect.value =
      currentValue;
  } else {
    elements.roomSelect.value = "";
  }
}

/* =========================================================
   SERVICES AND FACILITIES
   ========================================================= */

function renderServiceList(
  element,
  services
) {
  if (!element) {
    return;
  }

  element.innerHTML = services
    .map(
      (service) => `
        <li>
          ${escapeHtml(service)}
        </li>
      `
    )
    .join("");
}

function renderFacilities() {
  if (!elements.facilitiesGrid) {
    return;
  }

  elements.facilitiesGrid.innerHTML =
    appState.facilities
      .map(
        (facility) => `
          <article class="facility-card reveal visible">
            <span class="facility-icon">
              ${escapeHtml(
                facility.icon
              )}
            </span>

            <h3>
              ${escapeHtml(
                facility.title
              )}
            </h3>

            <p>
              ${escapeHtml(
                facility.description
              )}
            </p>
          </article>
        `
      )
      .join("");
}

/* =========================================================
   APARTMENT MODAL AND GALLERY
   ========================================================= */

function openApartmentModal(
  apartmentKey
) {
  const apartment =
    getApartmentByKey(apartmentKey);

  if (!apartment) {
    alert(
      getTranslation(
        "roomNotFound"
      )
    );

    return;
  }

  appState.selectedApartment =
    apartment;

  appState.currentGalleryIndex = 0;

  updateModalContent(apartment);

  if (elements.modal) {
    elements.modal.hidden = false;
  }

  document.body.style.overflow =
    "hidden";

  if (telegramWebApp) {
    try {
      telegramWebApp.HapticFeedback
        ?.impactOccurred("light");
    } catch (error) {
      console.warn(
        "Haptic feedback unavailable:",
        error
      );
    }
  }
}

function closeApartmentModal() {
  if (elements.modal) {
    elements.modal.hidden = true;
  }

  document.body.style.overflow = "";

  appState.selectedApartment = null;
  appState.currentGalleryIndex = 0;
}

function updateModalContent(apartment) {
  if (!apartment) {
    return;
  }

  if (elements.modalTitle) {
    elements.modalTitle.textContent =
      apartment.title;
  }

  if (elements.modalSize) {
    elements.modalSize.textContent =
      apartment.size;
  }

  if (elements.modalMeta) {
    elements.modalMeta.textContent = [
      apartment.bedrooms,
      apartment.bathrooms,
      apartment.price,
      apartment.availability,
    ]
      .filter(Boolean)
      .join(" • ");
  }

  updateGalleryImage();
  renderGalleryDots();
}

function updateGalleryImage() {
  const apartment =
    appState.selectedApartment;

  if (!apartment) {
    return;
  }

  const images =
    normalizeImageList(apartment);

  if (
    appState.currentGalleryIndex <
      0 ||
    appState.currentGalleryIndex >=
      images.length
  ) {
    appState.currentGalleryIndex = 0;
  }

  const image =
    images[
      appState.currentGalleryIndex
    ];

  if (elements.galleryImg) {
    elements.galleryImg.src = image;

    elements.galleryImg.alt =
      `${apartment.title} photo ${
        appState.currentGalleryIndex +
        1
      }`;

    elements.galleryImg.onerror =
      () => {
        elements.galleryImg.onerror =
          null;

        elements.galleryImg.src =
          "/web/images/building.jpg";
      };
  }

  if (elements.galleryCounter) {
    elements.galleryCounter.textContent =
      `${
        appState.currentGalleryIndex +
        1
      } / ${images.length}`;
  }

  updateActiveGalleryDot();
}

function renderGalleryDots() {
  if (!elements.galleryDots) {
    return;
  }

  const apartment =
    appState.selectedApartment;

  if (!apartment) {
    elements.galleryDots.innerHTML = "";
    return;
  }

  const images =
    normalizeImageList(apartment);

  elements.galleryDots.innerHTML =
    images
      .map(
        (_, index) => `
          <i
            class="${
              index ===
              appState.currentGalleryIndex
                ? "active"
                : ""
            }"
            data-gallery-index="${index}"
          ></i>
        `
      )
      .join("");

  elements.galleryDots
    .querySelectorAll(
      "[data-gallery-index]"
    )
    .forEach((dot) => {
      dot.addEventListener(
        "click",
        () => {
          appState.currentGalleryIndex =
            Number(
              dot.dataset.galleryIndex
            );

          updateGalleryImage();
        }
      );
    });
}

function updateActiveGalleryDot() {
  if (!elements.galleryDots) {
    return;
  }

  elements.galleryDots
    .querySelectorAll("i")
    .forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index ===
          appState.currentGalleryIndex
      );
    });
}

function showPreviousGalleryImage() {
  const apartment =
    appState.selectedApartment;

  if (!apartment) {
    return;
  }

  const images =
    normalizeImageList(apartment);

  appState.currentGalleryIndex =
    (appState.currentGalleryIndex -
      1 +
      images.length) %
    images.length;

  updateGalleryImage();
}

function showNextGalleryImage() {
  const apartment =
    appState.selectedApartment;

  if (!apartment) {
    return;
  }

  const images =
    normalizeImageList(apartment);

  appState.currentGalleryIndex =
    (appState.currentGalleryIndex + 1) %
    images.length;

  updateGalleryImage();
}

function chooseSelectedApartment() {
  const apartment =
    appState.selectedApartment;

  if (!apartment) {
    return;
  }

  if (elements.roomSelect) {
    elements.roomSelect.value =
      apartment.key;
  }

  closeApartmentModal();

  document
    .getElementById("booking")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  if (telegramWebApp) {
    try {
      telegramWebApp.HapticFeedback
        ?.notificationOccurred(
          "success"
        );
    } catch (error) {
      console.warn(
        "Haptic feedback unavailable:",
        error
      );
    }
  }
}

/* =========================================================
   BOOKING FORM
   ========================================================= */

function setMinimumDates() {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  if (elements.checkIn) {
    elements.checkIn.min = today;
  }

  if (elements.checkOut) {
    elements.checkOut.min = today;
  }
}

function handleCheckInChange() {
  if (
    !elements.checkIn ||
    !elements.checkOut
  ) {
    return;
  }

  const checkInValue =
    elements.checkIn.value;

  elements.checkOut.min =
    checkInValue ||
    new Date()
      .toISOString()
      .split("T")[0];

  if (
    elements.checkOut.value &&
    checkInValue &&
    elements.checkOut.value <
      checkInValue
  ) {
    elements.checkOut.value = "";
  }
}

function isValidEmail(email) {
  if (!email) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

function validateBookingData(data) {
  if (
    !data.fullName ||
    !data.phone ||
    !data.apartment ||
    !data.checkIn ||
    !data.stay
  ) {
    return {
      valid: false,
      message:
        getTranslation("required"),
    };
  }

  if (
    data.email &&
    !isValidEmail(data.email)
  ) {
    return {
      valid: false,
      message:
        getTranslation(
          "invalidEmail"
        ),
    };
  }

  if (
    data.checkIn &&
    data.checkOut &&
    data.checkOut < data.checkIn
  ) {
    return {
      valid: false,
      message:
        getTranslation(
          "invalidDate"
        ),
    };
  }

  return {
    valid: true,
    message: "",
  };
}

function getTelegramUserData() {
  const user =
    telegramWebApp?.initDataUnsafe
      ?.user;

  return {
    telegramUserId:
      user?.id
        ? String(user.id)
        : "",

    telegramUsername:
      user?.username || "",

    telegramFirstName:
      user?.first_name || "",

    telegramLastName:
      user?.last_name || "",
  };
}

function collectBookingFormData(form) {
  const formData =
    new FormData(form);

  const apartmentKey =
    String(
      formData.get("apartment") ||
        ""
    ).trim();

  const apartment =
    getApartmentByKey(
      apartmentKey
    );

  return {
    fullName:
      String(
        formData.get("fullName") ||
          ""
      ).trim(),

    phone:
      String(
        formData.get("phone") ||
          ""
      ).trim(),

    email:
      String(
        formData.get("email") ||
          ""
      ).trim(),

    apartment:
      apartmentKey,

    apartmentKey,

    apartmentTitle:
      apartment?.title || "",

    apartmentSize:
      apartment?.size || "",

    checkIn:
      String(
        formData.get("checkIn") ||
          ""
      ).trim(),

    checkOut:
      String(
        formData.get("checkOut") ||
          ""
      ).trim(),

    stay:
      String(
        formData.get("stay") ||
          ""
      ).trim(),

    budget:
      String(
        formData.get("budget") ||
          ""
      ).trim(),

    request:
      String(
        formData.get("request") ||
          ""
      ).trim(),

    language:
      appState.activeLanguage,

    source:
      telegramWebApp
        ? "Telegram Mini App"
        : "Website",

    ...getTelegramUserData(),
  };
}

function setSubmittingState(isSubmitting) {
  if (elements.submitButton) {
    elements.submitButton.disabled =
      isSubmitting;
  }

  if (elements.submitLoader) {
    elements.submitLoader.hidden =
      !isSubmitting;
  }

  if (elements.submitText) {
    elements.submitText.textContent =
      isSubmitting
        ? getTranslation("sending")
        : getTranslation("submit");
  }
}

async function submitBookingForm(event) {
  event.preventDefault();

  const form =
    event.currentTarget;

  const bookingData =
    collectBookingFormData(form);

  const validation =
    validateBookingData(
      bookingData
    );

  if (!validation.valid) {
    setStatus(
      validation.message,
      "error"
    );

    if (telegramWebApp) {
      try {
        telegramWebApp.HapticFeedback
          ?.notificationOccurred(
            "error"
          );
      } catch (error) {
        console.warn(error);
      }
    }

    return;
  }

  setSubmittingState(true);

  setStatus(
    getTranslation("sending"),
    "loading"
  );

  try {
    const response = await fetch(
      "/api/inquiry",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body:
          JSON.stringify(
            bookingData
          ),
      }
    );

    const result =
      await response.json().catch(
        () => ({
          success: false,
          message:
            getTranslation(
              "error"
            ),
        })
      );

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          getTranslation("error")
      );
    }

    setStatus(
      `${
        getTranslation("sent")
      } ${
        result.inquiryId
          ? `ID: ${result.inquiryId}`
          : ""
      }`,
      "success"
    );

    form.reset();

    setMinimumDates();

    if (telegramWebApp) {
      try {
        telegramWebApp.HapticFeedback
          ?.notificationOccurred(
            "success"
          );

        telegramWebApp.MainButton
          ?.hide();
      } catch (error) {
        console.warn(error);
      }
    }
  } catch (error) {
    console.error(
      "Booking submission error:",
      error
    );

    setStatus(
      error.message ||
        getTranslation("error"),
      "error"
    );

    if (telegramWebApp) {
      try {
        telegramWebApp.HapticFeedback
          ?.notificationOccurred(
            "error"
          );
      } catch (feedbackError) {
        console.warn(feedbackError);
      }
    }
  } finally {
    setSubmittingState(false);
  }
}

/* =========================================================
   CONTACT DETAILS AND LINKS
   ========================================================= */

function applyContactConfiguration() {
  const config =
    appState.config || {};

  const property =
    config.property || {};

  const links =
    config.socialLinks || {};

  if (elements.phoneText) {
    elements.phoneText.textContent =
      formatPhoneNumber(
        property.phone
      ) || "+855 00 000 000";
  }

  if (elements.emailText) {
    elements.emailText.textContent =
      property.email ||
      "info@malineapartments.com.kh";
  }

  safeSetLink(
    elements.phoneLink,
    links.phone ||
      `tel:${property.phone || ""}`
  );

  safeSetLink(
    elements.emailLink,
    links.email ||
      `mailto:${property.email || ""}`
  );

  safeSetLink(
    elements.websiteLink,
    links.website ||
      property.website
  );

  safeSetLink(
    elements.facebookLink,
    links.facebook
  );

  safeSetLink(
    elements.instagramLink,
    links.instagram
  );

  safeSetLink(
    elements.tiktokLink,
    links.tiktok
  );

  safeSetLink(
    elements.telegramLink,
    links.telegram
  );

  safeSetLink(
    elements.whatsappLink,
    links.whatsapp
  );

  safeSetLink(
    elements.mapsLink,
    links.googleMaps
  );

  document
    .querySelectorAll(
      '.social-links a[target="_blank"]'
    )
    .forEach((link) => {
      link.addEventListener(
        "click",
        (event) => {
          const href =
            link.getAttribute("href");

          if (
            !href ||
            href === "#"
          ) {
            event.preventDefault();
            return;
          }

          if (telegramWebApp) {
            event.preventDefault();
            openExternalLink(href);
          }
        }
      );
    });
}

/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function initializeRevealAnimations() {
  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );

  if (
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach(
      (element) =>
        element.classList.add(
          "visible"
        )
    );

    return;
  }

  const observer =
    new IntersectionObserver(
      (entries) => {
        entries.forEach(
          (entry) => {
            if (
              entry.isIntersecting
            ) {
              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          }
        );
      },
      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -30px 0px",
      }
    );

  revealElements.forEach(
    (element) =>
      observer.observe(element)
  );
}

/* =========================================================
   BOTTOM NAVIGATION
   ========================================================= */

function updateActiveBottomNavigation() {
  let activeSectionId = "home";

  elements.sections.forEach(
    (section) => {
      const rectangle =
        section.getBoundingClientRect();

      if (
        rectangle.top <=
        window.innerHeight * 0.38
      ) {
        activeSectionId =
          section.id;
      }
    }
  );

  elements.bottomNavigationLinks.forEach(
    (link) => {
      const href =
        link.getAttribute("href");

      link.classList.toggle(
        "active",
        href ===
          `#${activeSectionId}`
      );
    }
  );
}

/* =========================================================
   URL APARTMENT SUPPORT
   Example:
   http://localhost:8080/?room=penthouse-pha
   ========================================================= */

function openApartmentFromUrl() {
  const searchParameters =
    new URLSearchParams(
      window.location.search
    );

  const roomKey =
    searchParameters.get("room") ||
    searchParameters.get(
      "apartment"
    );

  if (!roomKey) {
    return;
  }

  const apartment =
    getApartmentByKey(roomKey);

  if (!apartment) {
    return;
  }

  setTimeout(() => {
    openApartmentModal(roomKey);
  }, 700);
}

/* =========================================================
   MINI APP OPEN TRACKING
   ========================================================= */

async function trackMiniAppOpen() {
  const telegramUser =
    getTelegramUserData();

  try {
    await fetch("/api/open", {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        telegramUserId:
          telegramUser.telegramUserId,

        username:
          telegramUser.telegramUsername,

        language:
          appState.activeLanguage,

        source:
          telegramWebApp
            ? "Telegram Mini App"
            : "Website",

        openedAt:
          new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.warn(
      "Open tracking failed:",
      error
    );
  }
}

/* =========================================================
   IMAGE SWIPE SUPPORT
   ========================================================= */

function handleTouchStart(event) {
  appState.touchStartX =
    event.changedTouches[0]
      ?.screenX || 0;
}

function handleTouchEnd(event) {
  appState.touchEndX =
    event.changedTouches[0]
      ?.screenX || 0;

  const distance =
    appState.touchEndX -
    appState.touchStartX;

  if (Math.abs(distance) < 45) {
    return;
  }

  if (distance > 0) {
    showPreviousGalleryImage();
  } else {
    showNextGalleryImage();
  }
}

/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

function handleKeyboardEvents(event) {
  if (
    !elements.modal ||
    elements.modal.hidden
  ) {
    return;
  }

  if (event.key === "Escape") {
    closeApartmentModal();
  }

  if (event.key === "ArrowLeft") {
    showPreviousGalleryImage();
  }

  if (event.key === "ArrowRight") {
    showNextGalleryImage();
  }
}

/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function registerEventListeners() {
  if (elements.langBtn) {
    elements.langBtn.addEventListener(
      "click",
      cycleLanguage
    );
  }

  elements.roomFilters.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          setRoomFilter(
            button.dataset.filter
          );
        }
      );
    }
  );

  if (elements.bookingForm) {
    elements.bookingForm.addEventListener(
      "submit",
      submitBookingForm
    );
  }

  if (elements.checkIn) {
    elements.checkIn.addEventListener(
      "change",
      handleCheckInChange
    );
  }

  if (elements.previousButton) {
    elements.previousButton.addEventListener(
      "click",
      showPreviousGalleryImage
    );
  }

  if (elements.nextButton) {
    elements.nextButton.addEventListener(
      "click",
      showNextGalleryImage
    );
  }

  if (elements.chooseButton) {
    elements.chooseButton.addEventListener(
      "click",
      chooseSelectedApartment
    );
  }

  elements.closeButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        closeApartmentModal
      );
    }
  );

  if (elements.gallery) {
    elements.gallery.addEventListener(
      "touchstart",
      handleTouchStart,
      {
        passive: true,
      }
    );

    elements.gallery.addEventListener(
      "touchend",
      handleTouchEnd,
      {
        passive: true,
      }
    );
  }

  document.addEventListener(
    "keydown",
    handleKeyboardEvents
  );

  window.addEventListener(
    "scroll",
    updateActiveBottomNavigation,
    {
      passive: true,
    }
  );

  elements.bottomNavigationLinks.forEach(
    (link) => {
      link.addEventListener(
        "click",
        () => {
          elements.bottomNavigationLinks.forEach(
            (item) =>
              item.classList.remove(
                "active"
              )
          );

          link.classList.add(
            "active"
          );
        }
      );
    }
  );
}

/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

async function initializeApplication() {
  try {
    if (elements.currentYear) {
      elements.currentYear.textContent =
        new Date().getFullYear();
    }

    setMinimumDates();

    registerEventListeners();

    await loadConfiguration();

    appState.activeLanguage =
      detectInitialLanguage();

    applyContactConfiguration();

    renderServiceList(
      elements.included,
      appState.includedServices
    );

    renderServiceList(
      elements.excluded,
      appState.excludedServices
    );

    renderFacilities();

    populateApartmentSelect();

    setLanguage(
      appState.activeLanguage
    );

    initializeRevealAnimations();

    openApartmentFromUrl();

    updateActiveBottomNavigation();

    trackMiniAppOpen();
  } catch (error) {
    console.error(
      "Application initialization error:",
      error
    );

    appState.apartments =
      fallbackApartments;

    appState.facilities =
      fallbackFacilities;

    appState.includedServices =
      fallbackIncludedServices;

    appState.excludedServices =
      fallbackExcludedServices;

    renderApartments();

    populateApartmentSelect();

    renderServiceList(
      elements.included,
      fallbackIncludedServices
    );

    renderServiceList(
      elements.excluded,
      fallbackExcludedServices
    );

    renderFacilities();

    initializeRevealAnimations();
  } finally {
    hideSplashScreen();
  }
}

/* =========================================================
   START APPLICATION
   ========================================================= */

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
  );
} else {
  initializeApplication();
}