var mongoose = require('mongoose')

var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');


describe('Testing Bicicletas',function(){


    beforeEach(function(done) {

        let mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function(){
            console.log('Estamos conectados a la Base de Datos');
            done();
        });  
    });

    afterEach(function(done){
        Reserva.deleteMany({},function(err,success){
            if (err) console.log(err);
            Usuario.deleteMany({},function(err,success){
                if (err) console.log(err);
                Bicicleta.deleteMany({},function(err,success){
                    if (err) console.log(err);
                    done();
                    mongoose.disconnect();

                });
            });
            //console.log('Borrado con exito');
            //done();
            //mongoose.disconnect();
        });
        //mongoose.disconnect();
    });

    describe('Bicicleta.createInstance',()=>{
        it('Crear una instancia de una bicicleta',()=>{
            var bici = Bicicleta.createInstance(1,"verde","urbana",[-12,22]);
            expect(bici.code).toBe(1);
            expect(bici.color).toBe('verde');
            expect(bici.modelo).toBe('urbana');
            expect(bici.ubicacion[0]).toEqual(-12);
            expect(bici.ubicacion[1]).toEqual(22);
            //console.log('Termino create');
        });
    });

    describe('Bicicletas.allBicis',()=>{
        it('comienza vacia', (done)=>{
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta.add',()=>{
        it('Agregar 1 bici',(done)=>{
            var abici = new Bicicleta({code : 1,color: "verde",modelo:"urbana"});
            
            Bicicleta.add(abici,function(err,newBici){
                //console.log('entro');
                if (err) console.log(err);
                Bicicleta.allBicis(function(err,bicis){
                   // console.log('entro_2');
                    expect(bicis.length).toBe(1);
                    expect(bicis[0].code).toEqual(abici.code);

                    done();
                });
            });


        });
    });

    describe('Bicicleta.findByCode',()=>{
        it('Debe devolver la bici de Code 1',(done)=>{
            Bicicleta.allBicis(function(err,bicis){
                expect(bicis.length).toBe(0);
                var abici = Bicicleta.createInstance(1,"verde","urbana",[-12,22]);
            
                Bicicleta.add(abici,function(err){
                    
                    if (err) console.log(err);
                    var abici2 = Bicicleta.createInstance(2,"roja","montaña",[-12,22]);
                    
                    Bicicleta.add(abici2,function(err){
                        
                        if (err) console.log(err);

                        Bicicleta.findByCode(abici.code,function(err,targetBici){
                            if (err) console.log(err);
                            //console.log('entro2');
                            console.log('Estamos buscando la bici...', abici);
                            expect(targetBici.code).toBe(abici.code);
                            expect(targetBici.color).toBe(abici.color);
                            expect(targetBici.modelo).toBe(abici.modelo);        

                            done();
                        });

                    });
                });

            });

        });
        
    });

    describe('Cuando un usuario reserva 1 bici',()=>{
        it('Debe existir 1 reserva',(done)=>{
            const usuario = new Usuario({nombre: "Exequiel"});
            usuario.save();
            const bicicleta = new Bicicleta({code:1,color:"verde",modelo: "urabana"});
            bicicleta.save();

            var hoy =  new Date();
            var mañana =  new Date();

            mañana.setDate(hoy.getDate()+1);
            
            usuario.reservar(bicicleta.id,hoy,mañana,function(err,reserva){
                //console.log(Reserva.find({}).populate('bicicleta').populate('usuario').exec(function( err,reservas){}));
                
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err,reservas){
                    //console.log('entro');
                    console.log(reservas);
                    //console.log(reservas.length);
                    //console.log(reservas[0].diasDeReserva());
                    //console.log(reservas[0].bicicelta.code);
                    //console.log(reservas[0].usuario.nombree);
                    //expect(reservas.length).toBe(1);
                    //expect(reservas[0].diasDeReserva()).toBe(2);
                    //expect(reservas[0].bicicelta.code).toBe(1);
                    //expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                });
            });

        });
    });


});






















// // Hace esto antes de cada describe resetea la columna
// beforeEach(()=>{Bicicleta.allBicis=[];});
// //beforeEach(()=>{console.log('testeando...');});

// describe('Bicicletaa.allBicis',()=>{
//     it('comienza vacio',()=>{
//         expect(Bicicleta.allBicis.length).toBe(0);
//     });
// });

// describe('Bicicleta.add',()=>{
//     it('Agregar 1 bici',()=>{
//         expect(Bicicleta.allBicis.length).toBe(0);
//         var a = new Bicicleta(1, 'rojo', 'urbana', [-2.883349, -78.990207]);
//         Bicicleta.add(a);
//         expect(Bicicleta.allBicis.length).toBe(1);
//         expect(Bicicleta.allBicis[0]).toBe(a);
//     });
// });

// describe('Bicicleta.finById',()=>{
//     it('Debe devovler la bici con ID 1',()=>{

//         expect(Bicicleta.allBicis.length).toBe(0);
//         var a = new Bicicleta(1, 'rojo', 'urbana', [-2.883349, -78.990207]);
//         var b = new Bicicleta(2, 'blanco', 'montaña', [-2.883349, -78.990207]);
//         Bicicleta.add(a);
//         Bicicleta.add(b);

//         var biciBuscada = Bicicleta.findById(1);

//         expect(biciBuscada.id).toBe(1);
//         expect(biciBuscada.color).toBe(a.color);
//         expect(biciBuscada.modelo).toBe(a.modelo);


//     });
// });


