"use strict";
const ROOMS=[
{key:"studio50",title:"Studio",size:"50 sqm",imageFolder:"studio"},
{key:"one84",title:"1 Bedroom",size:"84 sqm",imageFolder:"one-bedroom-84"},
{key:"one91",title:"1 Bedroom",size:"91 sqm",imageFolder:"one-bedroom-91"},
{key:"two130",title:"2 Bedroom",size:"130 sqm",imageFolder:"two-bedroom-130"},
{key:"two138",title:"2 Bedroom",size:"138 sqm",imageFolder:"two-bedroom-138"},
{key:"two148",title:"2 Bedroom",size:"148 sqm",imageFolder:"two-bedroom-148"},
{key:"two150",title:"2 Bedroom",size:"150 sqm",imageFolder:"two-bedroom-150"},
{key:"pha",title:"Penthouse PHA",size:"551 sqm",imageFolder:"pha"},
{key:"phb",title:"Penthouse PHB",size:"465 sqm",imageFolder:"phb"},
{key:"phc",title:"Penthouse PHC",size:"435 sqm",imageFolder:"phc"}];
const findRoomByKey=k=>ROOMS.find(r=>r.key===k)||null;
const createRoomImages=r=>Array.from({length:10},(_,i)=>`/web/images/${r.imageFolder}/${i+1}.jpg`);
module.exports={ROOMS,findRoomByKey,createRoomImages};