/* =========================================================
   MALINE SMART ASSISTANT V4
   MAIN SERVER: index.js
   Port: 8080 locally and Railway PORT in production
   ========================================================= */

"use strict";

const path = require("path");
const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const https = require("https");

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 8080;
const NODE_ENV = process.env.NODE_ENV || "development";

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const STAFF_GROUP_ID = process.env.STAFF_GROUP_ID || "";

const WEBSITE_URL =
  process.env.WEBSITE_URL ||
  "https://malineapartments.com.kh";

const FACEBOOK_URL =
  process.env.FACEBOOK_URL ||
  "https://www.facebook.com/";

const INSTAGRAM_URL =
  process.env.INSTAGRAM_URL ||
  "https://www.instagram.com/";

const TIKTOK_URL =
  process.env.TIKTOK_URL ||
  "https://www.tiktok.com/";

const TELEGRAM_URL =
  process.env.TELEGRAM_URL ||
  "https://t.me/";

const WHATSAPP_URL =
  process.env.WHATSAPP_URL ||
  "https://wa.me/";

const GOOGLE_MAPS_URL =
  process.env.GOOGLE_MAPS_URL ||
  "https://maps.google.com/";

const PHONE_NUMBER =
  process.env.PHONE_NUMBER ||
  "+85500000000";

const EMAIL_ADDRESS =
  process.env.EMAIL_ADDRESS ||
  "info@malineapartments.com.kh";

/* =========================================================
   EXPRESS SECURITY AND BODY SETTINGS
   ========================================================= */

app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

/* =========================================================
   APARTMENT INFORMATION
   Photo paths must match folders inside web/images/
   ========================================================= */

const apartments = [
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
    images: createImageList("studio"),
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
    images: createImageList("one-bedroom-84"),
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
    images: createImageList("one-bedroom-91"),
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
    images: createImageList("two-bedroom-130"),
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
    images: createImageList("two-bedroom-138"),
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
    images: createImageList("two-bedroom-148"),
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
    description:
      "A luxury two-bedroom apartment with a bathtub, fully equipped kitchen and spacious living area.",
    images: createImageList("two-bedroom-150"),
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
    images: createImageList("three-bedroom"),
  },

  {
    key: "penthouse-pha",
    category: "penthouse",
    title: "Penthouse A",
    shortTitle: "PHA",
    size: "551 sqm",
    bedrooms: "Luxury penthouse residence",
    bathrooms: "Multiple bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "Penthouse A is Maline Apartments' largest residence, offering 551 sqm of premium private living space.",
    images: createImageList("penthouse-pha"),
  },

  {
    key: "penthouse-phb",
    category: "penthouse",
    title: "Penthouse B",
    shortTitle: "PHB",
    size: "465 sqm",
    bedrooms: "Luxury penthouse residence",
    bathrooms: "Multiple bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "Penthouse B offers 465 sqm of spacious luxury living with generous private areas.",
    images: createImageList("penthouse-phb"),
  },

  {
    key: "penthouse-phc",
    category: "penthouse",
    title: "Penthouse C",
    shortTitle: "PHC",
    size: "435 sqm",
    bedrooms: "Luxury penthouse residence",
    bathrooms: "Multiple bathrooms",
    price: "Contact us for price",
    availability: "Contact reception",
    description:
      "Penthouse C provides 435 sqm of refined living space above central Phnom Penh.",
    images: createImageList("penthouse-phc"),
  },
];

/* =========================================================
   SERVICES
   ========================================================= */

const serviceIncluded = [
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

const serviceExcluded = [
  "Telephone IDD usage",
  "Electricity usage at $0.25 per kWh",
  "Rooftop sky bar charges",
];

/* =========================================================
   FACILITIES
   ========================================================= */

const facilities = [
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

/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function createImageList(folderName, total = 10) {
  return Array.from(
    {
      length: total,
    },
    (_, index) =>
      `/web/images/${folderName}/${index + 1}.jpg`
  );
}

function cleanText(value, maximumLength = 1000) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value)
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maximumLength);
}

function formatTelegramValue(value) {
  const cleanValue = cleanText(value);

  return cleanValue || "Not provided";
}

function getApartmentByKey(key) {
  return apartments.find(
    (apartment) => apartment.key === key
  );
}

function generateInquiryId() {
  const date = new Date();

  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = Math.floor(
    1000 + Math.random() * 9000
  );

  return `MA-${datePart}-${randomPart}`;
}

function isValidDate(value) {
  if (!value) {
    return true;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

function sendTelegramRequest(methodName, data) {
  return new Promise((resolve, reject) => {
    if (!BOT_TOKEN) {
      reject(
        new Error(
          "BOT_TOKEN is not configured."
        )
      );

      return;
    }

    const body = JSON.stringify(data);

    const options = {
      hostname: "api.telegram.org",
      port: 443,
      path: `/bot${BOT_TOKEN}/${methodName}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const request = https.request(
      options,
      (response) => {
        let responseData = "";

        response.on("data", (chunk) => {
          responseData += chunk;
        });

        response.on("end", () => {
          try {
            const parsedResponse =
              JSON.parse(responseData);

            if (
              response.statusCode >= 200 &&
              response.statusCode < 300 &&
              parsedResponse.ok
            ) {
              resolve(parsedResponse.result);
            } else {
              reject(
                new Error(
                  parsedResponse.description ||
                    `Telegram request failed with status ${response.statusCode}`
                )
              );
            }
          } catch (error) {
            reject(
              new Error(
                "Unable to read Telegram response."
              )
            );
          }
        });
      }
    );

    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

async function notifyStaff(inquiry) {
  if (!BOT_TOKEN || !STAFF_GROUP_ID) {
    console.warn(
      "Telegram notification skipped because BOT_TOKEN or STAFF_GROUP_ID is missing."
    );

    return {
      sent: false,
      reason:
        "Telegram environment variables are missing.",
    };
  }

  const apartment =
    getApartmentByKey(inquiry.apartmentKey);

  const apartmentName =
    apartment?.title ||
    inquiry.apartmentTitle ||
    inquiry.apartment ||
    "Not selected";

  const apartmentSize =
    apartment?.size ||
    inquiry.apartmentSize ||
    "";

  const text = [
    "🏢 NEW MALINE APARTMENTS INQUIRY",
    "",
    `🆔 Inquiry ID: ${inquiry.inquiryId}`,
    `👤 Name: ${formatTelegramValue(inquiry.fullName)}`,
    `📞 Phone: ${formatTelegramValue(inquiry.phone)}`,
    `✉️ Email: ${formatTelegramValue(inquiry.email)}`,
    "",
    `🏠 Apartment: ${formatTelegramValue(apartmentName)}`,
    `📐 Size: ${formatTelegramValue(apartmentSize)}`,
    `📅 Check-in: ${formatTelegramValue(inquiry.checkIn)}`,
    `📅 Check-out: ${formatTelegramValue(inquiry.checkOut)}`,
    `⏳ Length of stay: ${formatTelegramValue(inquiry.stay)}`,
    `💵 Monthly budget: ${formatTelegramValue(inquiry.budget)}`,
    "",
    `📝 Special request:`,
    formatTelegramValue(inquiry.request),
    "",
    `🌐 Language: ${formatTelegramValue(inquiry.language)}`,
    `📲 Source: ${formatTelegramValue(inquiry.source)}`,
    "",
    `Telegram user ID: ${formatTelegramValue(
      inquiry.telegramUserId
    )}`,
    `Telegram username: ${formatTelegramValue(
      inquiry.telegramUsername
    )}`,
    "",
    `Submitted: ${inquiry.submittedAt}`,
  ].join("\n");

  await sendTelegramRequest("sendMessage", {
    chat_id: STAFF_GROUP_ID,
    text,
    disable_web_page_preview: true,
  });

  return {
    sent: true,
  };
}

/* =========================================================
   API ROUTES
   ========================================================= */

app.get("/api/health", (request, response) => {
  response.status(200).json({
    ok: true,
    app: "Maline Smart Assistant V4",
    environment: NODE_ENV,
    port: PORT,
    time: new Date().toISOString(),
  });
});

app.get("/api/config", (request, response) => {
  response.status(200).json({
    success: true,

    property: {
      name: "Maline Exclusive Serviced Apartments",
      website: WEBSITE_URL,
      phone: PHONE_NUMBER,
      email: EMAIL_ADDRESS,
      address: "Phnom Penh, Cambodia",
    },

    socialLinks: {
      website: WEBSITE_URL,
      facebook: FACEBOOK_URL,
      instagram: INSTAGRAM_URL,
      tiktok: TIKTOK_URL,
      telegram: TELEGRAM_URL,
      whatsapp: WHATSAPP_URL,
      googleMaps: GOOGLE_MAPS_URL,
      phone: `tel:${PHONE_NUMBER}`,
      email: `mailto:${EMAIL_ADDRESS}`,
    },

    apartments,
    facilities,
    serviceIncluded,
    serviceExcluded,
  });
});

app.get(
  "/api/apartments",
  (request, response) => {
    const category = cleanText(
      request.query.category,
      50
    ).toLowerCase();

    if (!category || category === "all") {
      response.status(200).json({
        success: true,
        count: apartments.length,
        apartments,
      });

      return;
    }

    const filteredApartments =
      apartments.filter(
        (apartment) =>
          apartment.category === category
      );

    response.status(200).json({
      success: true,
      category,
      count: filteredApartments.length,
      apartments: filteredApartments,
    });
  }
);

app.get(
  "/api/apartments/:key",
  (request, response) => {
    const apartmentKey = cleanText(
      request.params.key,
      100
    );

    const apartment =
      getApartmentByKey(apartmentKey);

    if (!apartment) {
      response.status(404).json({
        success: false,
        message: "Apartment was not found.",
      });

      return;
    }

    response.status(200).json({
      success: true,
      apartment,
    });
  }
);

app.post(
  "/api/inquiry",
  async (request, response) => {
    try {
      const fullName = cleanText(
        request.body.fullName ||
          request.body.name,
        100
      );

      const phone = cleanText(
        request.body.phone,
        50
      );

      const email = cleanText(
        request.body.email,
        150
      );

      const apartmentKey = cleanText(
        request.body.apartmentKey ||
          request.body.apartment ||
          request.body.room ||
          request.body.roomType,
        100
      );

      const checkIn = cleanText(
        request.body.checkIn,
        30
      );

      const checkOut = cleanText(
        request.body.checkOut,
        30
      );

      const stay = cleanText(
        request.body.stay,
        100
      );

      const budget = cleanText(
        request.body.budget,
        100
      );

      const specialRequest = cleanText(
        request.body.request ||
          request.body.specialRequest ||
          request.body.message,
        1500
      );

      if (!fullName) {
        response.status(400).json({
          success: false,
          message:
            "Please enter your full name.",
        });

        return;
      }

      if (!phone) {
        response.status(400).json({
          success: false,
          message:
            "Please enter your phone number.",
        });

        return;
      }

      if (!apartmentKey) {
        response.status(400).json({
          success: false,
          message:
            "Please choose an apartment.",
        });

        return;
      }

      if (!checkIn) {
        response.status(400).json({
          success: false,
          message:
            "Please choose a check-in date.",
        });

        return;
      }

      if (
        !isValidDate(checkIn) ||
        !isValidDate(checkOut)
      ) {
        response.status(400).json({
          success: false,
          message:
            "Please enter valid dates.",
        });

        return;
      }

      if (
        checkIn &&
        checkOut &&
        new Date(checkOut) <
          new Date(checkIn)
      ) {
        response.status(400).json({
          success: false,
          message:
            "Check-out date cannot be before check-in date.",
        });

        return;
      }

      const selectedApartment =
        getApartmentByKey(apartmentKey);

      const inquiry = {
        inquiryId: generateInquiryId(),

        fullName,
        phone,
        email,

        apartmentKey,
        apartmentTitle:
          selectedApartment?.title ||
          cleanText(
            request.body.apartmentTitle,
            150
          ),

        apartmentSize:
          selectedApartment?.size ||
          cleanText(
            request.body.apartmentSize,
            50
          ),

        checkIn,
        checkOut,
        stay,
        budget,
        request: specialRequest,

        language: cleanText(
          request.body.language,
          20
        ),

        source: cleanText(
          request.body.source,
          100
        ),

        telegramUserId: cleanText(
          request.body.telegramUserId,
          100
        ),

        telegramUsername: cleanText(
          request.body.telegramUsername,
          100
        ),

        telegramFirstName: cleanText(
          request.body.telegramFirstName,
          100
        ),

        telegramLastName: cleanText(
          request.body.telegramLastName,
          100
        ),

        submittedAt:
          new Date().toISOString(),
      };

      let notificationSent = false;
      let notificationError = "";

      try {
        const notificationResult =
          await notifyStaff(inquiry);

        notificationSent =
          notificationResult.sent;
      } catch (error) {
        notificationError =
          error.message;

        console.error(
          "Telegram staff notification error:",
          error
        );
      }

      response.status(201).json({
        success: true,
        message:
          "Your inquiry was sent successfully.",
        inquiryId: inquiry.inquiryId,
        notificationSent,
        notificationError:
          NODE_ENV === "development"
            ? notificationError
            : undefined,
      });
    } catch (error) {
      console.error(
        "Inquiry API error:",
        error
      );

      response.status(500).json({
        success: false,
        message:
          "The server could not process your inquiry. Please try again.",
      });
    }
  }
);

app.post(
  "/api/open",
  (request, response) => {
    const openData = {
      telegramUserId: cleanText(
        request.body.telegramUserId,
        100
      ),

      username: cleanText(
        request.body.username,
        100
      ),

      language: cleanText(
        request.body.language,
        20
      ),

      source: cleanText(
        request.body.source,
        100
      ),

      openedAt:
        cleanText(
          request.body.openedAt,
          100
        ) ||
        new Date().toISOString(),
    };

    console.log(
      "Mini App opened:",
      openData
    );

    response.status(200).json({
      success: true,
    });
  }
);

/* =========================================================
   STATIC WEBSITE
   ========================================================= */

const webFolder = path.join(
  __dirname,
  "web"
);

app.use(
  "/web",
  express.static(webFolder, {
    maxAge:
      NODE_ENV === "production"
        ? "1d"
        : 0,

    etag: true,
    index: false,
  })
);

app.get("/", (request, response) => {
  response.sendFile(
    path.join(
      webFolder,
      "index.html"
    )
  );
});

/* =========================================================
   FALLBACK ROUTES
   ========================================================= */

app.use(
  "/api",
  (request, response) => {
    response.status(404).json({
      success: false,
      message:
        "The requested API endpoint was not found.",
    });
  }
);

app.use(
  (request, response) => {
    response.status(404).sendFile(
      path.join(
        webFolder,
        "index.html"
      )
    );
  }
);

/* =========================================================
   ERROR HANDLER
   ========================================================= */

app.use(
  (
    error,
    request,
    response,
    next
  ) => {
    console.error(
      "Unexpected server error:",
      error
    );

    if (
      response.headersSent
    ) {
      next(error);
      return;
    }

    response.status(500).json({
      success: false,
      message:
        "An unexpected server error occurred.",
    });
  }
);

/* =========================================================
   START SERVER
   ========================================================= */

const server = app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      "======================================"
    );

    console.log(
      "Maline Smart Assistant V4 is running"
    );

    console.log(
      `Local URL: http://localhost:${PORT}`
    );

    console.log(
      `Environment: ${NODE_ENV}`
    );

    console.log(
      `Apartments loaded: ${apartments.length}`
    );

    console.log(
      "======================================"
    );
  }
);

/* =========================================================
   SAFE SHUTDOWN
   ========================================================= */

function shutdown(signal) {
  console.log(
    `${signal} received. Closing server...`
  );

  server.close(() => {
    console.log(
      "Server closed successfully."
    );

    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Forced shutdown after timeout."
    );

    process.exit(1);
  }, 10000).unref();
}

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);