var Usuario = require("../../models/usuario");

exports.usuarios_list = async (req, res) => {
  await Usuario.find({}, (err, usuarios) => {
    res.status(200).json({
      usuarios: usuarios
    });
  });
};

exports.usuarios_create = async (req, res) => {
  var usuario = new Usuario({ nombre: req.body.nombre });
  await usuario.save((err) => {
    res.status(200).json(usuario);
  });
};

exports.usuarios_reservar = async (req, res) => {  
  await Usuario.findById(req.body.id, (err, usuario) => {
    console.log(usuario);
    usuario.reservar(req.body.bici_Id, req.body.desde, req.body.hasta, (err) => {
      console.log("Reservado!!!");
      res.status(200).send();
    });
  });
};