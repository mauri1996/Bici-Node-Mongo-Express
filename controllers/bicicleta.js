var Bicicleta = require('../models/bicicleta')

exports.bicicleta_list = function(req,res){ 
    Bicicleta.allBicis(function (error, result) {
        res.render('bicicletas/index', {
          bicis: result
        });
    });
}

exports.bicicleta_create_get = function(req,res){
    res.render('bicicletas/create');
}


exports.bicicleta_create_post = function(req,res){
    var bici = Bicicleta.createInstance(req.body.code, req.body.color, req.body.modelo);    
    bici.ubicacion = [req.body.lat, req.body.lng];
    //console.log(bici);
    Bicicleta.add(bici);
    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function (req, res) {
    //console.log(req.params);
    Bicicleta.removeById(req.params.id, function (err) {
      res.redirect('/bicicletas');
    });
  };

exports.bicicleta_update_get = function(req,res){
    //console.log(req.params);
    Bicicleta.findById(req.params.id, function (err, bici) {
        res.render('bicicletas/update',{bici});
      });
    
}

exports.bicicleta_update_post = function (req, res) {
    console.log(req.body);
    Bicicleta.findById(req.params.id, function (err, bici) {
      bici.color = req.body.color;
      bici.modelo = req.body.modelo;
      bici.ubicacion = [req.body.lat, req.body.lng];
      bici.save();
  
      res.redirect('/bicicletas');
    });
};
