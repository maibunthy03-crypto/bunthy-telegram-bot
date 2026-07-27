"use strict";
const LANGUAGES=[{code:"en",name:"English"},{code:"km",name:"Khmer"},{code:"zh-CN",name:"Chinese Simplified"},{code:"ja",name:"Japanese"},{code:"ko",name:"Korean"},{code:"th",name:"Thai"},{code:"vi",name:"Vietnamese"},{code:"fr",name:"French"},{code:"de",name:"German"},{code:"es",name:"Spanish"}];
const findLanguageByCode=c=>LANGUAGES.find(l=>l.code===c)||null;
const isSupportedLanguage=c=>!!findLanguageByCode(c);
module.exports={LANGUAGES,findLanguageByCode,isSupportedLanguage};