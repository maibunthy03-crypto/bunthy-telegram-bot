function parseJson(value,fallback=[]){try{return JSON.parse(value||'[]')}catch{return fallback}}
function roomToJson(room){if(!room)return null;return {...room,available:Boolean(room.available),featured:Boolean(room.featured),photos:parseJson(room.photos_json),videos:parseJson(room.videos_json),facilities:parseJson(room.facilities_json),servicesIncluded:parseJson(room.included_json),servicesExcluded:parseJson(room.excluded_json),nearbyPlaces:parseJson(room.nearby_json)}}
function reference(prefix='MLN'){return `${prefix}-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${Math.random().toString(36).slice(2,7).toUpperCase()}`}
function cleanArray(v){if(Array.isArray(v))return v.map(String).map(x=>x.trim()).filter(Boolean);if(typeof v==='string')return v.split(/\n|,/).map(x=>x.trim()).filter(Boolean);return []}
module.exports={parseJson,roomToJson,reference,cleanArray};
