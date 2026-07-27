"use strict";

/* ==========================================================
   MALINE SMART ASSISTANT V3
   FILE: web/app.js

   Functions:
   - Telegram Mini App initialization
   - Logo opening animation
   - English, Khmer and Chinese translation
   - Apartment loading
   - Room filtering
   - Photo gallery
   - Swipe navigation
   - Booking form
   - Contact buttons
   - Website, Telegram, Google Maps and social media
========================================================== */


/* ==========================================================
   1. TELEGRAM MINI APP
========================================================== */

const telegramWebApp =
    window.Telegram &&
    window.Telegram.WebApp
        ? window.Telegram.WebApp
        : null;

if (telegramWebApp) {
    try {
        telegramWebApp.ready();
        telegramWebApp.expand();

        telegramWebApp.setHeaderColor("#e83e8c");
        telegramWebApp.setBackgroundColor("#fff9fc");

        if (telegramWebApp.enableClosingConfirmation) {
            telegramWebApp.enableClosingConfirmation();
        }
    } catch (error) {
        console.warn(
            "Telegram initialization warning:",
            error
        );
    }
}


/* ==========================================================
   2. APPLICATION CONFIGURATION
========================================================== */

const APP_CONFIG = {
    fallbackBuildingImage:
        "/web/images/building.jpg",

    defaultPhone:
        "+85523985959",

    defaultPhoneDisplay:
        "+855 23 985 959",

    defaultWebsite:
        "https://www.malineapartments.com.kh",

    defaultTelegram:
        "",

    defaultGoogleMaps:
        "",

    facebook:
        "",

    instagram:
        "",

    tiktok:
        "",

    splashDuration:
        3300,

    galleryAnimationDuration:
        300
};


/* ==========================================================
   3. APPLICATION STATE
========================================================== */

const appState = {
    apartments: [],
    filteredApartments: [],
    selectedApartment: null,
    selectedApartmentImages: [],
    currentGalleryImageIndex: 0,
    activeFilter: "all",
    activeLanguage: "en",
    configuration: null,
    touchStartX: 0,
    touchEndX: 0,
    formSubmitting: false
};


/* ==========================================================
   4. DOM ELEMENTS
========================================================== */

const elements = {
    splashScreen:
        document.getElementById("splashScreen"),

    miniApp:
        document.getElementById("miniApp"),

    languageSelect:
        document.getElementById("languageSelect"),

    apartmentGrid:
        document.getElementById("apartmentGrid"),

    apartmentSelect:
        document.getElementById("apartmentSelect"),

    bookingForm:
        document.getElementById("bookingForm"),

    submitInquiryButton:
        document.getElementById("submitInquiryButton"),

    formStatus:
        document.getElementById("formStatus"),

    checkInDate:
        document.getElementById("checkInDate"),

    checkOutDate:
        document.getElementById("checkOutDate"),

    galleryModal:
        document.getElementById("galleryModal"),

    galleryImage:
        document.getElementById("galleryImage"),

    galleryTitle:
        document.getElementById("galleryTitle"),

    galleryDetails:
        document.getElementById("galleryDetails"),

    currentImageNumber:
        document.getElementById("currentImageNumber"),

    totalImageNumber:
        document.getElementById("totalImageNumber"),

    previousImageButton:
        document.getElementById("previousImageButton"),

    nextImageButton:
        document.getElementById("nextImageButton"),

    selectApartmentButton:
        document.getElementById("selectApartmentButton"),

    phoneContact:
        document.getElementById("phoneContact"),

    telegramContact:
        document.getElementById("telegramContact"),

    websiteContact:
        document.getElementById("websiteContact"),

    locationContact:
        document.getElementById("locationContact"),

    facebookButton:
        document.getElementById("facebookButton"),

    instagramButton:
        document.getElementById("instagramButton"),

    tiktokButton:
        document.getElementById("tiktokButton"),

    currentYear:
        document.getElementById("currentYear")
};


/* ==========================================================
   5. TRANSLATION DATA
========================================================== */

const translations = {
    en: {
        welcomeLabel:
            "WELCOME TO MALINE",

        heroTitle:
            "Luxury Living in Phnom Penh",

        heroDescription:
            "Discover spacious serviced apartments, premium facilities and comfortable long-term living.",

        exploreApartments:
            "Explore Apartments",

        bookViewing:
            "Book a Viewing",

        apartments:
            "Apartments",

        facilities:
            "Facilities",

        booking:
            "Booking",

        contact:
            "Contact",

        residencesLabel:
            "OUR RESIDENCES",

        chooseApartment:
            "Choose Your Apartment",

        apartmentIntroduction:
            "Select a room type to view information, availability, prices and photos.",

        allRooms:
            "All",

        loadingApartments:
            "Loading apartments...",

        lifestyleLabel:
            "PREMIUM LIFESTYLE",

        facilitiesTitle:
            "Facilities and Services",

        facilitiesDescription:
            "Everything you need for convenient and comfortable living.",

        swimmingPool:
            "Swimming Pool",

        swimmingPoolDescription:
            "Relax and enjoy our spacious outdoor swimming pool.",

        professionalGym:
            "Professional Gym",

        professionalGymDescription:
            "Modern fitness equipment for your daily exercise.",

        steamSauna:
            "Steam and Sauna",

        steamSaunaDescription:
            "Refresh your body and relax after a busy day.",

        kidsPlayground:
            "Kids Playground",

        kidsPlaygroundDescription:
            "A safe and comfortable play area for children.",

        parking:
            "In-house Parking",

        parkingDescription:
            "Secure and convenient parking for residents.",

        reception:
            "Reception Support",

        receptionDescription:
            "Friendly assistance and professional resident support.",

        wifi:
            "Wi-Fi Internet",

        wifiDescription:
            "Internet service is provided throughout the apartment.",

        security:
            "Security",

        securityDescription:
            "Professional security service for resident safety.",

        servicesIncluded:
            "Services Included",

        servicesExcluded:
            "Services Excluded",

        bookingLabel:
            "SCHEDULE A VIEWING",

        bookingTitle:
            "Send Your Inquiry",

        bookingDescription:
            "Complete the form and our team will contact you.",

        fullName:
            "Full name",

        phoneNumber:
            "Phone number",

        apartmentType:
            "Apartment type",

        chooseApartmentOption:
            "Choose an apartment",

        checkIn:
            "Check-in date",

        checkOut:
            "Check-out date",

        stayLength:
            "Expected stay",

        chooseStay:
            "Choose stay length",

        monthlyBudget:
            "Monthly budget",

        message:
            "Message",

        sendInquiry:
            "Send Inquiry",

        contactLabel:
            "WE ARE HERE TO HELP",

        contactTitle:
            "Contact Us",

        contactDescription:
            "Contact the Maline Apartments team for apartment availability, prices, appointments and more information.",

        callReception:
            "Call Reception",

        telegramContact:
            "Telegram",

        messageOurTeam:
            "Message Our Team",

        officialWebsite:
            "Official Website",

        ourLocation:
            "Our Location",

        followUs:
            "Follow Maline Apartments",

        chooseThisApartment:
            "Choose This Apartment",

        viewGallery:
            "View Gallery",

        bookApartment:
            "Book Apartment",

        contactForPrice:
            "Contact us for price",

        contactForAvailability:
            "Contact reception",

        available:
            "Available",

        sending:
            "Sending inquiry...",

        inquirySuccess:
            "Your inquiry was sent successfully.",

        inquiryError:
            "Unable to send your inquiry. Please try again.",

        requiredField:
            "This field is required.",

        invalidEmail:
            "Please enter a valid email address.",

        invalidPhone:
            "Please enter a valid phone number.",

        invalidDate:
            "Check-out must be after check-in.",

        noApartments:
            "No apartments found.",

        unableToLoad:
            "Unable to load apartment information.",

        contactNotAvailable:
            "This contact link is not available yet."
    },

    km: {
        welcomeLabel:
            "សូមស្វាគមន៍មកកាន់ម៉ាលីន",

        heroTitle:
            "ការរស់នៅប្រណីតនៅភ្នំពេញ",

        heroDescription:
            "ស្វែងយល់អាផាតមិនធំទូលាយ បរិក្ខារប្រណីត និងការរស់នៅរយៈពេលវែងប្រកបដោយផាសុកភាព។",

        exploreApartments:
            "មើលអាផាតមិន",

        bookViewing:
            "កក់ពេលមើលបន្ទប់",

        apartments:
            "អាផាតមិន",

        facilities:
            "បរិក្ខារ",

        booking:
            "ការកក់",

        contact:
            "ទំនាក់ទំនង",

        residencesLabel:
            "អាផាតមិនរបស់យើង",

        chooseApartment:
            "ជ្រើសរើសអាផាតមិន",

        apartmentIntroduction:
            "ជ្រើសប្រភេទបន្ទប់ ដើម្បីមើលព័ត៌មាន តម្លៃ បន្ទប់ទំនេរ និងរូបភាព។",

        allRooms:
            "ទាំងអស់",

        loadingApartments:
            "កំពុងផ្ទុកអាផាតមិន...",

        lifestyleLabel:
            "ជីវិតរស់នៅប្រណីត",

        facilitiesTitle:
            "បរិក្ខារ និងសេវាកម្ម",

        facilitiesDescription:
            "អ្វីៗគ្រប់យ៉ាងដែលអ្នកត្រូវការសម្រាប់ការរស់នៅប្រកបដោយភាពងាយស្រួល។",

        swimmingPool:
            "អាងហែលទឹក",

        swimmingPoolDescription:
            "សម្រាក និងរីករាយជាមួយអាងហែលទឹករបស់យើង។",

        professionalGym:
            "កន្លែងហាត់ប្រាណ",

        professionalGymDescription:
            "ឧបករណ៍ហាត់ប្រាណទំនើបសម្រាប់ការហាត់ប្រចាំថ្ងៃ។",

        steamSauna:
            "បន្ទប់ស្ទីម និងសូណា",

        steamSaunaDescription:
            "សម្រាករាងកាយបន្ទាប់ពីថ្ងៃដ៏មមាញឹក។",

        kidsPlayground:
            "កន្លែងក្មេងលេង",

        kidsPlaygroundDescription:
            "កន្លែងលេងមានសុវត្ថិភាព និងផាសុកភាពសម្រាប់កុមារ។",

        parking:
            "ចំណតរថយន្ត",

        parkingDescription:
            "ចំណតរថយន្តមានសុវត្ថិភាពសម្រាប់អ្នកស្នាក់នៅ។",

        reception:
            "សេវាកម្មទទួលភ្ញៀវ",

        receptionDescription:
            "ជំនួយរួសរាយរាក់ទាក់ និងសេវាកម្មវិជ្ជាជីវៈ។",

        wifi:
            "អ៊ីនធឺណិត Wi-Fi",

        wifiDescription:
            "មានសេវាអ៊ីនធឺណិតនៅក្នុងអាផាតមិន។",

        security:
            "សន្តិសុខ",

        securityDescription:
            "សេវាសន្តិសុខវិជ្ជាជីវៈសម្រាប់សុវត្ថិភាពអ្នកស្នាក់នៅ។",

        servicesIncluded:
            "សេវាកម្មរួមបញ្ចូល",

        servicesExcluded:
            "សេវាកម្មមិនរួមបញ្ចូល",

        bookingLabel:
            "កំណត់ពេលមើលបន្ទប់",

        bookingTitle:
            "ផ្ញើសំណើរបស់អ្នក",

        bookingDescription:
            "សូមបំពេញទម្រង់ ហើយក្រុមការងាររបស់យើងនឹងទាក់ទងអ្នក។",

        fullName:
            "ឈ្មោះពេញ",

        phoneNumber:
            "លេខទូរស័ព្ទ",

        apartmentType:
            "ប្រភេទអាផាតមិន",

        chooseApartmentOption:
            "ជ្រើសរើសអាផាតមិន",

        checkIn:
            "ថ្ងៃចូលស្នាក់នៅ",

        checkOut:
            "ថ្ងៃចាកចេញ",

        stayLength:
            "រយៈពេលស្នាក់នៅ",

        chooseStay:
            "ជ្រើសរើសរយៈពេលស្នាក់នៅ",

        monthlyBudget:
            "ថវិកាប្រចាំខែ",

        message:
            "សារ",

        sendInquiry:
            "ផ្ញើសំណើ",

        contactLabel:
            "យើងនៅទីនេះដើម្បីជួយអ្នក",

        contactTitle:
            "ទំនាក់ទំនងយើង",

        contactDescription:
            "ទាក់ទងក្រុមការងារ Maline Apartments សម្រាប់ព័ត៌មានបន្ទប់ទំនេរ តម្លៃ និងការណាត់ជួបមើលបន្ទប់។",

        callReception:
            "ទូរស័ព្ទទៅផ្នែកទទួលភ្ញៀវ",

        telegramContact:
            "Telegram",

        messageOurTeam:
            "ផ្ញើសារទៅក្រុមការងារ",

        officialWebsite:
            "វេបសាយផ្លូវការ",

        ourLocation:
            "ទីតាំងរបស់យើង",

        followUs:
            "តាមដាន Maline Apartments",

        chooseThisApartment:
            "ជ្រើសរើសអាផាតមិននេះ",

        viewGallery:
            "មើលរូបភាព",

        bookApartment:
            "កក់អាផាតមិន",

        contactForPrice:
            "ទាក់ទងយើងសម្រាប់តម្លៃ",

        contactForAvailability:
            "ទាក់ទងផ្នែកទទួលភ្ញៀវ",

        available:
            "មានបន្ទប់ទំនេរ",

        sending:
            "កំពុងផ្ញើសំណើ...",

        inquirySuccess:
            "សំណើរបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ។",

        inquiryError:
            "មិនអាចផ្ញើសំណើបានទេ។ សូមព្យាយាមម្តងទៀត។",

        requiredField:
            "សូមបំពេញព័ត៌មាននេះ។",

        invalidEmail:
            "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។",

        invalidPhone:
            "សូមបញ្ចូលលេខទូរស័ព្ទត្រឹមត្រូវ។",

        invalidDate:
            "ថ្ងៃចាកចេញត្រូវតែក្រោយថ្ងៃចូលស្នាក់នៅ។",

        noApartments:
            "រកមិនឃើញអាផាតមិន។",

        unableToLoad:
            "មិនអាចផ្ទុកព័ត៌មានអាផាតមិនបានទេ។",

        contactNotAvailable:
            "តំណទំនាក់ទំនងនេះមិនទាន់មានទេ។"
    },

    zh: {
        welcomeLabel:
            "欢迎来到 MALINE",

        heroTitle:
            "金边豪华生活",

        heroDescription:
            "探索宽敞的服务式公寓、高级设施和舒适的长期居住环境。",

        exploreApartments:
            "浏览公寓",

        bookViewing:
            "预约看房",

        apartments:
            "公寓",

        facilities:
            "设施",

        booking:
            "预约",

        contact:
            "联系我们",

        residencesLabel:
            "我们的住宅",

        chooseApartment:
            "选择您的公寓",

        apartmentIntroduction:
            "选择房型，查看信息、价格、空房情况和照片。",

        allRooms:
            "全部",

        loadingApartments:
            "正在加载公寓...",

        lifestyleLabel:
            "优质生活方式",

        facilitiesTitle:
            "设施和服务",

        facilitiesDescription:
            "为舒适便利的生活提供您所需的一切。",

        swimmingPool:
            "游泳池",

        swimmingPoolDescription:
            "在宽敞的室外游泳池中放松身心。",

        professionalGym:
            "专业健身房",

        professionalGymDescription:
            "现代健身设备满足您的日常锻炼需求。",

        steamSauna:
            "蒸汽房和桑拿",

        steamSaunaDescription:
            "忙碌一天后，让身体放松下来。",

        kidsPlayground:
            "儿童游乐场",

        kidsPlaygroundDescription:
            "为儿童提供安全舒适的游戏区域。",

        parking:
            "内部停车场",

        parkingDescription:
            "为住户提供安全便利的停车服务。",

        reception:
            "前台服务",

        receptionDescription:
            "友好且专业的住户支持服务。",

        wifi:
            "Wi-Fi 网络",

        wifiDescription:
            "公寓内提供网络服务。",

        security:
            "安保服务",

        securityDescription:
            "专业安保服务保障住户安全。",

        servicesIncluded:
            "包含服务",

        servicesExcluded:
            "不包含服务",

        bookingLabel:
            "预约看房",

        bookingTitle:
            "发送咨询",

        bookingDescription:
            "填写表格后，我们的团队将与您联系。",

        fullName:
            "姓名",

        phoneNumber:
            "电话号码",

        apartmentType:
            "公寓类型",

        chooseApartmentOption:
            "选择公寓",

        checkIn:
            "入住日期",

        checkOut:
            "退房日期",

        stayLength:
            "预计入住时间",

        chooseStay:
            "选择入住时间",

        monthlyBudget:
            "每月预算",

        message:
            "留言",

        sendInquiry:
            "发送咨询",

        contactLabel:
            "我们随时为您提供帮助",

        contactTitle:
            "联系我们",

        contactDescription:
            "联系 Maline Apartments 团队，了解空房、价格、预约和更多信息。",

        callReception:
            "致电前台",

        telegramContact:
            "Telegram",

        messageOurTeam:
            "联系我们的团队",

        officialWebsite:
            "官方网站",

        ourLocation:
            "我们的位置",

        followUs:
            "关注 Maline Apartments",

        chooseThisApartment:
            "选择此公寓",

        viewGallery:
            "查看照片",

        bookApartment:
            "预订公寓",

        contactForPrice:
            "请联系我们了解价格",

        contactForAvailability:
            "请联系前台",

        available:
            "有空房",

        sending:
            "正在发送咨询...",

        inquirySuccess:
            "您的咨询已成功发送。",

        inquiryError:
            "无法发送咨询，请重试。",

        requiredField:
            "此项为必填项。",

        invalidEmail:
            "请输入有效的电子邮件地址。",

        invalidPhone:
            "请输入有效的电话号码。",

        invalidDate:
            "退房日期必须晚于入住日期。",

        noApartments:
            "未找到公寓。",

        unableToLoad:
            "无法加载公寓信息。",

        contactNotAvailable:
            "此联系方式尚不可用。"
    }
};


/* ==========================================================
   6. HELPERS
========================================================== */

function getTranslation(key) {
    const language =
        translations[appState.activeLanguage] ||
        translations.en;

    return language[key] || translations.en[key] || key;
}


function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function wait(milliseconds) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, milliseconds);
    });
}


function normalizeUrl(url) {
    const value = String(url || "").trim();

    if (!value) {
        return "";
    }

    if (
        value.startsWith("https://") ||
        value.startsWith("http://") ||
        value.startsWith("tg://")
    ) {
        return value;
    }

    return `https://${value}`;
}


function showTelegramAlert(message) {
    if (
        telegramWebApp &&
        typeof telegramWebApp.showAlert === "function"
    ) {
        telegramWebApp.showAlert(message);
        return;
    }

    window.alert(message);
}


function triggerSuccessFeedback() {
    try {
        telegramWebApp?.HapticFeedback?.notificationOccurred(
            "success"
        );
    } catch {
        // Haptic feedback is optional.
    }
}


function triggerErrorFeedback() {
    try {
        telegramWebApp?.HapticFeedback?.notificationOccurred(
            "error"
        );
    } catch {
        // Haptic feedback is optional.
    }
}


function triggerSelectionFeedback() {
    try {
        telegramWebApp?.HapticFeedback?.selectionChanged();
    } catch {
        // Haptic feedback is optional.
    }
}


function openExternalUrl(url) {
    const normalizedUrl = normalizeUrl(url);

    if (!normalizedUrl) {
        showTelegramAlert(
            getTranslation("contactNotAvailable")
        );

        return;
    }

    try {
        if (
            telegramWebApp &&
            typeof telegramWebApp.openLink === "function"
        ) {
            telegramWebApp.openLink(normalizedUrl);
            return;
        }

        window.open(
            normalizedUrl,
            "_blank",
            "noopener,noreferrer"
        );
    } catch {
        window.location.href = normalizedUrl;
    }
}


function openTelegramUrl(url) {
    const normalizedUrl = normalizeUrl(url);

    if (!normalizedUrl) {
        showTelegramAlert(
            getTranslation("contactNotAvailable")
        );

        return;
    }

    try {
        if (
            telegramWebApp &&
            typeof telegramWebApp.openTelegramLink ===
                "function"
        ) {
            telegramWebApp.openTelegramLink(normalizedUrl);
            return;
        }

        openExternalUrl(normalizedUrl);
    } catch {
        openExternalUrl(normalizedUrl);
    }
}


/* ==========================================================
   7. OPENING ANIMATION
========================================================== */

async function runOpeningAnimation() {
    if (!elements.splashScreen || !elements.miniApp) {
        return;
    }

    elements.miniApp.classList.remove("app-visible");

    await wait(APP_CONFIG.splashDuration);

    elements.splashScreen.classList.add(
        "splash-hidden"
    );

    elements.miniApp.classList.add(
        "app-visible"
    );

    await wait(800);

    elements.splashScreen.remove();
}


/* ==========================================================
   8. LANGUAGE SYSTEM
========================================================== */

function applyLanguage(language) {
    if (!translations[language]) {
        language = "en";
    }

    appState.activeLanguage = language;

    document.documentElement.lang =
        language === "km"
            ? "km"
            : language === "zh"
                ? "zh-CN"
                : "en";

    document
        .querySelectorAll("[data-translate]")
        .forEach((element) => {
            const translationKey =
                element.dataset.translate;

            const translatedText =
                getTranslation(translationKey);

            if (translatedText) {
                element.textContent =
                    translatedText;
            }
        });

    updateApartmentSelect();

    renderApartments();

    try {
        localStorage.setItem(
            "maline-language",
            language
        );
    } catch {
        // Storage is optional.
    }
}


function initializeLanguage() {
    let savedLanguage = "en";

    try {
        savedLanguage =
            localStorage.getItem(
                "maline-language"
            ) || "en";
    } catch {
        savedLanguage = "en";
    }

    if (!translations[savedLanguage]) {
        savedLanguage = "en";
    }

    appState.activeLanguage = savedLanguage;

    if (elements.languageSelect) {
        elements.languageSelect.value =
            savedLanguage;
    }

    applyLanguage(savedLanguage);
}


/* ==========================================================
   9. LOAD CONFIGURATION
========================================================== */

async function loadConfiguration() {
    try {
        const response = await fetch(
            "/api/config",
            {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                `Configuration request failed: ${response.status}`
            );
        }

        const configuration =
            await response.json();

        appState.configuration =
            configuration;

        appState.apartments =
            Array.isArray(configuration.apartments)
                ? configuration.apartments
                : [];

        updateContactInformation(
            configuration
        );

        updateServiceLists(
            configuration
        );

        updateApartmentSelect();

        renderApartments();

        sendMiniAppOpenEvent();
    } catch (error) {
        console.error(
            "Unable to load configuration:",
            error
        );

        showApartmentLoadError();
    }
}


async function sendMiniAppOpenEvent() {
    try {
        await fetch(
            "/api/open",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    telegramUserId:
                        telegramWebApp
                            ?.initDataUnsafe
                            ?.user
                            ?.id || null,

                    openedAt:
                        new Date()
                            .toISOString()
                })
            }
        );
    } catch {
        // This statistic is optional.
    }
}


/* ==========================================================
   10. CONTACT INFORMATION
========================================================== */

function updateContactInformation(
    configuration
) {
    const phone =
        configuration.phone ||
        APP_CONFIG.defaultPhoneDisplay;

    const phoneHref =
        String(phone)
            .replace(/[^\d+]/g, "");

    const website =
        configuration.website ||
        APP_CONFIG.defaultWebsite;

    const telegram =
        configuration.telegram ||
        APP_CONFIG.defaultTelegram;

    const maps =
        configuration.maps ||
        APP_CONFIG.defaultGoogleMaps;

    APP_CONFIG.facebook =
        configuration.facebook ||
        APP_CONFIG.facebook;

    APP_CONFIG.instagram =
        configuration.instagram ||
        APP_CONFIG.instagram;

    APP_CONFIG.tiktok =
        configuration.tiktok ||
        APP_CONFIG.tiktok;

    APP_CONFIG.defaultTelegram =
        telegram;

    APP_CONFIG.defaultGoogleMaps =
        maps;

    APP_CONFIG.defaultWebsite =
        website;

    if (elements.phoneContact) {
        elements.phoneContact.href =
            `tel:${phoneHref}`;

        const phoneText =
            elements.phoneContact.querySelector(
                "strong"
            );

        if (phoneText) {
            phoneText.textContent = phone;
        }
    }

    const websiteText =
        elements.websiteContact?.querySelector(
            "strong"
        );

    if (websiteText && website) {
        websiteText.textContent =
            website
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, "");
    }
}


/* ==========================================================
   11. SERVICES
========================================================== */

function updateServiceLists(configuration) {
    const includedList =
        document.getElementById(
            "servicesIncludedList"
        );

    const excludedList =
        document.getElementById(
            "servicesExcludedList"
        );

    if (
        includedList &&
        Array.isArray(
            configuration.serviceIncluded
        )
    ) {
        includedList.innerHTML =
            configuration.serviceIncluded
                .map(
                    (service) =>
                        `<li>${escapeHtml(service)}</li>`
                )
                .join("");
    }

    if (
        excludedList &&
        Array.isArray(
            configuration.serviceExcluded
        )
    ) {
        excludedList.innerHTML =
            configuration.serviceExcluded
                .map(
                    (service) =>
                        `<li>${escapeHtml(service)}</li>`
                )
                .join("");
    }
}


/* ==========================================================
   12. APARTMENT CATEGORY
========================================================== */

function getApartmentCategory(apartment) {
    const key =
        String(apartment.key || "")
            .toLowerCase();

    const title =
        String(apartment.title || "")
            .toLowerCase();

    if (
        key.includes("studio") ||
        title.includes("studio")
    ) {
        return "studio";
    }

    if (
        key.startsWith("one") ||
        title.includes("1 bedroom") ||
        title.includes("one bedroom")
    ) {
        return "one-bedroom";
    }

    if (
        key.startsWith("two") ||
        title.includes("2 bedroom") ||
        title.includes("two bedroom")
    ) {
        return "two-bedroom";
    }

    if (
        key.includes("pha") ||
        key.includes("phb") ||
        key.includes("phc") ||
        key.includes("penthouse") ||
        title.includes("penthouse")
    ) {
        return "penthouse";
    }

    return "other";
}


/* ==========================================================
   13. APARTMENT SELECT OPTIONS
========================================================== */

function updateApartmentSelect() {
    if (!elements.apartmentSelect) {
        return;
    }

    const currentValue =
        elements.apartmentSelect.value;

    elements.apartmentSelect.innerHTML = `
        <option value="">
            ${escapeHtml(
                getTranslation(
                    "chooseApartmentOption"
                )
            )}
        </option>
    `;

    appState.apartments.forEach(
        (apartment) => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                apartment.key ||
                `${apartment.title}-${apartment.size}`;

            option.textContent =
                `${apartment.title} • ${apartment.size}`;

            elements.apartmentSelect.appendChild(
                option
            );
        }
    );

    const matchingOption =
        Array.from(
            elements.apartmentSelect.options
        ).find(
            (option) =>
                option.value === currentValue
        );

    if (matchingOption) {
        elements.apartmentSelect.value =
            currentValue;
    }
}


/* ==========================================================
   14. APARTMENT RENDERING
========================================================== */

function renderApartments() {
    if (!elements.apartmentGrid) {
        return;
    }

    const filtered =
        appState.activeFilter === "all"
            ? appState.apartments
            : appState.apartments.filter(
                (apartment) =>
                    getApartmentCategory(
                        apartment
                    ) ===
                    appState.activeFilter
            );

    appState.filteredApartments =
        filtered;

    if (!filtered.length) {
        elements.apartmentGrid.innerHTML = `
            <div class="loading-card">
                <p>
                    ${escapeHtml(
                        getTranslation(
                            "noApartments"
                        )
                    )}
                </p>
            </div>
        `;

        return;
    }

    elements.apartmentGrid.innerHTML =
        filtered
            .map(
                (apartment) =>
                    createApartmentCard(
                        apartment
                    )
            )
            .join("");

    attachApartmentCardEvents();

    animateApartmentCards();
}


function createApartmentCard(apartment) {
    const images =
        getApartmentImages(apartment);

    const mainImage =
        images[0] ||
        APP_CONFIG.fallbackBuildingImage;

    const price =
        apartment.price ||
        getTranslation(
            "contactForPrice"
        );

    const availability =
        apartment.availability ||
        getTranslation(
            "contactForAvailability"
        );

    return `
        <article
            class="apartment-card"
            data-apartment-key="${escapeHtml(
                apartment.key
            )}"
        >

            <div class="apartment-image-wrapper">

                <img
                    class="apartment-image"
                    src="${escapeHtml(mainImage)}"
                    alt="${escapeHtml(
                        apartment.title
                    )}"
                    loading="lazy"
                    data-fallback-image
                >

                <span class="apartment-size-badge">
                    ${escapeHtml(
                        apartment.size
                    )}
                </span>

                <span class="apartment-status-badge">
                    ${escapeHtml(
                        availability
                    )}
                </span>

            </div>

            <div class="apartment-card-body">

                <h3 class="apartment-card-title">
                    ${escapeHtml(
                        apartment.title
                    )}
                </h3>

                <p class="apartment-card-description">
                    ${escapeHtml(
                        apartment.description ||
                        `${apartment.title} • ${apartment.size}`
                    )}
                </p>

                <div class="apartment-price-row">

                    <span class="apartment-price">
                        ${escapeHtml(price)}
                    </span>

                </div>

                <div class="apartment-card-actions">

                    <button
                        type="button"
                        class="apartment-gallery-button"
                        data-gallery-key="${escapeHtml(
                            apartment.key
                        )}"
                    >
                        ${escapeHtml(
                            getTranslation(
                                "viewGallery"
                            )
                        )}
                    </button>

                    <button
                        type="button"
                        class="apartment-book-button"
                        data-book-key="${escapeHtml(
                            apartment.key
                        )}"
                    >
                        ${escapeHtml(
                            getTranslation(
                                "bookApartment"
                            )
                        )}
                    </button>

                </div>

            </div>

        </article>
    `;
}


function getApartmentImages(apartment) {
    const images =
        Array.isArray(apartment.images)
            ? apartment.images.filter(Boolean)
            : [];

    if (images.length) {
        return images;
    }

    return [
        APP_CONFIG.fallbackBuildingImage
    ];
}


function attachApartmentCardEvents() {
    document
        .querySelectorAll(
            "[data-gallery-key]"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    const apartment =
                        findApartmentByKey(
                            button.dataset.galleryKey
                        );

                    if (apartment) {
                        openGallery(apartment);
                    }
                }
            );
        });

    document
        .querySelectorAll(
            "[data-book-key]"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    chooseApartmentForBooking(
                        button.dataset.bookKey
                    );
                }
            );
        });

    document
        .querySelectorAll(
            "[data-fallback-image]"
        )
        .forEach((image) => {
            attachImageFallback(image);
        });
}


function animateApartmentCards() {
    document
        .querySelectorAll(
            ".apartment-card"
        )
        .forEach(
            (card, index) => {
                window.setTimeout(
                    () => {
                        card.classList.add(
                            "card-visible"
                        );
                    },
                    index * 90
                );
            }
        );
}


function attachImageFallback(image) {
    image.addEventListener(
        "error",
        () => {
            if (
                image.src.endsWith(
                    APP_CONFIG.fallbackBuildingImage
                )
            ) {
                return;
            }

            image.src =
                APP_CONFIG.fallbackBuildingImage;
        },
        {
            once: true
        }
    );
}


function showApartmentLoadError() {
    if (!elements.apartmentGrid) {
        return;
    }

    elements.apartmentGrid.innerHTML = `
        <div class="loading-card">
            <p>
                ${escapeHtml(
                    getTranslation(
                        "unableToLoad"
                    )
                )}
            </p>
        </div>
    `;
}


function findApartmentByKey(key) {
    return appState.apartments.find(
        (apartment) =>
            String(apartment.key) ===
            String(key)
    );
}


/* ==========================================================
   15. FILTER BUTTONS
========================================================== */

function initializeFilters() {
    document
        .querySelectorAll(
            ".filter-button"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    triggerSelectionFeedback();

                    appState.activeFilter =
                        button.dataset.filter ||
                        "all";

                    document
                        .querySelectorAll(
                            ".filter-button"
                        )
                        .forEach(
                            (filterButton) => {
                                filterButton.classList.remove(
                                    "active"
                                );
                            }
                        );

                    button.classList.add(
                        "active"
                    );

                    renderApartments();
                }
            );
        });
}


/* ==========================================================
   16. PHOTO GALLERY
========================================================== */

function openGallery(apartment) {
    if (!elements.galleryModal) {
        return;
    }

    triggerSelectionFeedback();

    appState.selectedApartment =
        apartment;

    appState.selectedApartmentImages =
        getApartmentImages(apartment);

    appState.currentGalleryImageIndex = 0;

    if (elements.galleryTitle) {
        elements.galleryTitle.textContent =
            apartment.title;
    }

    if (elements.galleryDetails) {
        const detailParts = [
            apartment.size,
            apartment.price ||
                getTranslation(
                    "contactForPrice"
                ),
            apartment.availability ||
                getTranslation(
                    "contactForAvailability"
                )
        ];

        elements.galleryDetails.textContent =
            detailParts
                .filter(Boolean)
                .join(" • ");
    }

    updateGalleryImage();

    elements.galleryModal.hidden = false;

    document.body.classList.add(
        "gallery-open"
    );

    window.requestAnimationFrame(
        () => {
            elements.galleryModal.classList.add(
                "gallery-visible"
            );
        }
    );
}


async function closeGallery() {
    if (!elements.galleryModal) {
        return;
    }

    elements.galleryModal.classList.remove(
        "gallery-visible"
    );

    await wait(
        APP_CONFIG.galleryAnimationDuration
    );

    elements.galleryModal.hidden = true;

    document.body.classList.remove(
        "gallery-open"
    );

    appState.selectedApartment = null;
    appState.selectedApartmentImages = [];
    appState.currentGalleryImageIndex = 0;
}


function updateGalleryImage() {
    const images =
        appState.selectedApartmentImages;

    if (
        !elements.galleryImage ||
        !images.length
    ) {
        return;
    }

    const image =
        images[
            appState.currentGalleryImageIndex
        ] ||
        APP_CONFIG.fallbackBuildingImage;

    elements.galleryImage.src = image;

    elements.galleryImage.alt =
        appState.selectedApartment
            ? `${appState.selectedApartment.title} photo`
            : "Apartment photo";

    attachImageFallback(
        elements.galleryImage
    );

    if (elements.currentImageNumber) {
        elements.currentImageNumber.textContent =
            String(
                appState.currentGalleryImageIndex +
                1
            );
    }

    if (elements.totalImageNumber) {
        elements.totalImageNumber.textContent =
            String(images.length);
    }
}


function showPreviousImage() {
    const totalImages =
        appState.selectedApartmentImages
            .length;

    if (!totalImages) {
        return;
    }

    triggerSelectionFeedback();

    appState.currentGalleryImageIndex =
        (
            appState.currentGalleryImageIndex -
            1 +
            totalImages
        ) %
        totalImages;

    updateGalleryImage();
}


function showNextImage() {
    const totalImages =
        appState.selectedApartmentImages
            .length;

    if (!totalImages) {
        return;
    }

    triggerSelectionFeedback();

    appState.currentGalleryImageIndex =
        (
            appState.currentGalleryImageIndex +
            1
        ) %
        totalImages;

    updateGalleryImage();
}


/* ==========================================================
   17. GALLERY SWIPE
========================================================== */

function initializeGallerySwipe() {
    const galleryImageContainer =
        document.querySelector(
            ".gallery-image-container"
        );

    if (!galleryImageContainer) {
        return;
    }

    galleryImageContainer.addEventListener(
        "touchstart",
        (event) => {
            appState.touchStartX =
                event.changedTouches[0]
                    .screenX;
        },
        {
            passive: true
        }
    );

    galleryImageContainer.addEventListener(
        "touchend",
        (event) => {
            appState.touchEndX =
                event.changedTouches[0]
                    .screenX;

            handleGallerySwipe();
        },
        {
            passive: true
        }
    );
}


function handleGallerySwipe() {
    const swipeDistance =
        appState.touchEndX -
        appState.touchStartX;

    const minimumSwipeDistance = 45;

    if (
        Math.abs(swipeDistance) <
        minimumSwipeDistance
    ) {
        return;
    }

    if (swipeDistance > 0) {
        showPreviousImage();
        return;
    }

    showNextImage();
}


/* ==========================================================
   18. CHOOSE ROOM FOR BOOKING
========================================================== */

function chooseApartmentForBooking(
    apartmentKey
) {
    const apartment =
        findApartmentByKey(
            apartmentKey
        );

    if (!apartment) {
        return;
    }

    appState.selectedApartment =
        apartment;

    if (elements.apartmentSelect) {
        elements.apartmentSelect.value =
            apartment.key;
    }

    closeGallery();

    document
        .getElementById("booking")
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    window.setTimeout(
        () => {
            elements.apartmentSelect
                ?.focus();
        },
        650
    );
}


/* ==========================================================
   19. DATE SETTINGS
========================================================== */

function initializeDateInputs() {
    const today =
        new Date();

    const todayString =
        formatDateForInput(today);

    if (elements.checkInDate) {
        elements.checkInDate.min =
            todayString;
    }

    if (elements.checkOutDate) {
        elements.checkOutDate.min =
            todayString;
    }

    elements.checkInDate?.addEventListener(
        "change",
        () => {
            if (
                elements.checkOutDate &&
                elements.checkInDate.value
            ) {
                elements.checkOutDate.min =
                    elements.checkInDate.value;

                if (
                    elements.checkOutDate.value &&
                    elements.checkOutDate.value <
                        elements.checkInDate.value
                ) {
                    elements.checkOutDate.value =
                        "";
                }
            }
        }
    );
}


function formatDateForInput(date) {
    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* ==========================================================
   20. BOOKING FORM VALIDATION
========================================================== */

function validateBookingForm(formData) {
    clearFormErrors();

    let isValid = true;

    const requiredFields = [
        "name",
        "phone",
        "apartment",
        "checkIn",
        "stay"
    ];

    requiredFields.forEach(
        (fieldName) => {
            const value =
                String(
                    formData.get(fieldName) ||
                    ""
                ).trim();

            if (!value) {
                setFieldError(
                    fieldName,
                    getTranslation(
                        "requiredField"
                    )
                );

                isValid = false;
            }
        }
    );

    const phone =
        String(
            formData.get("phone") ||
            ""
        ).trim();

    if (
        phone &&
        !/^[+\d][\d\s\-()]{6,20}$/.test(
            phone
        )
    ) {
        setFieldError(
            "phone",
            getTranslation(
                "invalidPhone"
            )
        );

        isValid = false;
    }

    const email =
        String(
            formData.get("email") ||
            ""
        ).trim();

    if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        )
    ) {
        setFieldError(
            "email",
            getTranslation(
                "invalidEmail"
            )
        );

        isValid = false;
    }

    const checkIn =
        String(
            formData.get("checkIn") ||
            ""
        );

    const checkOut =
        String(
            formData.get("checkOut") ||
            ""
        );

    if (
        checkIn &&
        checkOut &&
        checkOut < checkIn
    ) {
        setFieldError(
            "checkOut",
            getTranslation(
                "invalidDate"
            )
        );

        isValid = false;
    }

    return isValid;
}


function setFieldError(
    fieldName,
    message
) {
    const field =
        elements.bookingForm?.elements[
            fieldName
        ];

    if (!field) {
        return;
    }

    field.classList.add(
        "input-error"
    );

    const formGroup =
        field.closest(
            ".form-group"
        );

    const errorElement =
        formGroup?.querySelector(
            ".field-error"
        );

    if (errorElement) {
        errorElement.textContent =
            message;
    }
}


function clearFormErrors() {
    elements.bookingForm
        ?.querySelectorAll(
            ".input-error"
        )
        .forEach((field) => {
            field.classList.remove(
                "input-error"
            );
        });

    elements.bookingForm
        ?.querySelectorAll(
            ".field-error"
        )
        .forEach((errorElement) => {
            errorElement.textContent =
                "";
        });
}


/* ==========================================================
   21. BOOKING SUBMISSION
========================================================== */

async function submitBookingForm(event) {
    event.preventDefault();

    if (
        appState.formSubmitting ||
        !elements.bookingForm
    ) {
        return;
    }

    const formData =
        new FormData(
            elements.bookingForm
        );

    if (!validateBookingForm(formData)) {
        triggerErrorFeedback();

        showFormStatus(
            getTranslation(
                "requiredField"
            ),
            "error"
        );

        return;
    }

    appState.formSubmitting = true;

    setSubmitButtonState(true);

    showFormStatus(
        getTranslation("sending"),
        "loading"
    );

    const apartmentKey =
        String(
            formData.get("apartment") ||
            ""
        );

    const apartment =
        findApartmentByKey(
            apartmentKey
        );

    const telegramUser =
        telegramWebApp
            ?.initDataUnsafe
            ?.user;

    const inquiry = {
        name:
            String(
                formData.get("name") ||
                ""
            ).trim(),

        phone:
            String(
                formData.get("phone") ||
                ""
            ).trim(),

        telegram:
            String(
                formData.get("telegram") ||
                telegramUser?.username ||
                ""
            ).trim(),

        email:
            String(
                formData.get("email") ||
                ""
            ).trim(),

        apartment:
            apartment
                ? `${apartment.title} • ${apartment.size}`
                : apartmentKey,

        apartmentKey:
            apartment?.key ||
            apartmentKey,

        checkIn:
            String(
                formData.get("checkIn") ||
                ""
            ),

        checkOut:
            String(
                formData.get("checkOut") ||
                ""
            ),

        stay:
            String(
                formData.get("stay") ||
                ""
            ),

        budget:
            String(
                formData.get("budget") ||
                ""
            ).trim(),

        message:
            String(
                formData.get("message") ||
                ""
            ).trim(),

        telegramUserId:
            telegramUser?.id || null,

        telegramFirstName:
            telegramUser?.first_name || "",

        telegramLastName:
            telegramUser?.last_name || "",

        telegramLanguage:
            telegramUser?.language_code || "",

        source:
            "Maline Telegram Mini App V3",

        submittedAt:
            new Date().toISOString()
    };

    try {
        const response = await fetch(
            "/api/inquiry",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Accept:
                        "application/json"
                },

                body:
                    JSON.stringify(inquiry)
            }
        );

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                getTranslation(
                    "inquiryError"
                )
            );
        }

        triggerSuccessFeedback();

        const successMessage =
            result.inquiryId
                ? `${getTranslation(
                    "inquirySuccess"
                )} ID: ${result.inquiryId}`
                : getTranslation(
                    "inquirySuccess"
                );

        showFormStatus(
            successMessage,
            "success"
        );

        elements.bookingForm.reset();

        initializeDateInputs();

        if (
            telegramWebApp &&
            telegramWebApp.MainButton
        ) {
            try {
                telegramWebApp.MainButton
                    .setText("Inquiry Sent");

                telegramWebApp.MainButton
                    .show();

                window.setTimeout(
                    () => {
                        telegramWebApp.MainButton
                            .hide();
                    },
                    2200
                );
            } catch {
                // Optional Telegram button.
            }
        }
    } catch (error) {
        console.error(
            "Inquiry submission error:",
            error
        );

        triggerErrorFeedback();

        showFormStatus(
            error.message ||
            getTranslation(
                "inquiryError"
            ),
            "error"
        );
    } finally {
        appState.formSubmitting = false;

        setSubmitButtonState(false);
    }
}


function setSubmitButtonState(
    loading
) {
    if (!elements.submitInquiryButton) {
        return;
    }

    elements.submitInquiryButton.disabled =
        loading;

    elements.submitInquiryButton.textContent =
        loading
            ? getTranslation(
                "sending"
            )
            : getTranslation(
                "sendInquiry"
            );
}


function showFormStatus(
    message,
    type
) {
    if (!elements.formStatus) {
        return;
    }

    elements.formStatus.className =
        `form-status ${type || ""}`;

    elements.formStatus.textContent =
        message;
}


/* ==========================================================
   22. SCROLL BUTTONS
========================================================== */

function initializeScrollButtons() {
    document
        .querySelectorAll(
            ".scroll-button"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    const targetId =
                        button.dataset.scrollTarget;

                    const target =
                        document.getElementById(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    triggerSelectionFeedback();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            );
        });
}


/* ==========================================================
   23. CONTACT BUTTONS
========================================================== */

function initializeContactButtons() {
    elements.telegramContact
        ?.addEventListener(
            "click",
            () => {
                openTelegramUrl(
                    APP_CONFIG.defaultTelegram
                );
            }
        );

    elements.websiteContact
        ?.addEventListener(
            "click",
            () => {
                openExternalUrl(
                    APP_CONFIG.defaultWebsite
                );
            }
        );

    elements.locationContact
        ?.addEventListener(
            "click",
            () => {
                openExternalUrl(
                    APP_CONFIG.defaultGoogleMaps
                );
            }
        );

    elements.facebookButton
        ?.addEventListener(
            "click",
            () => {
                openExternalUrl(
                    APP_CONFIG.facebook
                );
            }
        );

    elements.instagramButton
        ?.addEventListener(
            "click",
            () => {
                openExternalUrl(
                    APP_CONFIG.instagram
                );
            }
        );

    elements.tiktokButton
        ?.addEventListener(
            "click",
            () => {
                openExternalUrl(
                    APP_CONFIG.tiktok
                );
            }
        );
}


/* ==========================================================
   24. QUERY STRING ROOM SELECTION
========================================================== */

function selectApartmentFromUrl() {
    const query =
        new URLSearchParams(
            window.location.search
        );

    const roomKey =
        query.get("room");

    if (!roomKey) {
        return;
    }

    const apartment =
        findApartmentByKey(roomKey);

    if (!apartment) {
        return;
    }

    if (elements.apartmentSelect) {
        elements.apartmentSelect.value =
            apartment.key;
    }

    appState.selectedApartment =
        apartment;

    const hash =
        window.location.hash;

    if (hash === "#booking") {
        window.setTimeout(
            () => {
                document
                    .getElementById(
                        "booking"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            },
            900
        );

        return;
    }

    window.setTimeout(
        () => {
            openGallery(apartment);
        },
        900
    );
}


/* ==========================================================
   25. KEYBOARD CONTROLS
========================================================== */

function initializeKeyboardControls() {
    document.addEventListener(
        "keydown",
        (event) => {
            if (
                !elements.galleryModal ||
                elements.galleryModal.hidden
            ) {
                return;
            }

            if (event.key === "Escape") {
                closeGallery();
            }

            if (event.key === "ArrowLeft") {
                showPreviousImage();
            }

            if (event.key === "ArrowRight") {
                showNextImage();
            }
        }
    );
}


/* ==========================================================
   26. GALLERY EVENTS
========================================================== */

function initializeGalleryEvents() {
    document
        .querySelectorAll(
            "[data-close-gallery]"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                closeGallery
            );
        });

    elements.previousImageButton
        ?.addEventListener(
            "click",
            showPreviousImage
        );

    elements.nextImageButton
        ?.addEventListener(
            "click",
            showNextImage
        );

    elements.selectApartmentButton
        ?.addEventListener(
            "click",
            () => {
                if (
                    appState.selectedApartment
                ) {
                    chooseApartmentForBooking(
                        appState
                            .selectedApartment
                            .key
                    );
                }
            }
        );
}


/* ==========================================================
   27. FOOTER YEAR
========================================================== */

function updateFooterYear() {
    if (elements.currentYear) {
        elements.currentYear.textContent =
            String(
                new Date().getFullYear()
            );
    }
}


/* ==========================================================
   28. LANGUAGE EVENT
========================================================== */

function initializeLanguageEvent() {
    elements.languageSelect
        ?.addEventListener(
            "change",
            (event) => {
                triggerSelectionFeedback();

                applyLanguage(
                    event.target.value
                );
            }
        );
}


/* ==========================================================
   29. FORM FIELD EVENTS
========================================================== */

function initializeFormFieldEvents() {
    elements.bookingForm
        ?.querySelectorAll(
            "input, select, textarea"
        )
        .forEach((field) => {
            field.addEventListener(
                "input",
                () => {
                    field.classList.remove(
                        "input-error"
                    );

                    const errorElement =
                        field
                            .closest(
                                ".form-group"
                            )
                            ?.querySelector(
                                ".field-error"
                            );

                    if (errorElement) {
                        errorElement.textContent =
                            "";
                    }
                }
            );
        });
}


/* ==========================================================
   30. APP INITIALIZATION
========================================================== */

async function initializeApplication() {
    updateFooterYear();

    initializeLanguage();

    initializeLanguageEvent();

    initializeScrollButtons();

    initializeFilters();

    initializeGalleryEvents();

    initializeGallerySwipe();

    initializeKeyboardControls();

    initializeDateInputs();

    initializeContactButtons();

    initializeFormFieldEvents();

    elements.bookingForm
        ?.addEventListener(
            "submit",
            submitBookingForm
        );

    runOpeningAnimation();

    await loadConfiguration();

    selectApartmentFromUrl();
}


/* ==========================================================
   31. START
========================================================== */

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