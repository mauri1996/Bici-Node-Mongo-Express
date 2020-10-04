var mymap = L.map('main_map').setView([-2.881507, -78.982387], 13);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
          maxZoom: 18
}).addTo(mymap);

//L.marker([-2.883349, -78.990207]).addTo(mymap);
//L.marker([-2.884635, -78.990314]).addTo(mymap);
//L.marker([-2.881507, -90.982387]).addTo(mymap);

$.ajax({
    dataType: "json",
    type: 'GET', 
    url: "api/bicicletas",
    headers: {"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNzY2YTdkNmQxNzA3MjBhYzI0NWY0MiIsImlhdCI6MTYwMTY2MDE0OSwiZXhwIjoxNjAyMjY0OTQ5fQ.7-AEtmnhcRen1kaZkcolUOWQKjbcUYXm7fYu6DP9c9M"},
    //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNzY2YTdkNmQxNzA3MjBhYzI0NWY0MiIsImlhdCI6MTYwMTY2MDE0OSwiZXhwIjoxNjAyMjY0OTQ5fQ.7-AEtmnhcRen1kaZkcolUOWQKjbcUYXm7fYu6DP9c9M",    
    success: function (result, status, xhr){        
        console.log(result);
        result.bicis.forEach(function(bici) {
            L.marker(bici.ubicacion,{title: bici.code ,riseOnHover: true}).addTo(mymap);
        });        
    },
    error: function(jqXhr, textStatus, errorMessage){
        console.log('No se puedo ' +errorMessage );
    }
})