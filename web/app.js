/* =========================================================
   MALINE SMART ASSISTANT V3.1
   web/app.js
   PART 1 OF 2
   ========================================================= */

"use strict";

/* =========================================================
   TELEGRAM MINI APP
   ========================================================= */

const tg = window.Telegram?.WebApp || null;

if (tg) {
  tg.ready();
  tg.expand();

  try {
    tg.setHeaderColor("#d92f85");
    tg.setBackgroundColor("#fff8fb");
  } catch (error) {
    console.warn("Telegram theme settings are unavailable:", error);
  }
}

/* =========================================================
   APPLICATION SETTINGS
   ========================================================= */

const APP_NAME = "Maline Smart Assistant";
const FALLBACK_IMAGE = "/web/images/building.jpg";

let currentLanguage = "en";
let apartments = [];
let selectedApartment = null;
let galleryIndex = 0;
let touchStartX = 0;

/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {
  en: {
    eyebrow: "EXCLUSIVE SERVICED APARTMENTS",
    heroTitle: "Luxury Living<br>in Phnom Penh",
    heroText:
      "Spacious residences, premium facilities and attentive service in the heart of Phnom Penh.",

    explore: "Explore Apartments",
    bookViewing: "Book a Viewing",
    scroll: "Scroll to discover",

    sizes: "sqm residences",
    security: "Security & reception",
    languages: "App languages",

    residences: "OUR RESIDENCES",
    chooseApartment: "Choose your apartment",
    galleryNote:
      "Open any apartment to view its gallery, size, price and availability.",

    premiumComfort: "PREMIUM COMFORT",
    privateHome: "Your private home above the city",
    showcaseText:
      "Enjoy generous living spaces, thoughtful service and convenient access to central Phnom Penh.",

    propertyDetail: "PROPERTY DETAILS",
    serviceIncluded: "Services Included",
    pleaseNote: "PLEASE NOTE",
    serviceExcluded: "Services Excluded",

    lifestyle: "LIFESTYLE",
    facilitiesTitle: "Premium Facilities",
    facilitiesText:
      "Everything you need for wellness, relaxation and comfortable family living.",

    schedule: "SCHEDULE A VIEWING",
    sendInquiry: "Send Your Inquiry",
    staffReceive:
      "Our reception and leasing staff will receive your request immediately.",

    fullName: "Full name *",
    phone: "Phone number *",
    apartment: "Apartment *",
    checkIn: "Check-in date *",
    checkOut: "Check-out date",
    stay: "Length of stay *",
    budget: "Monthly budget",
    request: "Special request",

    submit: "Send Inquiry",
    sending: "Sending...",
    success: "Inquiry sent successfully.",
    failed: "Unable to send the inquiry.",

    contactTitle: "Schedule Your Private Viewing",
    viewGallery: "View Gallery",
    chooseThisRoom: "Choose This Apartment",
    contactPrice: "Contact us for price",
    contactAvailability: "Contact reception",
    noRooms: "No apartments were found in this category.",
    loadingError:
      "Unable to load the apartments. Please refresh and try again.",

    photos: "photos",
    available: "Available",
    selected: "Selected apartment",
  },

  km: {
    eyebrow: "អាផាតមិនសេវាកម្មប្រណីត",
    heroTitle: "ការរស់នៅប្រណីត<br>នៅភ្នំពេញ",
    heroText:
      "លំនៅដ្ឋានធំទូលាយ បរិក្ខារប្រណីត និងសេវាកម្មយកចិត្តទុកដាក់នៅកណ្តាលរាជធានីភ្នំពេញ។",

    explore: "មើលអាផាតមិន",
    bookViewing: "កក់ពេលមើលបន្ទប់",
    scroll: "អូសចុះដើម្បីមើល",

    sizes: "ទំហំលំនៅដ្ឋាន",
    security: "សន្តិសុខ និងទទួលភ្ញៀវ",
    languages: "ភាសាកម្មវិធី",

    residences: "លំនៅដ្ឋានរបស់យើង",
    chooseApartment: "ជ្រើសរើសអាផាតមិនរបស់អ្នក",
    galleryNote:
      "បើកអាផាតមិនណាមួយដើម្បីមើលរូបភាព ទំហំ តម្លៃ និងបន្ទប់ទំនេរ។",

    premiumComfort: "ផាសុកភាពប្រណីត",
    privateHome: "ផ្ទះឯកជនរបស់អ្នកលើទីក្រុង",
    showcaseText:
      "រីករាយជាមួយទីធ្លាធំទូលាយ សេវាកម្មយកចិត្តទុកដាក់ និងទីតាំងងាយស្រួលនៅកណ្តាលទីក្រុង។",

    propertyDetail: "ព័ត៌មានអចលនទ្រព្យ",
    serviceIncluded: "សេវាកម្មរួមបញ្ចូល",
    pleaseNote: "សូមចំណាំ",
    serviceExcluded: "សេវាកម្មមិនរួមបញ្ចូល",

    lifestyle: "របៀបរស់នៅ",
    facilitiesTitle: "បរិក្ខារប្រណីត",
    facilitiesText:
      "អ្វីៗគ្រប់យ៉ាងសម្រាប់សុខភាព ការសម្រាក និងការរស់នៅជាមួយគ្រួសារ។",

    schedule: "កក់ពេលមើលបន្ទប់",
    sendInquiry: "ផ្ញើសំណើរបស់អ្នក",
    staffReceive:
      "ក្រុមទទួលភ្ញៀវ និងក្រុមជួលនឹងទទួលសំណើរបស់អ្នកភ្លាមៗ។",

    fullName: "ឈ្មោះពេញ *",
    phone: "លេខទូរស័ព្ទ *",
    apartment: "ប្រភេទអាផាតមិន *",
    checkIn: "ថ្ងៃចូលស្នាក់នៅ *",
    checkOut: "ថ្ងៃចាកចេញ",
    stay: "រយៈពេលស្នាក់នៅ *",
    budget: "ថវិកាប្រចាំខែ",
    request: "សំណើពិសេស",

    submit: "ផ្ញើសំណើ",
    sending: "កំពុងផ្ញើ...",
    success: "បានផ្ញើសំណើដោយជោគជ័យ។",
    failed: "មិនអាចផ្ញើសំណើបានទេ។",

    contactTitle: "កក់ពេលមើលបន្ទប់ឯកជន",
    viewGallery: "មើលរូបភាព",
    chooseThisRoom: "ជ្រើសរើសអាផាតមិននេះ",
    contactPrice: "សូមទាក់ទងសម្រាប់តម្លៃ",
    contactAvailability: "សូមទាក់ទងផ្នែកទទួលភ្ញៀវ",
    noRooms: "រកមិនឃើញអាផាតមិនក្នុងប្រភេទនេះទេ។",
    loadingError:
      "មិនអាចបង្ហាញអាផាតមិនបានទេ។ សូមបើកឡើងវិញ។",

    photos: "រូបភាព",
    available: "មានបន្ទប់",
    selected: "អាផាតមិនដែលបានជ្រើសរើស",
  },

  zh: {
    eyebrow: "豪华服务式公寓",
    heroTitle: "金边<br>奢华生活",
    heroText: "位于金边市中心的宽敞住宅、优质设施和贴心服务。",

    explore: "浏览公寓",
    bookViewing: "预约看房",
    scroll: "向下滑动探索",

    sizes: "住宅面积",
    security: "安保与前台",
    languages: "应用语言",

    residences: "我们的住宅",
    chooseApartment: "选择您的公寓",
    galleryNote: "打开任意公寓查看图片、面积、价格和房源情况。",

    premiumComfort: "高品质舒适",
    privateHome: "城市之上的私人住宅",
    showcaseText:
      "享受宽敞空间、贴心服务和便捷的金边市中心位置。",

    propertyDetail: "房源详情",
    serviceIncluded: "包含服务",
    pleaseNote: "请注意",
    serviceExcluded: "不包含服务",

    lifestyle: "生活方式",
    facilitiesTitle: "优质设施",
    facilitiesText: "满足健康、休闲和家庭生活的一切需求。",

    schedule: "预约看房",
    sendInquiry: "发送咨询",
    staffReceive: "前台和租赁工作人员将立即收到您的请求。",

    fullName: "姓名 *",
    phone: "电话号码 *",
    apartment: "公寓类型 *",
    checkIn: "入住日期 *",
    checkOut: "退房日期",
    stay: "入住时长 *",
    budget: "每月预算",
    request: "特别要求",

    submit: "发送咨询",
    sending: "正在发送...",
    success: "咨询已成功发送。",
    failed: "无法发送咨询。",

    contactTitle: "预约私人看房",
    viewGallery: "查看图片",
    chooseThisRoom: "选择此公寓",
    contactPrice: "请联系我们获取价格",
    contactAvailability: "请联系前台",
    noRooms: "此类别中没有找到公寓。",
    loadingError: "无法加载公寓，请刷新后重试。",

    photos: "张图片",
    available: "可入住",
    selected: "已选公寓",
  },
};

/* =========================================================
   SERVICES
   ========================================================= */

const defaultServicesIncluded = [
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
  "Access to the children's playground",
  "Wi-Fi internet",
  "Cleaning and linen change two times per week",
  "Water supply",
  "Lift maintenance",
  "Building maintenance",
];

const defaultServicesExcluded = [
  "Telephone IDD usage",
  "Electricity usage at $0.25 per kWh",
  "Rooftop sky bar charges",
];

/* =========================================================
   FALLBACK APARTMENT DATA
   This data is used when /api/config is unavailable.
   It includes Studio, 1BR, 2BR, 3BR, PHA, PHB and PHC.
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
    images: [
      "/web/images/studio/1.jpg",
      "/web/images/studio/2.jpg",
      "/web/images/studio/3.jpg",
      "/web/images/studio/4.jpg",
      "/web/images/studio/5.jpg",
      "/web/images/studio/6.jpg",
      "/web/images/studio/7.jpg",
      "/web/images/studio/8.jpg",
      "/web/images/studio/9.jpg",
      "/web/images/studio/10.jpg",
    ],
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
    images: [
      "/web/images/one-bedroom-84/1.jpg",
      "/web/images/one-bedroom-84/2.jpg",
      "/web/images/one-bedroom-84/3.jpg",
      "/web/images/one-bedroom-84/4.jpg",
      "/web/images/one-bedroom-84/5.jpg",
      "/web/images/one-bedroom-84/6.jpg",
      "/web/images/one-bedroom-84/7.jpg",
      "/web/images/one-bedroom-84/8.jpg",
      "/web/images/one-bedroom-84/9.jpg",
      "/web/images/one-bedroom-84/10.jpg",
    ],
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
    images: [
      "/web/images/one-bedroom-91/1.jpg",
      "/web/images/one-bedroom-91/2.jpg",
      "/web/images/one-bedroom-91/3.jpg",
      "/web/images/one-bedroom-91/4.jpg",
      "/web/images/one-bedroom-91/5.jpg",
      "/web/images/one-bedroom-91/6.jpg",
      "/web/images/one-bedroom-91/7.jpg",
      "/web/images/one-bedroom-91/8.jpg",
      "/web/images/one-bedroom-91/9.jpg",
      "/web/images/one-bedroom-91/10.jpg",
    ],
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
    images: [
      "/web/images/two-bedroom-130/1.jpg",
      "/web/images/two-bedroom-130/2.jpg",
      "/web/images/two-bedroom-130/3.jpg",
      "/web/images/two-bedroom-130/4.jpg",
      "/web/images/two-bedroom-130/5.jpg",
      "/web/images/two-bedroom-130/6.jpg",
      "/web/images/two-bedroom-130/7.jpg",
      "/web/images/two-bedroom-130/8.jpg",
      "/web/images/two-bedroom-130/9.jpg",
      "/web/images/two-bedroom-130/10.jpg",
    ],
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
    images: [
      "/web/images/two-bedroom-138/1.jpg",
      "/web/images/two-bedroom-138/2.jpg",
      "/web/images/two-bedroom-138/3.jpg",
      "/web/images/two-bedroom-138/4.jpg",
      "/web/images/two-bedroom-138/5.jpg",
      "/web/images/two-bedroom-138/6.jpg",
      "/web/images/two-bedroom-138/7.jpg",
      "/web/images/two-bedroom-138/8.jpg",
      "/web/images/two-bedroom-138/9.jpg",
      "/web/images/two-bedroom-138/10.jpg",
    ],
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
    images: [
      "/web/images/two-bedroom-148/1.jpg",
      "/web/images/two-bedroom-148/2.jpg",
      "/web/images/two-bedroom-148/3.jpg",
      "/web/images/two-bedroom-148/4.jpg",
      "/web/images/two-bedroom-148/5.jpg",
      "/web/images/two-bedroom-148/6.jpg",
      "/web/images/two-bedroom-148/7.jpg",
      "/web/images/two-bedroom-148/8.jpg",
      "/web/images/two-bedroom-148/9.jpg",
      "/web/images/two-bedroom-148/10.jpg",
    ],
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
    availability: "Available on selected floors",
    images: [
      "/web/images/two-bedroom-150/1.jpg",
      "/web/images/two-bedroom-150/2.jpg",
      "/web/images/two-bedroom-150/3.jpg",
      "/web/images/two-bedroom-150/4.jpg",
      "/web/images/two-bedroom-150/5.jpg",
      "/web/images/two-bedroom-150/6.jpg",
      "/web/images/two-bedroom-150/7.jpg",
      "/web/images/two-bedroom-150/8.jpg",
      "/web/images/two-bedroom-150/9.jpg",
      "/web/images/two-bedroom-150/10.jpg",
    ],
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
    images: [
      "/web/images/three-bedroom/1.jpg",
      "/web/images/three-bedroom/2.jpg",
      "/web/images/three-bedroom/3.jpg",
      "/web/images/three-bedroom/4.jpg",
      "/web/images/three-bedroom/5.jpg",
      "/web/images/three-bedroom/6.jpg",
      "/web/images/three-bedroom/7.jpg",
      "/web/images/three-bedroom/8.jpg",
      "/web/images/three-bedroom/9.jpg",
      "/web/images/three-bedroom/10.jpg",
    ],
  },

  {
    key: "penthouse-pha",
    category: "penthouse",
    title: "Penthouse A",
    shortTitle: "PHA",
    size: "551 sqm",
    bedrooms: "Penthouse residence",
    bathrooms: "Multiple bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    images: [
      "/web/images/penthouse-pha/1.jpg",
      "/web/images/penthouse-pha/2.jpg",
      "/web/images/penthouse-pha/3.jpg",
      "/web/images/penthouse-pha/4.jpg",
      "/web/images/penthouse-pha/5.jpg",
      "/web/images/penthouse-pha/6.jpg",
      "/web/images/penthouse-pha/7.jpg",
      "/web/images/penthouse-pha/8.jpg",
      "/web/images/penthouse-pha/9.jpg",
      "/web/images/penthouse-pha/10.jpg",
    ],
  },

  {
    key: "penthouse-phb",
    category: "penthouse",
    title: "Penthouse B",
    shortTitle: "PHB",
    size: "465 sqm",
    bedrooms: "Penthouse residence",
    bathrooms: "Multiple bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    images: [
      "/web/images/penthouse-phb/1.jpg",
      "/web/images/penthouse-phb/2.jpg",
      "/web/images/penthouse-phb/3.jpg",
      "/web/images/penthouse-phb/4.jpg",
      "/web/images/penthouse-phb/5.jpg",
      "/web/images/penthouse-phb/6.jpg",
      "/web/images/penthouse-phb/7.jpg",
      "/web/images/penthouse-phb/8.jpg",
      "/web/images/penthouse-phb/9.jpg",
      "/web/images/penthouse-phb/10.jpg",
    ],
  },

  {
    key: "penthouse-phc",
    category: "penthouse",
    title: "Penthouse C",
    shortTitle: "PHC",
    size: "435 sqm",
    bedrooms: "Penthouse residence",
    bathrooms: "Multiple bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    images: [
      "/web/images/penthouse-phc/1.jpg",
      "/web/images/penthouse-phc/2.jpg",
      "/web/images/penthouse-phc/3.jpg",
      "/web/images/penthouse-phc/4.jpg",
      "/web/images/penthouse-phc/5.jpg",
      "/web/images/penthouse-phc/6.jpg",
      "/web/images/penthouse-phc/7.jpg",
      "/web/images/penthouse-phc/8.jpg",
      "/web/images/penthouse-phc/9.jpg",
      "/web/images/penthouse-phc/10.jpg",
    ],
  },
];

/* =========================================================
   GENERAL HELPERS
   ========================================================= */

function getTranslation(key) {
  return (
    translations[currentLanguage]?.[key] ||
    translations.en[key] ||
    key
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

function normalizeImages(images) {
  if (!Array.isArray(images) || images.length === 0) {
    return [FALLBACK_IMAGE];
  }

  return images.filter(Boolean);
}

function normalizeApartment(room, position = 0) {
  const key =
    room?.key ||
    `apartment-${position + 1}`;

  return {
    key,
    category:
      room?.category ||
      getRoomCategory(key),

    title:
      room?.title ||
      room?.name ||
      "Maline Apartment",

    shortTitle:
      room?.shortTitle ||
      room?.short_title ||
      room?.title ||
      "Apartment",

    size:
      room?.size ||
      "Contact us",

    bedrooms:
      room?.bedrooms ||
      room?.bedroom ||
      "",

    bathrooms:
      room?.bathrooms ||
      room?.bathroom ||
      "",

    price:
      room?.price ||
      getTranslation("contactPrice"),

    availability:
      room?.availability ||
      getTranslation("contactAvailability"),

    images: normalizeImages(room?.images),
  };
}

function getRoomCategory(key = "") {
  const normalizedKey = String(key).toLowerCase();

  if (normalizedKey.startsWith("studio")) {
    return "studio";
  }

  if (
    normalizedKey.startsWith("one") ||
    normalizedKey.includes("1-bedroom") ||
    normalizedKey.includes("one-bedroom")
  ) {
    return "one";
  }

  if (
    normalizedKey.startsWith("two") ||
    normalizedKey.includes("2-bedroom") ||
    normalizedKey.includes("two-bedroom")
  ) {
    return "two";
  }

  if (
    normalizedKey.startsWith("three") ||
    normalizedKey.includes("3-bedroom") ||
    normalizedKey.includes("three-bedroom")
  ) {
    return "three";
  }

  if (
    normalizedKey.startsWith("penthouse") ||
    normalizedKey.includes("pha") ||
    normalizedKey.includes("phb") ||
    normalizedKey.includes("phc")
  ) {
    return "penthouse";
  }

  return "other";
}

function setImageFallback(imageElement) {
  if (!imageElement) {
    return;
  }

  imageElement.addEventListener(
    "error",
    () => {
      if (imageElement.src.endsWith(FALLBACK_IMAGE)) {
        return;
      }

      imageElement.src = FALLBACK_IMAGE;
    },
    { once: true }
  );
}

function vibrateSelection() {
  try {
    tg?.HapticFeedback?.selectionChanged();
  } catch (error) {
    console.warn("Telegram haptic feedback unavailable:", error);
  }
}

function vibrateNotification(type) {
  try {
    tg?.HapticFeedback?.notificationOccurred(type);
  } catch (error) {
    console.warn("Telegram notification feedback unavailable:", error);
  }
}

/* =========================================================
   LANGUAGE
   ========================================================= */

function applyLanguage() {
  const languageData =
    translations[currentLanguage] ||
    translations.en;

  document.documentElement.lang = currentLanguage;

  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {
      const translationKey = element.dataset.i18n;
      const translatedValue = languageData[translationKey];

      if (translatedValue !== undefined) {
        element.innerHTML = translatedValue;
      }
    });

  const languageText =
    document.querySelector("#langBtn span");

  if (languageText) {
    languageText.textContent =
      currentLanguage.toUpperCase();
  }

  updateRoomSelectPlaceholder();
  renderApartments(getActiveFilter());
}

function cycleLanguage() {
  if (currentLanguage === "en") {
    currentLanguage = "km";
  } else if (currentLanguage === "km") {
    currentLanguage = "zh";
  } else {
    currentLanguage = "en";
  }

  applyLanguage();
  vibrateSelection();
}

/* =========================================================
   ROOM FILTERS
   ========================================================= */

function getActiveFilter() {
  const activeButton = document.querySelector(
    ".room-filters button.active"
  );

  return activeButton?.dataset.filter || "all";
}

function setActiveFilter(selectedButton) {
  document
    .querySelectorAll(".room-filters button")
    .forEach((button) => {
      button.classList.remove("active");
    });

  selectedButton.classList.add("active");

  const filter =
    selectedButton.dataset.filter || "all";

  renderApartments(filter);
  vibrateSelection();
}

/* =========================================================
   APARTMENT CARDS
   ========================================================= */

function renderApartments(filter = "all") {
  const roomGrid = document.getElementById("rooms");

  if (!roomGrid) {
    console.error("Apartment grid #rooms was not found.");
    return;
  }

  roomGrid.innerHTML = "";

  const filteredApartments = apartments.filter(
    (apartment) => {
      if (filter === "all") {
        return true;
      }

      return apartment.category === filter;
    }
  );

  if (filteredApartments.length === 0) {
    roomGrid.innerHTML = `
      <p>${escapeHtml(getTranslation("noRooms"))}</p>
    `;

    return;
  }

  filteredApartments.forEach(
    (apartment, position) => {
      const roomCard = createApartmentCard(
        apartment,
        position
      );

      roomGrid.appendChild(roomCard);
    }
  );

  observeRevealElements();
}

function createApartmentCard(apartment, position) {
  const images = normalizeImages(apartment.images);
  const roomCard = document.createElement("article");

  roomCard.className = "room reveal";
  roomCard.dataset.roomKey = apartment.key;
  roomCard.style.transitionDelay =
    `${Math.min(position * 55, 275)}ms`;

  const metaItems = [
    apartment.bedrooms,
    apartment.bathrooms,
  ].filter(Boolean);

  roomCard.innerHTML = `
    <div class="room-media">
      <img
        src="${escapeHtml(images[0])}"
        alt="${escapeHtml(apartment.title)}"
        loading="lazy"
      >

      <span class="room-chip">
        ${escapeHtml(apartment.size)}
      </span>

      <span class="photo-count">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h16v14H4z"></path>
          <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
          <path d="m4 16 5-4 4 3 3-2 4 3"></path>
        </svg>

        ${images.length}
        ${escapeHtml(getTranslation("photos"))}
      </span>
    </div>

    <div class="room-body">
      <h3>${escapeHtml(apartment.title)}</h3>

      <div class="room-meta">
        <span>${escapeHtml(apartment.price)}</span>
        <span>${escapeHtml(apartment.availability)}</span>

        ${metaItems
          .map(
            (item) =>
              `<span>${escapeHtml(item)}</span>`
          )
          .join("")}
      </div>

      <button
        class="room-view"
        type="button"
        aria-label="${escapeHtml(
          getTranslation("viewGallery")
        )}"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"></path>
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
        </svg>

        ${escapeHtml(getTranslation("viewGallery"))}
      </button>
    </div>
  `;

  const image = roomCard.querySelector("img");
  const galleryButton =
    roomCard.querySelector(".room-view");

  setImageFallback(image);

  galleryButton?.addEventListener("click", () => {
    openApartmentModal(apartment);
  });

  return roomCard;
}

/* =========================================================
   APARTMENT SELECT
   ========================================================= */

function updateRoomSelectPlaceholder() {
  const roomSelect =
    document.getElementById("roomSelect");

  if (!roomSelect) {
    return;
  }

  const firstOption =
    roomSelect.querySelector('option[value=""]');

  if (firstOption) {
    firstOption.textContent =
      getTranslation("chooseApartment");
  }
}

function populateApartmentSelect() {
  const roomSelect =
    document.getElementById("roomSelect");

  if (!roomSelect) {
    console.error(
      "Apartment select #roomSelect was not found."
    );

    return;
  }

  roomSelect.innerHTML = "";

  const placeholder =
    document.createElement("option");

  placeholder.value = "";
  placeholder.textContent =
    getTranslation("chooseApartment");
  placeholder.disabled = true;
  placeholder.selected = true;

  roomSelect.appendChild(placeholder);

  apartments.forEach((apartment) => {
    const option =
      document.createElement("option");

    option.value = apartment.key;
    option.textContent =
      `${apartment.title} • ${apartment.size}`;

    roomSelect.appendChild(option);
  });
}

/* =========================================================
   MODAL AND GALLERY
   ========================================================= */

function openApartmentModal(apartment) {
  if (!apartment) {
    return;
  }

  selectedApartment = apartment;
  galleryIndex = 0;

  const modal =
    document.getElementById("modal");

  const modalTitle =
    document.getElementById("modalTitle");

  const modalSize =
    document.getElementById("modalSize");

  const modalMeta =
    document.getElementById("modalMeta");

  if (modalTitle) {
    modalTitle.textContent = apartment.title;
  }

  if (modalSize) {
    modalSize.textContent = apartment.size;
  }

  if (modalMeta) {
    const details = [
      apartment.bedrooms,
      apartment.bathrooms,
      apartment.price,
      apartment.availability,
    ].filter(Boolean);

    modalMeta.textContent = details.join(" • ");
  }

  renderGallery();

  if (modal) {
    modal.hidden = false;
  }

  document.body.style.overflow = "hidden";
  vibrateSelection();
}

function closeApartmentModal() {
  const modal =
    document.getElementById("modal");

  if (modal) {
    modal.hidden = true;
  }

  document.body.style.overflow = "";
}

function renderGallery() {
  if (!selectedApartment) {
    return;
  }

  const images = normalizeImages(
    selectedApartment.images
  );

  if (galleryIndex < 0) {
    galleryIndex = images.length - 1;
  }

  if (galleryIndex >= images.length) {
    galleryIndex = 0;
  }

  const galleryImage =
    document.getElementById("galleryImg");

  const counter =
    document.getElementById("counter");

  const dots =
    document.getElementById("dots");

  if (galleryImage) {
    galleryImage.src = images[galleryIndex];
    galleryImage.alt =
      `${selectedApartment.title} photo ${
        galleryIndex + 1
      }`;

    setImageFallback(galleryImage);
  }

  if (counter) {
    counter.textContent =
      `${galleryIndex + 1} / ${images.length}`;
  }

  if (dots) {
    dots.innerHTML = images
      .map((_, dotIndex) => {
        const activeClass =
          dotIndex === galleryIndex
            ? "active"
            : "";

        return `<i class="${activeClass}"></i>`;
      })
      .join("");
  }
}

function changeGalleryImage(direction) {
  if (!selectedApartment) {
    return;
  }

  const images = normalizeImages(
    selectedApartment.images
  );

  galleryIndex =
    (galleryIndex + direction + images.length) %
    images.length;

  renderGallery();
  vibrateSelection();
}

/* =========================================================
   CONTINUE WITH PART 2 DIRECTLY BELOW
   DO NOT ADD ANYTHING BETWEEN PART 1 AND PART 2
   ========================================================= *//* =========================================================
   MODAL ACTIONS
   ========================================================= */

function selectCurrentApartment() {
  if (!selectedApartment) {
    return;
  }

  const roomSelect =
    document.getElementById("roomSelect");

  if (roomSelect) {
    roomSelect.value = selectedApartment.key;
  }

  closeApartmentModal();

  document
    .getElementById("booking")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  vibrateSelection();
}

/* =========================================================
   SERVICES
   ========================================================= */

function renderServiceList(elementId, items) {
  const listElement =
    document.getElementById(elementId);

  if (!listElement) {
    return;
  }

  listElement.innerHTML = items
    .map((item) => {
      return `<li>${escapeHtml(item)}</li>`;
    })
    .join("");
}

/* =========================================================
   API DATA
   ========================================================= */

async function loadConfiguration() {
  try {
    const response = await fetch("/api/config", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Configuration request failed: ${response.status}`
      );
    }

    const configuration = await response.json();

    const apiApartments = Array.isArray(
      configuration.apartments
    )
      ? configuration.apartments
      : [];

    apartments =
      apiApartments.length > 0
        ? apiApartments.map(normalizeApartment)
        : fallbackApartments.map(normalizeApartment);

    const includedServices =
      Array.isArray(configuration.serviceIncluded) &&
      configuration.serviceIncluded.length > 0
        ? configuration.serviceIncluded
        : defaultServicesIncluded;

    const excludedServices =
      Array.isArray(configuration.serviceExcluded) &&
      configuration.serviceExcluded.length > 0
        ? configuration.serviceExcluded
        : defaultServicesExcluded;

    renderServiceList(
      "included",
      includedServices
    );

    renderServiceList(
      "excluded",
      excludedServices
    );
  } catch (error) {
    console.warn(
      "Unable to load /api/config. Using fallback apartment data.",
      error
    );

    apartments =
      fallbackApartments.map(normalizeApartment);

    renderServiceList(
      "included",
      defaultServicesIncluded
    );

    renderServiceList(
      "excluded",
      defaultServicesExcluded
    );
  }
}

/* =========================================================
   BOOKING FORM
   ========================================================= */

function getFormPayload(form) {
  const formData = new FormData(form);
  const payload = Object.fromEntries(
    formData.entries()
  );

  const selectedRoom = apartments.find(
    (apartment) =>
      apartment.key === payload.apartment ||
      apartment.key === payload.room ||
      apartment.key === payload.roomType
  );

  if (selectedRoom) {
    payload.apartmentKey = selectedRoom.key;
    payload.apartmentTitle = selectedRoom.title;
    payload.apartmentSize = selectedRoom.size;
  }

  payload.language = currentLanguage;
  payload.source = "Telegram Mini App";
  payload.telegramUserId =
    tg?.initDataUnsafe?.user?.id || "";
  payload.telegramUsername =
    tg?.initDataUnsafe?.user?.username || "";
  payload.telegramFirstName =
    tg?.initDataUnsafe?.user?.first_name || "";
  payload.telegramLastName =
    tg?.initDataUnsafe?.user?.last_name || "";

  return payload;
}

function setSubmitState(button, loading) {
  if (!button) {
    return;
  }

  const loader =
    button.querySelector(".loader");

  const buttonText =
    button.querySelector(
      "[data-submit-text]"
    );

  button.disabled = loading;

  if (loader) {
    loader.hidden = !loading;
  }

  if (buttonText) {
    buttonText.textContent = loading
      ? getTranslation("sending")
      : getTranslation("submit");
  }
}

function showFormStatus(message, type = "") {
  const status =
    document.getElementById("status");

  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.type = type;
}

async function submitInquiry(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const submitButton =
    form.querySelector(".submit-btn");

  setSubmitState(submitButton, true);
  showFormStatus(
    getTranslation("sending"),
    "loading"
  );

  try {
    const payload = getFormPayload(form);

    const response = await fetch(
      "/api/inquiry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message ||
          result.error ||
          getTranslation("failed")
      );
    }

    const successMessage =
      result.inquiryId
        ? `✅ ${getTranslation(
            "success"
          )} ID: ${result.inquiryId}`
        : `✅ ${getTranslation("success")}`;

    showFormStatus(
      successMessage,
      "success"
    );

    form.reset();

    const roomSelect =
      document.getElementById("roomSelect");

    if (roomSelect) {
      roomSelect.selectedIndex = 0;
    }

    vibrateNotification("success");
  } catch (error) {
    console.error(
      "Inquiry submission error:",
      error
    );

    showFormStatus(
      `❌ ${
        error.message ||
        getTranslation("failed")
      }`,
      "error"
    );

    vibrateNotification("error");
  } finally {
    setSubmitState(
      submitButton,
      false
    );
  }
}

/* =========================================================
   DATE VALIDATION
   ========================================================= */

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function setMinimumDates() {
  const today = formatDateInput(
    new Date()
  );

  const checkInInput =
    document.querySelector(
      'input[name="checkIn"], #checkIn'
    );

  const checkOutInput =
    document.querySelector(
      'input[name="checkOut"], #checkOut'
    );

  if (checkInInput) {
    checkInInput.min = today;

    checkInInput.addEventListener(
      "change",
      () => {
        if (
          checkOutInput &&
          checkInInput.value
        ) {
          checkOutInput.min =
            checkInInput.value;

          if (
            checkOutInput.value &&
            checkOutInput.value <
              checkInInput.value
          ) {
            checkOutInput.value = "";
          }
        }
      }
    );
  }

  if (checkOutInput) {
    checkOutInput.min = today;
  }
}

/* =========================================================
   SCROLL REVEAL
   ========================================================= */

let revealObserver = null;

function observeRevealElements() {
  const revealElements =
    document.querySelectorAll(
      ".reveal:not(.visible)"
    );

  if (
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach(
      (element) => {
        element.classList.add("visible");
      }
    );

    return;
  }

  if (!revealObserver) {
    revealObserver =
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

                revealObserver.unobserve(
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
  }

  revealElements.forEach(
    (element) => {
      revealObserver.observe(element);
    }
  );
}

/* =========================================================
   BOTTOM NAVIGATION
   ========================================================= */

function initializeBottomNavigation() {
  const navigationLinks = [
    ...document.querySelectorAll(
      ".bottom-nav a"
    ),
  ];

  const sectionIds = [
    "home",
    "apartments",
    "facilities",
    "booking",
  ];

  if (
    navigationLinks.length === 0
  ) {
    return;
  }

  navigationLinks.forEach(
    (link) => {
      link.addEventListener(
        "click",
        () => {
          navigationLinks.forEach(
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

  if (
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  const navigationObserver =
    new IntersectionObserver(
      (entries) => {
        const visibleEntry =
          entries
            .filter(
              (entry) =>
                entry.isIntersecting
            )
            .sort(
              (first, second) =>
                second.intersectionRatio -
                first.intersectionRatio
            )[0];

        if (!visibleEntry) {
          return;
        }

        navigationLinks.forEach(
          (link) => {
            const target =
              link.getAttribute(
                "href"
              );

            link.classList.toggle(
              "active",
              target ===
                `#${visibleEntry.target.id}`
            );
          }
        );
      },
      {
        threshold: [
          0.25,
          0.45,
          0.65,
        ],
      }
    );

  sectionIds.forEach((id) => {
    const section =
      document.getElementById(id);

    if (section) {
      navigationObserver.observe(
        section
      );
    }
  });
}

/* =========================================================
   TOUCH GALLERY
   ========================================================= */

function initializeGallerySwipe() {
  const gallery =
    document.getElementById("gallery");

  if (!gallery) {
    return;
  }

  gallery.addEventListener(
    "touchstart",
    (event) => {
      touchStartX =
        event.changedTouches[0]
          .clientX;
    },
    {
      passive: true,
    }
  );

  gallery.addEventListener(
    "touchend",
    (event) => {
      const touchEndX =
        event.changedTouches[0]
          .clientX;

      const distance =
        touchEndX - touchStartX;

      if (
        Math.abs(distance) > 45
      ) {
        changeGalleryImage(
          distance > 0 ? -1 : 1
        );
      }
    },
    {
      passive: true,
    }
  );
}

/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

function initializeKeyboardControls() {
  document.addEventListener(
    "keydown",
    (event) => {
      const modal =
        document.getElementById(
          "modal"
        );

      if (!modal || modal.hidden) {
        return;
      }

      if (event.key === "Escape") {
        closeApartmentModal();
      }

      if (
        event.key === "ArrowLeft"
      ) {
        changeGalleryImage(-1);
      }

      if (
        event.key === "ArrowRight"
      ) {
        changeGalleryImage(1);
      }
    }
  );
}

/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function initializeEventListeners() {
  const languageButton =
    document.getElementById(
      "langBtn"
    );

  languageButton?.addEventListener(
    "click",
    cycleLanguage
  );

  document
    .querySelectorAll(
      ".room-filters button"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          setActiveFilter(button);
        }
      );
    });

  document
    .getElementById("prev")
    ?.addEventListener(
      "click",
      () => {
        changeGalleryImage(-1);
      }
    );

  document
    .getElementById("next")
    ?.addEventListener(
      "click",
      () => {
        changeGalleryImage(1);
      }
    );

  document
    .querySelectorAll(
      "[data-close]"
    )
    .forEach((element) => {
      element.addEventListener(
        "click",
        closeApartmentModal
      );
    });

  document
    .getElementById("choose")
    ?.addEventListener(
      "click",
      selectCurrentApartment
    );

  const bookingForm =
    document.getElementById(
      "form"
    );

  if (bookingForm) {
    bookingForm.addEventListener(
      "submit",
      submitInquiry
    );
  } else {
    console.error(
      "Booking form #form was not found."
    );
  }

  initializeGallerySwipe();
  initializeKeyboardControls();
  initializeBottomNavigation();
}

/* =========================================================
   URL APARTMENT SELECTION
   ========================================================= */

function openApartmentFromUrl() {
  const parameters =
    new URLSearchParams(
      window.location.search
    );

  const requestedKey =
    parameters.get("room") ||
    parameters.get("apartment");

  if (!requestedKey) {
    return;
  }

  const requestedApartment =
    apartments.find(
      (apartment) =>
        apartment.key ===
        requestedKey
    );

  if (
    requestedApartment
  ) {
    window.setTimeout(
      () => {
        openApartmentModal(
          requestedApartment
        );
      },
      300
    );
  }
}

/* =========================================================
   SPLASH SCREEN
   ========================================================= */

function hideSplashScreen() {
  const splash =
    document.getElementById(
      "splash"
    );

  window.setTimeout(
    () => {
      splash?.classList.add(
        "hide"
      );
    },
    800
  );
}

/* =========================================================
   MINI APP OPEN TRACKING
   ========================================================= */

function trackMiniAppOpen() {
  fetch("/api/open", {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify({
      source:
        "Telegram Mini App",
      language:
        currentLanguage,
      telegramUserId:
        tg?.initDataUnsafe
          ?.user?.id || "",
      username:
        tg?.initDataUnsafe
          ?.user?.username || "",
      openedAt:
        new Date().toISOString(),
    }),
  }).catch(() => {
    // Tracking failure should not stop the app.
  });
}

/* =========================================================
   APPLICATION INITIALIZATION
   ========================================================= */

async function initializeApplication() {
  try {
    applyLanguage();
    setMinimumDates();
    initializeEventListeners();

    await loadConfiguration();

    renderApartments("all");
    populateApartmentSelect();
    observeRevealElements();
    openApartmentFromUrl();

    console.info(
      `${APP_NAME} loaded successfully.`
    );
  } catch (error) {
    console.error(
      "Application initialization error:",
      error
    );

    const roomGrid =
      document.getElementById(
        "rooms"
      );

    if (roomGrid) {
      roomGrid.innerHTML = `
        <p>${escapeHtml(
          getTranslation(
            "loadingError"
          )
        )}</p>
      `;
    }
  } finally {
    hideSplashScreen();
    trackMiniAppOpen();
  }
}

/* =========================================================
   START APPLICATION
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
  );
} else {
  initializeApplication();
}