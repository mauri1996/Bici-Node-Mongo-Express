var moongoose = require('mongoose');
var Schema = moongoose.Schema;
/// cb es callback 
var BicicletaSchema =  new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion:{
        type: [Number], index : {type: '2dsphere',sparce : true}
    }     
});


BicicletaSchema.statics.createInstance = function(code, color, modelo , ubicacion){
    const newBici = {
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    };

    return newBici;
};


// BicicletaSchema.statics.createInstance = function(code, color, modelo , ubicacion, timeOut){
//     const newBici = {
//         code: code,
//         color: color,
//         modelo: modelo,
//         ubicacion: ubicacion
//     };

//     timeOut(newBici);

//     return newBici;
// };

BicicletaSchema.methods.toString = function(){
    return 'code: ' + this.code + ' | color: ' + this.color;
};

BicicletaSchema.statics.allBicis = function(cb){
    return this.find({},cb);
};
BicicletaSchema.statics.add = function(aBici,cb){
    // consulta mongoDB
    this.create(aBici,cb);
};

BicicletaSchema.statics.findByCode = function(aCode,cb){
    console.log(aCode);
    return this.findOne({code: aCode},cb);
};

BicicletaSchema.statics.removeByCode = function(aCode,cb){
    
    return this.deleteOne({code: aCode},cb);
};

module.exports = moongoose.model('Bicicleta',BicicletaSchema);



// var Bicicleta = function(id, color, modelo, ubicacion){
//     this.id=id;
//     this.color=color;
//     this.modelo=modelo;
//     this.ubicacion=ubicacion;
// }

// Bicicleta.prototype.toString= function(){
//     return 'id: '+this.id + ' | color: ' + this.color;
// }
// Bicicleta.allBicis =[];
// Bicicleta.add = function(aBici){
//     Bicicleta.allBicis.push(aBici);
// }

// Bicicleta.findById = function(aBiciId){
//     var aBici = Bicicleta.allBicis.find(x=> x.id == aBiciId)
//     if (aBici)
//         return aBici;
//     else    
//         throw new Error (`No existe una bicicleta con el id ${aBiciId}`);
// }

// Bicicleta.removeById = function(aBiciId){
//     for (var i = 0; i < Bicicleta.allBicis.length; i++) {
        
//         if (Bicicleta.allBicis[i].id == aBiciId){
//             Bicicleta.allBicis.splice(i,1);
//             break;
//         }    

//     }
                
// }



// var a = new Bicicleta(1, 'rojo', 'urbana', [-2.883349, -78.990207]);
// var b = new Bicicleta(2, 'blanco', 'urbana', [-2.884635, -78.990314]);

// Bicicleta.add(a);
// Bicicleta.add(b);



//module.exports= Bicicleta;