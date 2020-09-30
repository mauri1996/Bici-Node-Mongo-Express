var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = async (req, res) => {
    await Bicicleta.find({}, (err, bicis) => {
      res.status(200).json({
        bicis,
      });
    });
  };
  
  exports.bicicleta_create = async (req, res) => {
    
    var bike = new Bicicleta({
      code: req.body.id,
      color: req.body.color,
      model: req.body.model,
      ubicacion: [req.body.lat, req.body.lng],
    });
    await bike.save((err) => {
      res.status(200).json(bike);
    });
  };
  
  exports.bicicleta_delete = function (req, res) {
    Bicicleta.removeById(req.body.id);
    res.status(204).send();
  };



///////// code antiguo 
// var Bicicleta = require('../../models/bicicleta');

// // funcion antigua sin callback
// // exports.bicicleta_list= function(req,res){
// //     res.status(200).json({
// //         bicicleta: Bicicleta.allBicis
// //     });
// // }

// exports.bicicleta_list = function (req,res){
//     Bicicleta.allBicis(function(err,bicis){
//         res.status(200).json({Bicicletas:bicis});
//     })
// }


// exports.bicicleta_create= function(req,res){
//     var bici = new Bicicleta(req.body.id , req.body.color, req.body.modelo);    
//     bici.ubicacion = [req.body.lat, req.body.lng];

//     Bicicleta.add(bici);

//     res.status(200).json({
//         bicicleta: bici
//     });

// }

// exports.bicicleta_delete= function(req,res){
//     Bicicleta.removeById(req.body.id)
//     res.status(204).send();
// }