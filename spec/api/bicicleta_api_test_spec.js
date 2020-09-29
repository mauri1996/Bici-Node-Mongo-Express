var Bicicleta = require('../../models/bicicleta');

var request = require('request');
var server = require('../../bin/www');

describe('Bicicleta API',()=>{
    describe('GET Bicicletas /',()=>{
        it('Status 200',()=>{
            expect(Bicicleta.allBicis.length).toBe(0);
            var a = new Bicicleta(1, 'rojo', 'urbana', [-2.883349, -78.990207]);
            Bicicleta.add(a);

            request.get('http://localhost:3000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
            });

        });
    });

    describe('POST Bicicletas /create',()=>{
        it('Status 200',(done)=>{
            var headers = {'content-type':'application/json'};            
            var a = '{"id": 10, "color":"rojo","modelo":"urbana", "lat" : -2.883349,"lng": -78.990207}'; // pasar como string 
            request.post({
                headers:headers,
                url:'http://localhost:3000/api/bicicletas/create',
                body: a
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(10).color).toBe('rojo');
                done();
            });

        });
    });
});