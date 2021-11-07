
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var map = L.map("map", {
    center: [10, -40],
    zoom: 3,
    layers: [satellite, streets]
});

streets.addTo(map);

var tectonicplates = new L.layerGroup();
var earthquakes = new L.layerGroup();
var majorEarthquakes = new L.layerGroup();

var maps = {
    "Satellite": satellite,
    "Streeets": streets
};

var overlays = {
    "Tectonic Plates": tectonicplates,
    "Earthquakes": earthquakes,
    "Major Earthquakes": majorEarthquakes
};

L.control.layers(maps,overlays).addTo(map);

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson').then(({features})=>{

    features.forEach(feature => {
        var { geometry, properties } = feature;
        var lat = geometry.coordinates[1];
        var lng = geometry.coordinates[0];
        var mag = properties.mag;
        var place = properties.place;
        let color = mag>5 ? 'red' : mag>4 ? 'orange': mag>2 ? 'yellow' : 'green';
        let quake = L.circleMarker([lat,lng],{'radius':mag*4, 'fillColor':color,'color':'black','weight':1,fillOpacity:'.7'})
        mag>4 ? quake.addTo(majorEarthquakes) : quake.addTo(earthquakes);
    });

    earthquakes.addTo(map);
    majorEarthquakes.addTo(map);
});

d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json').then(lineData=>{
    L.geoJson(lineData, {
        color: 'orange',
        weight: 2
    }).addTo(tectonicplates);
    tectonicplates.addTo(map);
});

var legend = L.control({position:'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div','info legend');
    div.innerHTML += '<i style="background:red";>>5</i><br>'
    div.innerHTML += '<i style="background:orange";>>4</i><br>'
    div.innerHTML += '<i style="background:yellow";>>2</i><br>'
    div.innerHTML += '<i style="background:green";>>1</i><br>'
    return div;
};

legend.addTo(map);