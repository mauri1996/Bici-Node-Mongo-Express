var mymap = L.map('main_map').setView([-2.881507, -78.982387], 13);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
          maxZoom: 18
}).addTo(mymap);

L.marker([-2.881507, -78.982387]).addTo(mymap);
L.marker([-1.881507, -78.982387]).addTo(mymap);
L.marker([-2.881507, -90.982387]).addTo(mymap);