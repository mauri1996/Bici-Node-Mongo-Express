var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');
var mongoose = require("mongoose");
const { response } = require("../../app");

describe("Bicicleta API", () => {
    beforeAll((done) => {
        mongoose.connection.close(done);
    });
    beforeEach((done) => {
        var mongoDB = "mongodb://localhost/testdb";
        mongoose.connect(mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "MongoDB conection error: "));
        db.once("open", () => {
            console.log("Conected to test MongoDB");
            done();
        });
    });

    afterEach((done) => {
        Bicicleta.deleteMany({}, (err, suss) => {
            if (err) console.log(err);
            mongoose.disconnect();
            done();
        });
    });

    describe("GET Bicis", () => {
        it("STATUS 200", (done) => {
            request.get('http://localhost:3000/api/bicicletas', (err, res, body) => {
                var result = JSON.parse(body);
                expect(res.statusCode).toBe(200);
                console.log(result);
                expect(result.bicis.length).toBe(0);
                done();
            });
        });
    });

    // describe('CREATE BICICLETAS /', () => {
    //     it('Status 200', (done) => {
    //         let headers = { 'Content-Type': 'application/json' };
    //         let urlToTest = 'http://localhost:3000/api/bicicletas/create';
    //         let aBici = '{ "id": 10, "color": "rojo", "modelo": "urbana", "lat": 55, "lng": 58}';

    //         request.post({
    //             headers: headers,
    //             url: urlToTest,
    //             body: aBici
    //         }, function (error, response, body) {
    //             console.log('entor');
    //             expect(response.statusCode).toBe(200);
    //             //expect(Bicicleta.findById(10).color).toBe("rojo fuego");
    //             done();
    //         });
    //     });
    // });
});


// describe('Bicicleta API',()=>{

//     describe('GET BICICLETAS /', () => {
//         it('Status 200', () => { 
//             //expect(Bicicleta.allBicis.length).toBe(0);
//             var a = new Bicicleta(1, 'azul marino', 'cromada', [-26.1565615,-58.1232934,17]);
//             Bicicleta.add(a);
//             request.get('http://localhost:3000/api/bicicletas', function(error, response, body){
//                 expect(response.statusCode).toBe(200);
//             });
//         });
//     });

//     describe('CREATE BICICLETAS /', () => {
//         it('Status 200', (done) => { 
//             let headers = {'Content-Type': 'application/json'};
//             let urlToTest = 'http://localhost:3000/api/bicicletas/create';
//             let aBici = '{ "id": 10, "color": "rojo fuego", "modelo": "urbana", "lat": 55, "lon": 58}';

//             request.post({
//                 headers: headers,
//                 url: urlToTest,
//                 body: aBici
//             }, function(error, response, body){
//                 expect(response.statusCode).toBe(200);
//                 expect(Bicicleta.findById(10).color).toBe("rojo fuego");
//                 done();
//             });
//         });
//     });
//     describe('DELETE BICICLETAS /', () => {
//         it('Status 200', (done) => { 
//             let headers = {'Content-Type': 'application/json'};
//             let urlToTest = 'http://localhost:3000/api/bicicletas/delete';
//             let aBici = '{ "id": 10}';

//             request.delete({
//                 headers: headers,
//                 url: urlToTest,
//                 body: aBici
//             }, function(error, response, body){
//                 expect(response.statusCode).toBe(204);
//                 expect(Bicicleta.allBicis.length).toBe(1);
//                 done();
//             });
//         });
//     });
//     describe('PUT BICICLETAS /', () => {
//         it('Status 200', (done) => { 
//             const id = 1;
//             let headers = {'Content-Type': 'application/json'};
//             let urlToTest = `http://localhost:3000/api/bicicletas/${id}/update`;
//             let aBici = `{ "id": ${id}, "color": "rojo amarillo", "modelo": "winston", "lat": 55, "lon": 56}`;

//             request.put({
//                 headers: headers,
//                 url: urlToTest,
//                 body: aBici
//             }, function(error, response, body){
//                 expect(response.statusCode).toBe(200);

//                 expect(Bicicleta.findById(1).id).toBe(1);
//                 expect(Bicicleta.findById(1).color).toBe("rojo amarillo");
//                 expect(Bicicleta.findById(1).modelo).toBe("winston");
//                 expect(Bicicleta.findById(1).ubicacion).toEqual([55,56]);
//                 done();
//             });
//         });
//     });
// });