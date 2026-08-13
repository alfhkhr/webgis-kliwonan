const mapConfig={
center:[-7.760371781873091,109.95300521889915],
zoom:16,

basemaps:{
osm:{
url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
attribution:'© OpenStreetMap contributors',
maxZoom:19
},
esri:{
url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
attribution:'© Esri, Maxar, Earthstar Geographics',
maxZoom:19
},
google:{
url:'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
attribution:'© Google',
maxZoom:20
},
topo:{
url:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
attribution:'© OpenTopoMap contributors',
maxZoom:17
}
},

tingkatLampuColorMap:{
Terang:'#2e7d32',
Sedang:'#f9a825',
Gelap:'#c62828'
},

dusunColorMap:{
'Dusun Kliwonan':'#66c2a5',
'Dusun Karangwaru':'#fc8d62',
'Dusun Tegaliser':'#8da0cb'
},

layerStyles:{
batasdesa:{
color:'#397b18',
weight:3,
opacity:1,
fillColor:'#397b18',
fillOpacity:.08
},

batasdusun:{
color:'#8e44ad',
weight:2,
opacity:.9,
fillColor:'#8e44ad',
fillOpacity:.12
},

batasrt:{
color:'#e91e63',
weight:1,
opacity:.8,
fillColor:'#e91e63',
fillOpacity:.08
},

pemerintahan:{opacity:1},
pendidikan:{opacity:1},
peribadatan:{opacity:1},
lapangan:{opacity:1},
tpu:{opacity:1},
sppg:{opacity:1},
kopdes:{opacity:1},
umkm:{opacity:1},
industri:{opacity:1},

jaringanjalan:{
color:'#e67e22',
weight:2.5,
opacity:.8
},

relkereta:{
color:'#5d4037',
weight:5,
opacity:1,
dashArray:'8,5'
},

sungai:{
color:'#2196f3',
weight:2,
opacity:.9
},

pju:{opacity:1},

minim_penerangan:{
color:'#c62828',
weight:2,
opacity:.8,
fillColor:'#c62828',
fillOpacity:.15
},

situsbudaya:{opacity:1},
sumbor:{opacity:1}
},

dataSources:{
batasdesa:'data/desakliwonan.geojson',
batasdusun:'data/batasdusun.geojson',
batasrt:'data/batasrt.geojson',

pemerintahan:'data/pemerintahan.json',
pendidikan:'data/pendidikan.geojson',
peribadatan:'data/peribadatan.geojson',
lapangan:'data/lapangan.geojson',
tpu:'data/tpu.geojson',
sppg:'data/sppg.geojson',
kopdes:'data/kopdes.geojson',

umkm:'data/umkm.geojson',
industri:'data/industri.geojson',

jaringanjalan:'data/jaringanjalan.geojson',
relkereta:'data/relkereta.geojson',
pju:'data/pju.geojson',
minim_penerangan:'data/minim_penerangan.geojson',

sungai:'data/sungai.geojson',
situsbudaya:'data/situsbudaya.geojson',
sumbor:'data/sumurbor.geojson'
}
};