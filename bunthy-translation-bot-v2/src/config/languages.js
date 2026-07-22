const LANGUAGES = [
  {
    "code": "af",
    "name": "Afrikaans",
    "flag": "🇿🇦"
  },
  {
    "code": "sq",
    "name": "Albanian",
    "flag": "🇦🇱"
  },
  {
    "code": "am",
    "name": "Amharic",
    "flag": "🇪🇹"
  },
  {
    "code": "ar",
    "name": "Arabic",
    "flag": "🇸🇦"
  },
  {
    "code": "hy",
    "name": "Armenian",
    "flag": "🇦🇲"
  },
  {
    "code": "as",
    "name": "Assamese",
    "flag": "🇮🇳"
  },
  {
    "code": "ay",
    "name": "Aymara",
    "flag": "🇧🇴"
  },
  {
    "code": "az",
    "name": "Azerbaijani",
    "flag": "🇦🇿"
  },
  {
    "code": "bm",
    "name": "Bambara",
    "flag": "🇲🇱"
  },
  {
    "code": "eu",
    "name": "Basque",
    "flag": "🇪🇸"
  },
  {
    "code": "be",
    "name": "Belarusian",
    "flag": "🇧🇾"
  },
  {
    "code": "bn",
    "name": "Bengali",
    "flag": "🇧🇩"
  },
  {
    "code": "bho",
    "name": "Bhojpuri",
    "flag": "🇮🇳"
  },
  {
    "code": "bs",
    "name": "Bosnian",
    "flag": "🇧🇦"
  },
  {
    "code": "bg",
    "name": "Bulgarian",
    "flag": "🇧🇬"
  },
  {
    "code": "ca",
    "name": "Catalan",
    "flag": "🇪🇸"
  },
  {
    "code": "ceb",
    "name": "Cebuano",
    "flag": "🇵🇭"
  },
  {
    "code": "ny",
    "name": "Chichewa",
    "flag": "🇲🇼"
  },
  {
    "code": "zh-CN",
    "name": "Chinese Simplified",
    "flag": "🇨🇳"
  },
  {
    "code": "zh-TW",
    "name": "Chinese Traditional",
    "flag": "🇹🇼"
  },
  {
    "code": "co",
    "name": "Corsican",
    "flag": "🇫🇷"
  },
  {
    "code": "hr",
    "name": "Croatian",
    "flag": "🇭🇷"
  },
  {
    "code": "cs",
    "name": "Czech",
    "flag": "🇨🇿"
  },
  {
    "code": "da",
    "name": "Danish",
    "flag": "🇩🇰"
  },
  {
    "code": "dv",
    "name": "Dhivehi",
    "flag": "🇲🇻"
  },
  {
    "code": "doi",
    "name": "Dogri",
    "flag": "🇮🇳"
  },
  {
    "code": "nl",
    "name": "Dutch",
    "flag": "🇳🇱"
  },
  {
    "code": "en",
    "name": "English",
    "flag": "🇬🇧"
  },
  {
    "code": "eo",
    "name": "Esperanto",
    "flag": "🌍"
  },
  {
    "code": "et",
    "name": "Estonian",
    "flag": "🇪🇪"
  },
  {
    "code": "ee",
    "name": "Ewe",
    "flag": "🇬🇭"
  },
  {
    "code": "tl",
    "name": "Filipino",
    "flag": "🇵🇭"
  },
  {
    "code": "fi",
    "name": "Finnish",
    "flag": "🇫🇮"
  },
  {
    "code": "fr",
    "name": "French",
    "flag": "🇫🇷"
  },
  {
    "code": "fy",
    "name": "Frisian",
    "flag": "🇳🇱"
  },
  {
    "code": "gl",
    "name": "Galician",
    "flag": "🇪🇸"
  },
  {
    "code": "ka",
    "name": "Georgian",
    "flag": "🇬🇪"
  },
  {
    "code": "de",
    "name": "German",
    "flag": "🇩🇪"
  },
  {
    "code": "el",
    "name": "Greek",
    "flag": "🇬🇷"
  },
  {
    "code": "gn",
    "name": "Guarani",
    "flag": "🇵🇾"
  },
  {
    "code": "gu",
    "name": "Gujarati",
    "flag": "🇮🇳"
  },
  {
    "code": "ht",
    "name": "Haitian Creole",
    "flag": "🇭🇹"
  },
  {
    "code": "ha",
    "name": "Hausa",
    "flag": "🇳🇬"
  },
  {
    "code": "haw",
    "name": "Hawaiian",
    "flag": "🇺🇸"
  },
  {
    "code": "he",
    "name": "Hebrew",
    "flag": "🇮🇱"
  },
  {
    "code": "hi",
    "name": "Hindi",
    "flag": "🇮🇳"
  },
  {
    "code": "hmn",
    "name": "Hmong",
    "flag": "🌍"
  },
  {
    "code": "hu",
    "name": "Hungarian",
    "flag": "🇭🇺"
  },
  {
    "code": "is",
    "name": "Icelandic",
    "flag": "🇮🇸"
  },
  {
    "code": "ig",
    "name": "Igbo",
    "flag": "🇳🇬"
  },
  {
    "code": "ilo",
    "name": "Ilocano",
    "flag": "🇵🇭"
  },
  {
    "code": "id",
    "name": "Indonesian",
    "flag": "🇮🇩"
  },
  {
    "code": "ga",
    "name": "Irish",
    "flag": "🇮🇪"
  },
  {
    "code": "it",
    "name": "Italian",
    "flag": "🇮🇹"
  },
  {
    "code": "ja",
    "name": "Japanese",
    "flag": "🇯🇵"
  },
  {
    "code": "jv",
    "name": "Javanese",
    "flag": "🇮🇩"
  },
  {
    "code": "kn",
    "name": "Kannada",
    "flag": "🇮🇳"
  },
  {
    "code": "kk",
    "name": "Kazakh",
    "flag": "🇰🇿"
  },
  {
    "code": "km",
    "name": "Khmer",
    "flag": "🇰🇭"
  },
  {
    "code": "rw",
    "name": "Kinyarwanda",
    "flag": "🇷🇼"
  },
  {
    "code": "gom",
    "name": "Konkani",
    "flag": "🇮🇳"
  },
  {
    "code": "ko",
    "name": "Korean",
    "flag": "🇰🇷"
  },
  {
    "code": "kri",
    "name": "Krio",
    "flag": "🇸🇱"
  },
  {
    "code": "ku",
    "name": "Kurdish Kurmanji",
    "flag": "🌍"
  },
  {
    "code": "ckb",
    "name": "Kurdish Sorani",
    "flag": "🌍"
  },
  {
    "code": "ky",
    "name": "Kyrgyz",
    "flag": "🇰🇬"
  },
  {
    "code": "lo",
    "name": "Lao",
    "flag": "🇱🇦"
  },
  {
    "code": "la",
    "name": "Latin",
    "flag": "🏛️"
  },
  {
    "code": "lv",
    "name": "Latvian",
    "flag": "🇱🇻"
  },
  {
    "code": "ln",
    "name": "Lingala",
    "flag": "🇨🇩"
  },
  {
    "code": "lt",
    "name": "Lithuanian",
    "flag": "🇱🇹"
  },
  {
    "code": "lg",
    "name": "Luganda",
    "flag": "🇺🇬"
  },
  {
    "code": "lb",
    "name": "Luxembourgish",
    "flag": "🇱🇺"
  },
  {
    "code": "mk",
    "name": "Macedonian",
    "flag": "🇲🇰"
  },
  {
    "code": "mai",
    "name": "Maithili",
    "flag": "🇮🇳"
  },
  {
    "code": "mg",
    "name": "Malagasy",
    "flag": "🇲🇬"
  },
  {
    "code": "ms",
    "name": "Malay",
    "flag": "🇲🇾"
  },
  {
    "code": "ml",
    "name": "Malayalam",
    "flag": "🇮🇳"
  },
  {
    "code": "mt",
    "name": "Maltese",
    "flag": "🇲🇹"
  },
  {
    "code": "mi",
    "name": "Maori",
    "flag": "🇳🇿"
  },
  {
    "code": "mr",
    "name": "Marathi",
    "flag": "🇮🇳"
  },
  {
    "code": "mni-Mtei",
    "name": "Meiteilon",
    "flag": "🇮🇳"
  },
  {
    "code": "lus",
    "name": "Mizo",
    "flag": "🇮🇳"
  },
  {
    "code": "mn",
    "name": "Mongolian",
    "flag": "🇲🇳"
  },
  {
    "code": "my",
    "name": "Myanmar",
    "flag": "🇲🇲"
  },
  {
    "code": "ne",
    "name": "Nepali",
    "flag": "🇳🇵"
  },
  {
    "code": "no",
    "name": "Norwegian",
    "flag": "🇳🇴"
  },
  {
    "code": "or",
    "name": "Odia",
    "flag": "🇮🇳"
  },
  {
    "code": "om",
    "name": "Oromo",
    "flag": "🇪🇹"
  },
  {
    "code": "ps",
    "name": "Pashto",
    "flag": "🇦🇫"
  },
  {
    "code": "fa",
    "name": "Persian",
    "flag": "🇮🇷"
  },
  {
    "code": "pl",
    "name": "Polish",
    "flag": "🇵🇱"
  },
  {
    "code": "pt",
    "name": "Portuguese",
    "flag": "🇵🇹"
  },
  {
    "code": "pa",
    "name": "Punjabi",
    "flag": "🇮🇳"
  },
  {
    "code": "qu",
    "name": "Quechua",
    "flag": "🇵🇪"
  },
  {
    "code": "ro",
    "name": "Romanian",
    "flag": "🇷🇴"
  },
  {
    "code": "ru",
    "name": "Russian",
    "flag": "🇷🇺"
  },
  {
    "code": "sm",
    "name": "Samoan",
    "flag": "🇼🇸"
  },
  {
    "code": "sa",
    "name": "Sanskrit",
    "flag": "🇮🇳"
  },
  {
    "code": "gd",
    "name": "Scots Gaelic",
    "flag": "🏴"
  },
  {
    "code": "nso",
    "name": "Sepedi",
    "flag": "🇿🇦"
  },
  {
    "code": "sr",
    "name": "Serbian",
    "flag": "🇷🇸"
  },
  {
    "code": "st",
    "name": "Sesotho",
    "flag": "🇱🇸"
  },
  {
    "code": "sn",
    "name": "Shona",
    "flag": "🇿🇼"
  },
  {
    "code": "sd",
    "name": "Sindhi",
    "flag": "🇵🇰"
  },
  {
    "code": "si",
    "name": "Sinhala",
    "flag": "🇱🇰"
  },
  {
    "code": "sk",
    "name": "Slovak",
    "flag": "🇸🇰"
  },
  {
    "code": "sl",
    "name": "Slovenian",
    "flag": "🇸🇮"
  },
  {
    "code": "so",
    "name": "Somali",
    "flag": "🇸🇴"
  },
  {
    "code": "es",
    "name": "Spanish",
    "flag": "🇪🇸"
  },
  {
    "code": "su",
    "name": "Sundanese",
    "flag": "🇮🇩"
  },
  {
    "code": "sw",
    "name": "Swahili",
    "flag": "🇰🇪"
  },
  {
    "code": "sv",
    "name": "Swedish",
    "flag": "🇸🇪"
  },
  {
    "code": "tg",
    "name": "Tajik",
    "flag": "🇹🇯"
  },
  {
    "code": "ta",
    "name": "Tamil",
    "flag": "🇮🇳"
  },
  {
    "code": "tt",
    "name": "Tatar",
    "flag": "🇷🇺"
  },
  {
    "code": "te",
    "name": "Telugu",
    "flag": "🇮🇳"
  },
  {
    "code": "th",
    "name": "Thai",
    "flag": "🇹🇭"
  },
  {
    "code": "ti",
    "name": "Tigrinya",
    "flag": "🇪🇷"
  },
  {
    "code": "ts",
    "name": "Tsonga",
    "flag": "🇿🇦"
  },
  {
    "code": "tr",
    "name": "Turkish",
    "flag": "🇹🇷"
  },
  {
    "code": "tk",
    "name": "Turkmen",
    "flag": "🇹🇲"
  },
  {
    "code": "ak",
    "name": "Twi",
    "flag": "🇬🇭"
  },
  {
    "code": "uk",
    "name": "Ukrainian",
    "flag": "🇺🇦"
  },
  {
    "code": "ur",
    "name": "Urdu",
    "flag": "🇵🇰"
  },
  {
    "code": "ug",
    "name": "Uyghur",
    "flag": "🌍"
  },
  {
    "code": "uz",
    "name": "Uzbek",
    "flag": "🇺🇿"
  },
  {
    "code": "vi",
    "name": "Vietnamese",
    "flag": "🇻🇳"
  },
  {
    "code": "cy",
    "name": "Welsh",
    "flag": "🏴"
  },
  {
    "code": "xh",
    "name": "Xhosa",
    "flag": "🇿🇦"
  },
  {
    "code": "yi",
    "name": "Yiddish",
    "flag": "🌍"
  },
  {
    "code": "yo",
    "name": "Yoruba",
    "flag": "🇳🇬"
  },
  {
    "code": "zu",
    "name": "Zulu",
    "flag": "🇿🇦"
  },
  {
    "code": "ace",
    "name": "Acehnese",
    "flag": "🇮🇩"
  },
  {
    "code": "ach",
    "name": "Acholi",
    "flag": "🇺🇬"
  },
  {
    "code": "awa",
    "name": "Awadhi",
    "flag": "🇮🇳"
  },
  {
    "code": "bal",
    "name": "Baluchi",
    "flag": "🌍"
  },
  {
    "code": "ban",
    "name": "Balinese",
    "flag": "🇮🇩"
  },
  {
    "code": "ba",
    "name": "Bashkir",
    "flag": "🇷🇺"
  },
  {
    "code": "bat-smg",
    "name": "Samogitian",
    "flag": "🇱🇹"
  },
  {
    "code": "bem",
    "name": "Bemba",
    "flag": "🇿🇲"
  },
  {
    "code": "ber",
    "name": "Berber",
    "flag": "🌍"
  },
  {
    "code": "bik",
    "name": "Bikol",
    "flag": "🇵🇭"
  },
  {
    "code": "br",
    "name": "Breton",
    "flag": "🇫🇷"
  },
  {
    "code": "bua",
    "name": "Buryat",
    "flag": "🇷🇺"
  },
  {
    "code": "ch",
    "name": "Chamorro",
    "flag": "🇬🇺"
  },
  {
    "code": "chr",
    "name": "Cherokee",
    "flag": "🇺🇸"
  },
  {
    "code": "cv",
    "name": "Chuvash",
    "flag": "🇷🇺"
  },
  {
    "code": "din",
    "name": "Dinka",
    "flag": "🇸🇸"
  },
  {
    "code": "dz",
    "name": "Dzongkha",
    "flag": "🇧🇹"
  },
  {
    "code": "fo",
    "name": "Faroese",
    "flag": "🇫🇴"
  },
  {
    "code": "fj",
    "name": "Fijian",
    "flag": "🇫🇯"
  },
  {
    "code": "fon",
    "name": "Fon",
    "flag": "🇧🇯"
  },
  {
    "code": "fur",
    "name": "Friulian",
    "flag": "🇮🇹"
  },
  {
    "code": "gaa",
    "name": "Ga",
    "flag": "🇬🇭"
  },
  {
    "code": "gil",
    "name": "Gilbertese",
    "flag": "🇰🇮"
  },
  {
    "code": "grc",
    "name": "Ancient Greek",
    "flag": "🏛️"
  },
  {
    "code": "hil",
    "name": "Hiligaynon",
    "flag": "🇵🇭"
  },
  {
    "code": "iba",
    "name": "Iban",
    "flag": "🇲🇾"
  },
  {
    "code": "io",
    "name": "Ido",
    "flag": "🌍"
  },
  {
    "code": "iu",
    "name": "Inuktitut",
    "flag": "🇨🇦"
  },
  {
    "code": "kab",
    "name": "Kabyle",
    "flag": "🇩🇿"
  },
  {
    "code": "kg",
    "name": "Kongo",
    "flag": "🇨🇩"
  },
  {
    "code": "kok",
    "name": "Konkani",
    "flag": "🇮🇳"
  },
  {
    "code": "kr",
    "name": "Kanuri",
    "flag": "🇳🇬"
  },
  {
    "code": "ks",
    "name": "Kashmiri",
    "flag": "🇮🇳"
  },
  {
    "code": "kv",
    "name": "Komi",
    "flag": "🇷🇺"
  },
  {
    "code": "li",
    "name": "Limburgish",
    "flag": "🇳🇱"
  },
  {
    "code": "ltg",
    "name": "Latgalian",
    "flag": "🇱🇻"
  },
  {
    "code": "mai-alt",
    "name": "Maithili Alternative",
    "flag": "🇮🇳"
  },
  {
    "code": "mh",
    "name": "Marshallese",
    "flag": "🇲🇭"
  },
  {
    "code": "min",
    "name": "Minangkabau",
    "flag": "🇮🇩"
  },
  {
    "code": "mfe",
    "name": "Mauritian Creole",
    "flag": "🇲🇺"
  },
  {
    "code": "mos",
    "name": "Mossi",
    "flag": "🇧🇫"
  },
  {
    "code": "nah",
    "name": "Nahuatl",
    "flag": "🇲🇽"
  },
  {
    "code": "nap",
    "name": "Neapolitan",
    "flag": "🇮🇹"
  },
  {
    "code": "nds",
    "name": "Low German",
    "flag": "🇩🇪"
  },
  {
    "code": "nr",
    "name": "South Ndebele",
    "flag": "🇿🇦"
  },
  {
    "code": "oc",
    "name": "Occitan",
    "flag": "🇫🇷"
  },
  {
    "code": "pap",
    "name": "Papiamento",
    "flag": "🇨🇼"
  },
  {
    "code": "rm",
    "name": "Romansh",
    "flag": "🇨🇭"
  },
  {
    "code": "rn",
    "name": "Kirundi",
    "flag": "🇧🇮"
  },
  {
    "code": "rom",
    "name": "Romani",
    "flag": "🌍"
  },
  {
    "code": "sc",
    "name": "Sardinian",
    "flag": "🇮🇹"
  },
  {
    "code": "sco",
    "name": "Scots",
    "flag": "🏴"
  },
  {
    "code": "sg",
    "name": "Sango",
    "flag": "🇨🇫"
  },
  {
    "code": "ss",
    "name": "Swati",
    "flag": "🇸🇿"
  },
  {
    "code": "tet",
    "name": "Tetum",
    "flag": "🇹🇱"
  },
  {
    "code": "tpi",
    "name": "Tok Pisin",
    "flag": "🇵🇬"
  },
  {
    "code": "tum",
    "name": "Tumbuka",
    "flag": "🇲🇼"
  },
  {
    "code": "ve",
    "name": "Venda",
    "flag": "🇿🇦"
  },
  {
    "code": "war",
    "name": "Waray",
    "flag": "🇵🇭"
  },
  {
    "code": "wo",
    "name": "Wolof",
    "flag": "🇸🇳"
  }
];

const LANGUAGE_MAP = new Map(LANGUAGES.map((item) => [item.code, item]));

module.exports = { LANGUAGES, LANGUAGE_MAP };
