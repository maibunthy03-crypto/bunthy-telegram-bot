const axios=require('axios');
const env=require('../../config/env');
async function detectLanguage(text){
 if(!env.translationApiUrl) return 'auto';
 try{const {data}=await axios.post(`${env.translationApiUrl}/detect`,{q:text},{headers:env.translationApiKey?{'X-API-Key':env.translationApiKey}:{},timeout:10000});const item=Array.isArray(data)?data[0]:data;return item?.language||'auto'}catch{return 'auto'}
}
async function translateText(text,source,target){
 if(!env.translationApiUrl) throw new Error('Translation API is not configured');
 const payload={q:text,source:source||'auto',target,format:'text'}; if(env.translationApiKey)payload.api_key=env.translationApiKey;
 const {data}=await axios.post(`${env.translationApiUrl}/translate`,payload,{timeout:15000});
 return data?.translatedText||data?.translation||'';
}
module.exports={detectLanguage,translateText};
