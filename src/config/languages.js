"use strict";

const LANGUAGES = [
  {
    "code": "af",
    "flag": "🇿🇦",
    "name": "Afrikaans",
    "native": "Afrikaans"
  },
  {
    "code": "sq",
    "flag": "🇦🇱",
    "name": "Albanian",
    "native": "Shqip"
  },
  {
    "code": "am",
    "flag": "🇪🇹",
    "name": "Amharic",
    "native": "አማርኛ"
  },
  {
    "code": "ar",
    "flag": "🇸🇦",
    "name": "Arabic",
    "native": "العربية"
  },
  {
    "code": "hy",
    "flag": "🇦🇲",
    "name": "Armenian",
    "native": "Հայերեն"
  },
  {
    "code": "as",
    "flag": "🇮🇳",
    "name": "Assamese",
    "native": "অসমীয়া"
  },
  {
    "code": "ay",
    "flag": "🇧🇴",
    "name": "Aymara",
    "native": "Aymar aru"
  },
  {
    "code": "az",
    "flag": "🇦🇿",
    "name": "Azerbaijani",
    "native": "Azərbaycan"
  },
  {
    "code": "bm",
    "flag": "🇲🇱",
    "name": "Bambara",
    "native": "Bamanankan"
  },
  {
    "code": "eu",
    "flag": "🇪🇸",
    "name": "Basque",
    "native": "Euskara"
  },
  {
    "code": "be",
    "flag": "🇧🇾",
    "name": "Belarusian",
    "native": "Беларуская"
  },
  {
    "code": "bn",
    "flag": "🇧🇩",
    "name": "Bengali",
    "native": "বাংলা"
  },
  {
    "code": "bho",
    "flag": "🇮🇳",
    "name": "Bhojpuri",
    "native": "भोजपुरी"
  },
  {
    "code": "bs",
    "flag": "🇧🇦",
    "name": "Bosnian",
    "native": "Bosanski"
  },
  {
    "code": "bg",
    "flag": "🇧🇬",
    "name": "Bulgarian",
    "native": "Български"
  },
  {
    "code": "ca",
    "flag": "🇪🇸",
    "name": "Catalan",
    "native": "Català"
  },
  {
    "code": "ceb",
    "flag": "🇵🇭",
    "name": "Cebuano",
    "native": "Cebuano"
  },
  {
    "code": "ny",
    "flag": "🇲🇼",
    "name": "Chichewa",
    "native": "Chichewa"
  },
  {
    "code": "zh-CN",
    "flag": "🇨🇳",
    "name": "Chinese Simplified",
    "native": "简体中文"
  },
  {
    "code": "zh-TW",
    "flag": "🇹🇼",
    "name": "Chinese Traditional",
    "native": "繁體中文"
  },
  {
    "code": "co",
    "flag": "🇫🇷",
    "name": "Corsican",
    "native": "Corsu"
  },
  {
    "code": "hr",
    "flag": "🇭🇷",
    "name": "Croatian",
    "native": "Hrvatski"
  },
  {
    "code": "cs",
    "flag": "🇨🇿",
    "name": "Czech",
    "native": "Čeština"
  },
  {
    "code": "da",
    "flag": "🇩🇰",
    "name": "Danish",
    "native": "Dansk"
  },
  {
    "code": "dv",
    "flag": "🇲🇻",
    "name": "Dhivehi",
    "native": "ދިވެހި"
  },
  {
    "code": "doi",
    "flag": "🇮🇳",
    "name": "Dogri",
    "native": "डोगरी"
  },
  {
    "code": "nl",
    "flag": "🇳🇱",
    "name": "Dutch",
    "native": "Nederlands"
  },
  {
    "code": "en",
    "flag": "🇬🇧",
    "name": "English",
    "native": "English"
  },
  {
    "code": "eo",
    "flag": "🌍",
    "name": "Esperanto",
    "native": "Esperanto"
  },
  {
    "code": "et",
    "flag": "🇪🇪",
    "name": "Estonian",
    "native": "Eesti"
  },
  {
    "code": "ee",
    "flag": "🇬🇭",
    "name": "Ewe",
    "native": "Eʋegbe"
  },
  {
    "code": "fil",
    "flag": "🇵🇭",
    "name": "Filipino",
    "native": "Filipino"
  },
  {
    "code": "fi",
    "flag": "🇫🇮",
    "name": "Finnish",
    "native": "Suomi"
  },
  {
    "code": "fr",
    "flag": "🇫🇷",
    "name": "French",
    "native": "Français"
  },
  {
    "code": "fy",
    "flag": "🇳🇱",
    "name": "Frisian",
    "native": "Frysk"
  },
  {
    "code": "gl",
    "flag": "🇪🇸",
    "name": "Galician",
    "native": "Galego"
  },
  {
    "code": "ka",
    "flag": "🇬🇪",
    "name": "Georgian",
    "native": "ქართული"
  },
  {
    "code": "de",
    "flag": "🇩🇪",
    "name": "German",
    "native": "Deutsch"
  },
  {
    "code": "el",
    "flag": "🇬🇷",
    "name": "Greek",
    "native": "Ελληνικά"
  },
  {
    "code": "gn",
    "flag": "🇵🇾",
    "name": "Guarani",
    "native": "Avañe'ẽ"
  },
  {
    "code": "gu",
    "flag": "🇮🇳",
    "name": "Gujarati",
    "native": "ગુજરાતી"
  },
  {
    "code": "ht",
    "flag": "🇭🇹",
    "name": "Haitian Creole",
    "native": "Kreyòl ayisyen"
  },
  {
    "code": "ha",
    "flag": "🇳🇬",
    "name": "Hausa",
    "native": "Hausa"
  },
  {
    "code": "haw",
    "flag": "🇺🇸",
    "name": "Hawaiian",
    "native": "ʻŌlelo Hawaiʻi"
  },
  {
    "code": "he",
    "flag": "🇮🇱",
    "name": "Hebrew",
    "native": "עברית"
  },
  {
    "code": "hi",
    "flag": "🇮🇳",
    "name": "Hindi",
    "native": "हिन्दी"
  },
  {
    "code": "hmn",
    "flag": "🌏",
    "name": "Hmong",
    "native": "Hmoob"
  },
  {
    "code": "hu",
    "flag": "🇭🇺",
    "name": "Hungarian",
    "native": "Magyar"
  },
  {
    "code": "is",
    "flag": "🇮🇸",
    "name": "Icelandic",
    "native": "Íslenska"
  },
  {
    "code": "ig",
    "flag": "🇳🇬",
    "name": "Igbo",
    "native": "Igbo"
  },
  {
    "code": "ilo",
    "flag": "🇵🇭",
    "name": "Ilocano",
    "native": "Ilocano"
  },
  {
    "code": "id",
    "flag": "🇮🇩",
    "name": "Indonesian",
    "native": "Bahasa Indonesia"
  },
  {
    "code": "ga",
    "flag": "🇮🇪",
    "name": "Irish",
    "native": "Gaeilge"
  },
  {
    "code": "it",
    "flag": "🇮🇹",
    "name": "Italian",
    "native": "Italiano"
  },
  {
    "code": "ja",
    "flag": "🇯🇵",
    "name": "Japanese",
    "native": "日本語"
  },
  {
    "code": "jv",
    "flag": "🇮🇩",
    "name": "Javanese",
    "native": "Basa Jawa"
  },
  {
    "code": "kn",
    "flag": "🇮🇳",
    "name": "Kannada",
    "native": "ಕನ್ನಡ"
  },
  {
    "code": "kk",
    "flag": "🇰🇿",
    "name": "Kazakh",
    "native": "Қазақша"
  },
  {
    "code": "km",
    "flag": "🇰🇭",
    "name": "Khmer",
    "native": "ភាសាខ្មែរ"
  },
  {
    "code": "rw",
    "flag": "🇷🇼",
    "name": "Kinyarwanda",
    "native": "Ikinyarwanda"
  },
  {
    "code": "gom",
    "flag": "🇮🇳",
    "name": "Konkani",
    "native": "कोंकणी"
  },
  {
    "code": "ko",
    "flag": "🇰🇷",
    "name": "Korean",
    "native": "한국어"
  },
  {
    "code": "kri",
    "flag": "🇸🇱",
    "name": "Krio",
    "native": "Krio"
  },
  {
    "code": "ku",
    "flag": "🌍",
    "name": "Kurdish",
    "native": "Kurdî"
  },
  {
    "code": "ckb",
    "flag": "🌍",
    "name": "Kurdish Sorani",
    "native": "کوردی"
  },
  {
    "code": "ky",
    "flag": "🇰🇬",
    "name": "Kyrgyz",
    "native": "Кыргызча"
  },
  {
    "code": "lo",
    "flag": "🇱🇦",
    "name": "Lao",
    "native": "ລາວ"
  },
  {
    "code": "la",
    "flag": "🏛️",
    "name": "Latin",
    "native": "Latina"
  },
  {
    "code": "lv",
    "flag": "🇱🇻",
    "name": "Latvian",
    "native": "Latviešu"
  },
  {
    "code": "ln",
    "flag": "🇨🇩",
    "name": "Lingala",
    "native": "Lingála"
  },
  {
    "code": "lt",
    "flag": "🇱🇹",
    "name": "Lithuanian",
    "native": "Lietuvių"
  },
  {
    "code": "lg",
    "flag": "🇺🇬",
    "name": "Luganda",
    "native": "Luganda"
  },
  {
    "code": "lb",
    "flag": "🇱🇺",
    "name": "Luxembourgish",
    "native": "Lëtzebuergesch"
  },
  {
    "code": "mk",
    "flag": "🇲🇰",
    "name": "Macedonian",
    "native": "Македонски"
  },
  {
    "code": "mai",
    "flag": "🇮🇳",
    "name": "Maithili",
    "native": "मैथिली"
  },
  {
    "code": "mg",
    "flag": "🇲🇬",
    "name": "Malagasy",
    "native": "Malagasy"
  },
  {
    "code": "ms",
    "flag": "🇲🇾",
    "name": "Malay",
    "native": "Bahasa Melayu"
  },
  {
    "code": "ml",
    "flag": "🇮🇳",
    "name": "Malayalam",
    "native": "മലയാളം"
  },
  {
    "code": "mt",
    "flag": "🇲🇹",
    "name": "Maltese",
    "native": "Malti"
  },
  {
    "code": "mi",
    "flag": "🇳🇿",
    "name": "Maori",
    "native": "Māori"
  },
  {
    "code": "mr",
    "flag": "🇮🇳",
    "name": "Marathi",
    "native": "मराठी"
  },
  {
    "code": "mni",
    "flag": "🇮🇳",
    "name": "Meiteilon",
    "native": "ꯃꯤꯇꯩꯂꯣꯟ"
  },
  {
    "code": "lus",
    "flag": "🇮🇳",
    "name": "Mizo",
    "native": "Mizo ṭawng"
  },
  {
    "code": "mn",
    "flag": "🇲🇳",
    "name": "Mongolian",
    "native": "Монгол"
  },
  {
    "code": "my",
    "flag": "🇲🇲",
    "name": "Myanmar",
    "native": "မြန်မာ"
  },
  {
    "code": "ne",
    "flag": "🇳🇵",
    "name": "Nepali",
    "native": "नेपाली"
  },
  {
    "code": "no",
    "flag": "🇳🇴",
    "name": "Norwegian",
    "native": "Norsk"
  },
  {
    "code": "or",
    "flag": "🇮🇳",
    "name": "Odia",
    "native": "ଓଡ଼ିଆ"
  },
  {
    "code": "om",
    "flag": "🇪🇹",
    "name": "Oromo",
    "native": "Afaan Oromoo"
  },
  {
    "code": "ps",
    "flag": "🇦🇫",
    "name": "Pashto",
    "native": "پښتو"
  },
  {
    "code": "fa",
    "flag": "🇮🇷",
    "name": "Persian",
    "native": "فارسی"
  },
  {
    "code": "pl",
    "flag": "🇵🇱",
    "name": "Polish",
    "native": "Polski"
  },
  {
    "code": "pt",
    "flag": "🇵🇹",
    "name": "Portuguese",
    "native": "Português"
  },
  {
    "code": "pa",
    "flag": "🇮🇳",
    "name": "Punjabi",
    "native": "ਪੰਜਾਬੀ"
  },
  {
    "code": "qu",
    "flag": "🇵🇪",
    "name": "Quechua",
    "native": "Runasimi"
  },
  {
    "code": "ro",
    "flag": "🇷🇴",
    "name": "Romanian",
    "native": "Română"
  },
  {
    "code": "ru",
    "flag": "🇷🇺",
    "name": "Russian",
    "native": "Русский"
  },
  {
    "code": "sm",
    "flag": "🇼🇸",
    "name": "Samoan",
    "native": "Gagana Samoa"
  },
  {
    "code": "sa",
    "flag": "🇮🇳",
    "name": "Sanskrit",
    "native": "संस्कृतम्"
  },
  {
    "code": "gd",
    "flag": "🏴",
    "name": "Scots Gaelic",
    "native": "Gàidhlig"
  },
  {
    "code": "nso",
    "flag": "🇿🇦",
    "name": "Sepedi",
    "native": "Sepedi"
  },
  {
    "code": "sr",
    "flag": "🇷🇸",
    "name": "Serbian",
    "native": "Српски"
  },
  {
    "code": "st",
    "flag": "🇱🇸",
    "name": "Sesotho",
    "native": "Sesotho"
  },
  {
    "code": "sn",
    "flag": "🇿🇼",
    "name": "Shona",
    "native": "ChiShona"
  },
  {
    "code": "sd",
    "flag": "🇵🇰",
    "name": "Sindhi",
    "native": "سنڌي"
  },
  {
    "code": "si",
    "flag": "🇱🇰",
    "name": "Sinhala",
    "native": "සිංහල"
  },
  {
    "code": "sk",
    "flag": "🇸🇰",
    "name": "Slovak",
    "native": "Slovenčina"
  },
  {
    "code": "sl",
    "flag": "🇸🇮",
    "name": "Slovenian",
    "native": "Slovenščina"
  },
  {
    "code": "so",
    "flag": "🇸🇴",
    "name": "Somali",
    "native": "Soomaali"
  },
  {
    "code": "es",
    "flag": "🇪🇸",
    "name": "Spanish",
    "native": "Español"
  },
  {
    "code": "su",
    "flag": "🇮🇩",
    "name": "Sundanese",
    "native": "Basa Sunda"
  },
  {
    "code": "sw",
    "flag": "🇰🇪",
    "name": "Swahili",
    "native": "Kiswahili"
  },
  {
    "code": "sv",
    "flag": "🇸🇪",
    "name": "Swedish",
    "native": "Svenska"
  },
  {
    "code": "tg",
    "flag": "🇹🇯",
    "name": "Tajik",
    "native": "Тоҷикӣ"
  },
  {
    "code": "ta",
    "flag": "🇮🇳",
    "name": "Tamil",
    "native": "தமிழ்"
  },
  {
    "code": "tt",
    "flag": "🌍",
    "name": "Tatar",
    "native": "Татарча"
  },
  {
    "code": "te",
    "flag": "🇮🇳",
    "name": "Telugu",
    "native": "తెలుగు"
  },
  {
    "code": "th",
    "flag": "🇹🇭",
    "name": "Thai",
    "native": "ไทย"
  },
  {
    "code": "ti",
    "flag": "🇪🇷",
    "name": "Tigrinya",
    "native": "ትግርኛ"
  },
  {
    "code": "ts",
    "flag": "🇿🇦",
    "name": "Tsonga",
    "native": "itsonga"
  },
  {
    "code": "tr",
    "flag": "🇹🇷",
    "name": "Turkish",
    "native": "Türkçe"
  },
  {
    "code": "tk",
    "flag": "🇹🇲",
    "name": "Turkmen",
    "native": "Türkmençe"
  },
  {
    "code": "ak",
    "flag": "🇬🇭",
    "name": "Twi",
    "native": "Twi"
  },
  {
    "code": "uk",
    "flag": "🇺🇦",
    "name": "Ukrainian",
    "native": "Українська"
  },
  {
    "code": "ur",
    "flag": "🇵🇰",
    "name": "Urdu",
    "native": "اردو"
  },
  {
    "code": "ug",
    "flag": "🌏",
    "name": "Uyghur",
    "native": "ئۇيغۇرچە"
  },
  {
    "code": "uz",
    "flag": "🇺🇿",
    "name": "Uzbek",
    "native": "Oʻzbekcha"
  },
  {
    "code": "vi",
    "flag": "🇻🇳",
    "name": "Vietnamese",
    "native": "Tiếng Việt"
  },
  {
    "code": "cy",
    "flag": "🏴",
    "name": "Welsh",
    "native": "Cymraeg"
  },
  {
    "code": "xh",
    "flag": "🇿🇦",
    "name": "Xhosa",
    "native": "isiXhosa"
  },
  {
    "code": "yi",
    "flag": "🌍",
    "name": "Yiddish",
    "native": "ייִדיש"
  },
  {
    "code": "yo",
    "flag": "🇳🇬",
    "name": "Yoruba",
    "native": "Yorùbá"
  },
  {
    "code": "zu",
    "flag": "🇿🇦",
    "name": "Zulu",
    "native": "isiZulu"
  },
  {
    "code": "ace",
    "flag": "🇮🇩",
    "name": "Acehnese",
    "native": "Bahsa Acèh"
  },
  {
    "code": "ach",
    "flag": "🇺🇬",
    "name": "Acholi",
    "native": "Lwo"
  },
  {
    "code": "awa",
    "flag": "🇮🇳",
    "name": "Awadhi",
    "native": "अवधी"
  },
  {
    "code": "bal",
    "flag": "🇵🇰",
    "name": "Balochi",
    "native": "بلوچی"
  },
  {
    "code": "ban",
    "flag": "🇮🇩",
    "name": "Balinese",
    "native": "Basa Bali"
  },
  {
    "code": "ba",
    "flag": "🇷🇺",
    "name": "Bashkir",
    "native": "Башҡортса"
  },
  {
    "code": "ber",
    "flag": "🌍",
    "name": "Berber",
    "native": "Tamaziɣt"
  },
  {
    "code": "br",
    "flag": "🇫🇷",
    "name": "Breton",
    "native": "Brezhoneg"
  },
  {
    "code": "bua",
    "flag": "🇷🇺",
    "name": "Buryat",
    "native": "Буряад"
  },
  {
    "code": "ch",
    "flag": "🇬🇺",
    "name": "Chamorro",
    "native": "Chamoru"
  },
  {
    "code": "chr",
    "flag": "🇺🇸",
    "name": "Cherokee",
    "native": "ᏣᎳᎩ"
  },
  {
    "code": "cv",
    "flag": "🇷🇺",
    "name": "Chuvash",
    "native": "Чӑвашла"
  },
  {
    "code": "din",
    "flag": "🇸🇸",
    "name": "Dinka",
    "native": "Thuɔŋjäŋ"
  },
  {
    "code": "dz",
    "flag": "🇧🇹",
    "name": "Dzongkha",
    "native": "རྫོང་ཁ"
  },
  {
    "code": "fo",
    "flag": "🇫🇴",
    "name": "Faroese",
    "native": "Føroyskt"
  },
  {
    "code": "fj",
    "flag": "🇫🇯",
    "name": "Fijian",
    "native": "Vosa Vakaviti"
  },
  {
    "code": "fur",
    "flag": "🇮🇹",
    "name": "Friulian",
    "native": "Furlan"
  },
  {
    "code": "gaa",
    "flag": "🇬🇭",
    "name": "Ga",
    "native": "Gã"
  },
  {
    "code": "grc",
    "flag": "🏛️",
    "name": "Ancient Greek",
    "native": "Ἑλληνική"
  },
  {
    "code": "kl",
    "flag": "🇬🇱",
    "name": "Greenlandic",
    "native": "Kalaallisut"
  },
  {
    "code": "hil",
    "flag": "🇵🇭",
    "name": "Hiligaynon",
    "native": "Ilonggo"
  },
  {
    "code": "iba",
    "flag": "🇲🇾",
    "name": "Iban",
    "native": "Jaku Iban"
  },
  {
    "code": "io",
    "flag": "🌍",
    "name": "Ido",
    "native": "Ido"
  },
  {
    "code": "iu",
    "flag": "🇨🇦",
    "name": "Inuktitut",
    "native": "ᐃᓄᒃᑎᑐᑦ"
  },
  {
    "code": "kab",
    "flag": "🇩🇿",
    "name": "Kabyle",
    "native": "Taqbaylit"
  },
  {
    "code": "kea",
    "flag": "🇨🇻",
    "name": "Kabuverdianu",
    "native": "Kabuverdianu"
  },
  {
    "code": "kg",
    "flag": "🇨🇩",
    "name": "Kongo",
    "native": "Kikongo"
  },
  {
    "code": "kok",
    "flag": "🇮🇳",
    "name": "Konkani Devanagari",
    "native": "कोंकणी"
  },
  {
    "code": "kr",
    "flag": "🇳🇬",
    "name": "Kanuri",
    "native": "Kanuri"
  },
  {
    "code": "ks",
    "flag": "🇮🇳",
    "name": "Kashmiri",
    "native": "کٲشُر"
  },
  {
    "code": "lez",
    "flag": "🇷🇺",
    "name": "Lezgian",
    "native": "Лезги"
  },
  {
    "code": "li",
    "flag": "🇳🇱",
    "name": "Limburgish",
    "native": "Limburgs"
  },
  {
    "code": "loz",
    "flag": "🇿🇲",
    "name": "Lozi",
    "native": "Silozi"
  },
  {
    "code": "lua",
    "flag": "🇨🇩",
    "name": "Luba-Kasai",
    "native": "Tshiluba"
  },
  {
    "code": "mad",
    "flag": "🇮🇩",
    "name": "Madurese",
    "native": "Madhurâ"
  },
  {
    "code": "mh",
    "flag": "🇲🇭",
    "name": "Marshallese",
    "native": "Kajin M̧ajeļ"
  },
  {
    "code": "mos",
    "flag": "🇧🇫",
    "name": "Mossi",
    "native": "Mooré"
  },
  {
    "code": "na",
    "flag": "🇳🇷",
    "name": "Nauruan",
    "native": "Dorerin Naoero"
  },
  {
    "code": "nd",
    "flag": "🇿🇼",
    "name": "Northern Ndebele",
    "native": "isiNdebele"
  },
  {
    "code": "nr",
    "flag": "🇿🇦",
    "name": "Southern Ndebele",
    "native": "isiNdebele"
  },
  {
    "code": "oc",
    "flag": "🇫🇷",
    "name": "Occitan",
    "native": "Occitan"
  },
  {
    "code": "pap",
    "flag": "🇨🇼",
    "name": "Papiamento",
    "native": "Papiamentu"
  },
  {
    "code": "rm",
    "flag": "🇨🇭",
    "name": "Romansh",
    "native": "Rumantsch"
  },
  {
    "code": "rn",
    "flag": "🇧🇮",
    "name": "Kirundi",
    "native": "Ikirundi"
  },
  {
    "code": "sc",
    "flag": "🇮🇹",
    "name": "Sardinian",
    "native": "Sardu"
  },
  {
    "code": "ss",
    "flag": "🇸🇿",
    "name": "Swati",
    "native": "SiSwati"
  },
  {
    "code": "tet",
    "flag": "🇹🇱",
    "name": "Tetum",
    "native": "Tetun"
  },
  {
    "code": "to",
    "flag": "🇹🇴",
    "name": "Tongan",
    "native": "Lea faka-Tonga"
  },
  {
    "code": "ty",
    "flag": "🇵🇫",
    "name": "Tahitian",
    "native": "Reo Tahiti"
  },
  {
    "code": "ve",
    "flag": "🇿🇦",
    "name": "Venda",
    "native": "Tshivenḓa"
  },
  {
    "code": "war",
    "flag": "🇵🇭",
    "name": "Waray",
    "native": "Winaray"
  },
  {
    "code": "wo",
    "flag": "🇸🇳",
    "name": "Wolof",
    "native": "Wolof"
  },
  {
    "code": "zap",
    "flag": "🇲🇽",
    "name": "Zapotec",
    "native": "Diidxazá"
  }
];


const findLanguageByCode = (code) =>
  LANGUAGES.find((language) => language.code === String(code)) || null;

const isSupportedLanguage = (code) => Boolean(findLanguageByCode(code));

const getLanguageLabel = (code) => {
  const language = findLanguageByCode(code);
  return language
    ? `${language.flag} ${language.name} — ${language.native}`
    : String(code || "Unknown");
};

const searchLanguages = (query) => {
  const term = String(query || "").trim().toLowerCase();
  if (!term) return LANGUAGES;
  return LANGUAGES.filter((language) =>
    language.code.toLowerCase().includes(term) ||
    language.name.toLowerCase().includes(term) ||
    language.native.toLowerCase().includes(term)
  );
};

module.exports = {
  LANGUAGES,
  findLanguageByCode,
  isSupportedLanguage,
  getLanguageLabel,
  searchLanguages
};
