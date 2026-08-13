class LayerManager{
constructor(map){
this.map=map;this.layers={};this.layerGroups={};this.bounds=null;this.popupLockedByClick=false;
this.defaultVisibleLayers=['batasdesa','pemerintahan','pendidikan','peribadatan','jaringanjalan','sungai'];
this.defaultHiddenLayers=['batasdusun','batasrt'];

this.iconConfig={
pemerintahan:{symbol:'🏛',color:'#7c3aed'},pendidikan:{symbol:'🎓',color:'#2563eb'},
masjid:{symbol:'🕌',color:'#15803d'},mushola:{symbol:'🕌',color:'#16a34a'},
gereja:{symbol:'⛪',color:'#dc2626'},lapangan:{symbol:'🏐',color:'#ea580c'},
tpu:{symbol:'🪦',color:'#475569'},sppg:{symbol:'🍽',color:'#ca8a04'},
kopdes:{symbol:'🏪',color:'#0891b2'},umkm:{symbol:'🛍',color:'#c026d3'},
industri:{symbol:'🏭',color:'#64748b'},situsbudaya:{symbol:'🏛',color:'#92400e'},
sumbor:{symbol:'💧',color:'#0284c7'},pju:{symbol:'💡',color:'#eab308'}
};

this.paneMapping={
batasdesa:'pane-batasdesa',batasdusun:'pane-batasdusun',batasrt:'pane-batasrt',
pemerintahan:'pane-fasilitas',pendidikan:'pane-fasilitas',peribadatan:'pane-fasilitas',
lapangan:'pane-fasilitas',tpu:'pane-fasilitas',sppg:'pane-fasilitas',kopdes:'pane-fasilitas',
umkm:'pane-ekonomi',industri:'pane-ekonomi',jaringanjalan:'pane-jalan',
relkereta:'pane-kereta',sungai:'pane-sungai',pju:'pane-pju',
minim_penerangan:'pane-minim-penerangan',situsbudaya:'pane-potensi',sumbor:'pane-potensi'
};

this.initializePanes();
this.initializeStyle();
this.initializeLayerGroups();
}

initializePanes(){
const panes={
'pane-batasdesa':300,'pane-batasdusun':310,'pane-batasrt':320,'pane-sungai':350,
'pane-jalan':400,'pane-kereta':410,'pane-ekonomi':500,'pane-potensi':510,
'pane-minim-penerangan':550,'pane-fasilitas':600,'pane-pju':650,tooltipPane:1000
};
Object.entries(panes).forEach(([n,z])=>{
let p=this.map.getPane(n);if(!p)p=this.map.createPane(n);p.style.zIndex=z;
});
}

initializeStyle(){
if(document.getElementById('lm-style'))return;
const s=document.createElement('style');s.id='lm-style';
s.textContent=`
.leaflet-tooltip.road-label-wrapper{
background:transparent!important;border:0!important;box-shadow:none!important;
padding:0!important;color:#fff!important;font-size:9px!important;
font-weight:600!important;text-shadow:1px 1px 2px #000,-1px -1px 2px #000,
1px -1px 2px #000,-1px 1px 2px #000;white-space:nowrap!important;
pointer-events:none!important
}
.leaflet-tooltip.road-label-wrapper:before{display:none!important}
.road-label-text{background:none!important;border:0!important;padding:0!important;
margin:0!important;color:#fff!important;white-space:nowrap!important;
pointer-events:none!important;display:inline-block!important}
`;
document.head.appendChild(s);
}

initializeLayerGroups(){
if(!mapConfig?.dataSources)return console.error('mapConfig.dataSources tidak ditemukan.');
Object.keys(mapConfig.dataSources).forEach(n=>this.layerGroups[n]=L.layerGroup());
}

createAutoIcon(category){
const c=this.iconConfig[category]||{symbol:'●',color:'#397b18'};
return L.divIcon({
className:'auto-map-icon',
html:`<div style="width:24px;height:24px;border-radius:50%;background:${c.color};border:1.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;font-size:12px;line-height:1">${c.symbol}</div>`,
iconSize:[24,24],iconAnchor:[12,12],popupAnchor:[0,-12]
});
}

getProperty(p,keys){
for(const k of keys)if(p[k]!==undefined&&p[k]!==null&&p[k]!=='')return p[k];
return'';
}
normalizeText(v){return String(v||'').trim().toLowerCase();}
getDusunName(f){return this.getProperty(f.properties||{},['Nama']);}
getRTName(f){
const v=this.getProperty(f.properties||{},['Nama']);if(!v)return'';
const t=String(v).trim();if(/^rt/i.test(t))return t;
return/^\d+$/.test(t)?`RT ${t.padStart(2,'0')}`:t;
}
getRoadName(f){return this.getProperty(f.properties||{},['Nama']);}
getLightingStatus(f){return this.getProperty(f.properties||{},['Status']);}

getPeribadatanCategory(f){
const p=f.properties||{},v=String(p.Jenis||p.JENIS||p.jenis||p.Nama||'').toLowerCase();
if(v.includes('gereja'))return'gereja';
if(v.includes('musholla')||v.includes('mushola'))return'mushola';
return'masjid';
}

getPJUColor(f){
const v=this.normalizeText(this.getProperty(f.properties||{},['Kondisi']));
if(/nyala|menyala|baik|hidup/.test(v))return'#eab308';
if(/mati|rusak|tidak/.test(v))return'#64748b';
return'#eab308';
}

getMinimLightingColor(f){
const v=this.normalizeText(this.getLightingStatus(f));
if(v.includes('terang'))return'#2e7d32';
if(v.includes('sedang'))return'#f9a825';
return'#c62828';
}

generateNameColor(name){
const c=['#7c3aed','#2563eb','#dc2626','#ea580c','#0891b2','#16a34a',
'#c026d3','#ca8a04','#0f766e','#db2777','#4f46e5','#65a30d',
'#9333ea','#0284c7','#e11d48'];
let h=0;for(const x of String(name||''))h=((h<<5)-h)+x.charCodeAt(0);
return c[Math.abs(h)%c.length];
}

findDusunColor(name){
if(name&&mapConfig.dusunColorMap){
const n=this.normalizeText(name);
for(const[k,c]of Object.entries(mapConfig.dusunColorMap)){
const x=this.normalizeText(k);
if(x===n||n.includes(x)||x.includes(n))return c;
}}
return this.generateNameColor(name||'Dusun');
}

getRTColor(f){return this.generateNameColor(this.getRTName(f));}

getLayerStyle(n,f){
if(n==='batasdesa')return{
color:'#000',weight:3,opacity:1,fill:false,fillOpacity:0,dashArray:null,pane:this.paneMapping[n]
};

if(n==='batasdusun'){
const c=this.findDusunColor(this.getDusunName(f));
return{color:c,weight:2.5,opacity:.9,fill:true,fillColor:c,fillOpacity:.16,dashArray:null,pane:this.paneMapping[n]};
}

if(n==='batasrt'){
const c=this.getRTColor(f);
return{color:c,weight:1.5,opacity:.9,fill:true,fillColor:c,fillOpacity:.10,dashArray:null,pane:this.paneMapping[n]};
}

if(n==='jaringanjalan')return{
...(mapConfig.layerStyles?.jaringanjalan||{}),
color:mapConfig.layerStyles?.jaringanjalan?.color||'#e67e22',
weight:mapConfig.layerStyles?.jaringanjalan?.weight||4,
opacity:mapConfig.layerStyles?.jaringanjalan?.opacity??.9,pane:this.paneMapping[n]
};

if(n==='relkereta')return{
...(mapConfig.layerStyles?.relkereta||{}),
color:mapConfig.layerStyles?.relkereta?.color||'#5d4037',
weight:mapConfig.layerStyles?.relkereta?.weight||5,
opacity:1,dashArray:mapConfig.layerStyles?.relkereta?.dashArray||'10,6',pane:this.paneMapping[n]
};

if(n==='pju'){
const c=this.getPJUColor(f);
return{color:c,fillColor:c,weight:1,opacity:1,fillOpacity:1,pane:this.paneMapping[n]};
}

if(n==='minim_penerangan'){
const c=this.getMinimLightingColor(f);
return{...(mapConfig.layerStyles?.minim_penerangan||{}),color:c,fillColor:c,
weight:2,opacity:.9,fillOpacity:.22,pane:this.paneMapping[n]};
}

return{...(mapConfig.layerStyles?.[n]||{}),...(this.paneMapping[n]?{pane:this.paneMapping[n]}:{})};
}

createPointLayer(n,f,ll){
if(n==='peribadatan')return L.marker(ll,{icon:this.createAutoIcon(this.getPeribadatanCategory(f)),pane:this.paneMapping[n]});
if(this.iconConfig[n])return L.marker(ll,{icon:this.createAutoIcon(n),pane:this.paneMapping[n]});
return L.circleMarker(ll,{radius:5,fillColor:'#397b18',color:'#fff',weight:1,
opacity:1,fillOpacity:.9,pane:this.paneMapping[n]});
}

async loadLayer(n){
try{
const url=mapConfig.dataSources[n];if(!url)return null;
const r=await fetch(url);if(!r.ok)throw Error(`HTTP ${r.status}`);
const data=await r.json();if(!Array.isArray(data?.features))throw Error('GeoJSON tidak valid');

const layer=L.geoJSON(data,{
pane:this.paneMapping[n],
style:f=>this.getLayerStyle(n,f),
pointToLayer:(f,ll)=>this.createPointLayer(n,f,ll),
onEachFeature:(f,l)=>this.setupFeatureEvents(n,f,l)
});

if(this.layerGroups[n]){
this.layerGroups[n].clearLayers();this.layerGroups[n].addLayer(layer);
}
this.layers[n]=layer;this.updateBounds(layer);return layer;
}catch(e){console.error(`Gagal memuat ${n}:`,e);this.showError(`Gagal memuat layer: ${n}`);return null;}
}

setupFeatureEvents(n,f,l){
this.bindLayerLabel(n,f,l);
const boundary=n==='batasdusun'||n==='batasrt';

l.on('mouseover',()=>{
if(boundary)return;
if(l.setStyle&&f.geometry?.type!=='Point'){
const s=this.getLayerStyle(n,f);l.setStyle({weight:Math.max((s.weight||2)+2,4)});
}});

l.on('mouseout',()=>{
if(!this.popupLockedByClick)this.resetLayerStyle(n,l,f);
});

l.on('click',e=>{
if(boundary){
const name=n==='batasdusun'?this.getDusunName(f):this.getRTName(f);
if(name){
if(l.getTooltip())l.closeTooltip();
l.bindTooltip(`<span class="boundary-click-label">${this.escapeHtml(name)}</span>`,
{permanent:false,direction:'center',className:'boundary-label-wrapper',sticky:false}).openTooltip(e.latlng);
}
L.DomEvent.stopPropagation(e);return;
}

this.popupLockedByClick=true;
const content=window.popupHandler?.createPopupContent?
window.popupHandler.createPopupContent(f,n):this.createDefaultPopup(f,n);

const p=L.popup({closeButton:true,className:'popup-click',maxWidth:340})
.setLatLng(e.latlng).setContent(content).openOn(this.map);

p.on('remove',()=>{this.popupLockedByClick=false;this.resetLayerStyle(n,l,f);});
if(l.setStyle&&f.geometry?.type!=='Point'){
const s=this.getLayerStyle(n,f);l.setStyle({weight:Math.max((s.weight||2)+2,4)});
}
L.DomEvent.stopPropagation(e);
});
}

bindLayerLabel(n,f,l){
if(n!=='jaringanjalan'||!this.getRoadName(f)||!l.getLatLngs)return;
this.bindRoadLabel(l,this.getRoadName(f));
}

bindRoadLabel(l,name){
try{
const pts=this.extractLatLngs(l.getLatLngs());if(pts.length<2)return;
const i=Math.floor(pts.length/2),angle=this.calculateAngle(pts[Math.max(0,i-1)],pts[Math.min(pts.length-1,i+1)]);

l.bindTooltip(`<span class="road-label-text">${this.escapeHtml(name)}</span>`,
{permanent:false,direction:'center',className:'road-label-wrapper',sticky:false,opacity:1});

const update=()=>{
if(!this.map.hasLayer(l))return;
const t=l.getTooltip();if(!t)return;
if(this.map.getZoom()>=16)l.openTooltip();else l.closeTooltip();
};

l.on('tooltipopen',e=>{
const el=e.tooltip.getElement(),txt=el?.querySelector('.road-label-text');
if(txt)txt.style.transform=`rotate(${angle}deg)`;
});

this.map.on('zoomend',update);
update();
}catch(e){console.warn('Label jalan gagal:',e);}
}

extractLatLngs(a){
if(!Array.isArray(a))return[];
return a.length&&Array.isArray(a[0])?this.extractLatLngs(a[0]):a;
}

calculateAngle(a,b){
if(!a||!b)return 0;
let x=Math.atan2(b.lat-a.lat,b.lng-a.lng)*180/Math.PI;
return x>90||x<-90?x+180:x;
}

createDefaultPopup(f,n){
const p=f.properties||{};let title=this.formatLayerName(n),fields=[];
if(n==='batasdesa'){title='Batas Desa';}
else if(n==='batasdusun'){title=this.getDusunName(f)||'Dusun';fields=['Nama'];}
else if(n==='batasrt'){title=this.getRTName(f)||'RT';fields=['Nama'];}
else if(n==='jaringanjalan'){title=this.getRoadName(f)||'Jalan';fields=['Nama'];}
else if(n==='pju'){title='Penerangan Jalan Umum';fields=['Kondisi','Status'];}
else if(n==='minim_penerangan'){title='Area Minim Penerangan';fields=['Status'];}
else fields=this.getPopupFields(n);

let html=`<div class="popup-content"><h3>${this.escapeHtml(title)}</h3>`,has=false;
fields.forEach(k=>{
const v=p[k];if(v===null||v===undefined||v==='')return;
has=true;html+=`<div class="popup-row"><strong>${this.escapeHtml(this.formatPropertyName(k))}:</strong> <span>${this.escapeHtml(v)}</span></div>`;
});
if(!has&&n!=='batasdesa')html+='<p>Informasi utama tidak tersedia.</p>';
return html+'</div>';
}

getPopupFields(n){
return{
pemerintahan:['Nama'],pendidikan:['Nama'],
peribadatan:['Nama','Jenis'],lapangan:['Nama','Jenis'],
tpu:['Nama'],sppg:['Nama'],kopdes:['Nama'],
umkm:['nama_usaha','kelas'],industri:['Nama','Jenis'],
relkereta:['Nama'],sungai:['Nama'],situsbudaya:['Nama','Jenis'],
sumbor:['Nama','Kondisi']
}[n]||['Nama'];
}

escapeHtml(v){
return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
.replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

formatLayerName(n){
return{
batasdesa:'Batas Desa',batasdusun:'Batas Dusun',batasrt:'Batas RT',
pemerintahan:'Pemerintahan',pendidikan:'Pendidikan',peribadatan:'Peribadatan',
lapangan:'Lapangan',tpu:'Tempat Pemakaman Umum',sppg:'SPPG',
kopdes:'Koperasi Desa',umkm:'UMKM',industri:'Industri',
jaringanjalan:'Jaringan Jalan',relkereta:'Jalur Kereta Api',
sungai:'Sungai',pju:'Penerangan Jalan Umum',
minim_penerangan:'Area Minim Penerangan',situsbudaya:'Situs Budaya',
sumbor:'Sumur Bor'
}[n]||n;
}

formatPropertyName(n){
return String(n).replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
}

resetLayerStyle(n,l,f){if(l?.setStyle)l.setStyle(this.getLayerStyle(n,f));}

updateBounds(l){
try{
const b=l.getBounds();if(!b?.isValid())return;
if(this.bounds)this.bounds.extend(b);else this.bounds=b;
}catch(e){}
}

toggleLayer(n,v){
const g=this.layerGroups[n];if(!g)return;
if(v&&!this.map.hasLayer(g))g.addTo(this.map);
else if(!v&&this.map.hasLayer(g))this.map.removeLayer(g);
}

zoomToLayer(n){
const l=this.layers[n];if(!l)return;
try{
const b=l.getBounds();
if(b?.isValid()){this.map.fitBounds(b,{padding:[40,40]});return;}
}catch(e){}
const c=this.getLayerCenter(l);if(c)this.map.setView(c,18);
}

getLayerCenter(l){
try{
const b=l.getBounds();return b?.isValid()?b.getCenter():null;
}catch(e){return null;}
}

zoomToExtent(){
if(this.bounds?.isValid())this.map.fitBounds(this.bounds,{padding:[30,30]});
else this.map.setView(mapConfig.center,mapConfig.zoom);
}

async loadAllLayers(){
const loading=document.getElementById('loading');
if(loading)loading.style.display='block';

try{
for(const n of Object.keys(mapConfig.dataSources)){
const l=await this.loadLayer(n);if(!l)continue;
const g=this.layerGroups[n];if(!g)continue;
const cb=document.getElementById(n);

if(this.defaultHiddenLayers.includes(n)){
if(cb)cb.checked=false;this.map.removeLayer(g);continue;
}

const show=cb?cb.checked:this.defaultVisibleLayers.includes(n);
if(show)g.addTo(this.map);else this.map.removeLayer(g);
}
console.log('✓ Semua layer selesai dimuat.');
}catch(e){console.error('Gagal memuat semua layer:',e);}
finally{if(loading)loading.style.display='none';}
}

showError(m){console.error(m);}
}

window.LayerManager=LayerManager;