var User = require('../models/usuario');

module.exports = {
    list: function(req, res, next) {
        User.find({}, (err, usuarios) => {
            res.render('usuarios/index', { usuarios: usuarios });
        });
    },

    update_get: function(req, res, next) {
        User.findById(req.params.id, function(err, user) {
            res.render('usuarios/update', { errors: {}, usuario: usuario });
        });
    },

    update: function(req, res, next) {
        let update_values = { nombre: req.body.nombre };
        User.findByIdAndUpdate(req.params.id, update_values, function(err, user) {
            if (err) {
                console.log(err);
                res.render('usuarios/update', {
                    errors: err.errors,
                    user: new User({
                        nombre: req.body.nombre,
                        email: req.body.email,
                    }),
                });
            } else {
                res.redirect('/usuarios');
                return;
            }
        });
    },

    create_get: function(req, res, next) {
        res.render('usuarios/create', { errors: {}, usuario: new User() });
    },

    create: function(req, res, next) {
        if (req.body.password != req.body.confirm_password) {
            res.render('usuarios/create', {
                errors: {
                    confirm_password: { message: 'The contraseña esta incorrecta' },
                },
                usuario: new User({ 
                    nombre: req.body.nombre, 
                    email: req.body.email 
                }),
            });
            return;
        }

        User.create({
                nombre: req.body.nombre,
                email: req.body.email,
                password: req.body.password,
            }, function(err, newUser) {
                if (err) {
                    res.render('usuarios/create', {
                        errors: err.errors,
                        usuario: new User({
                            nombre: req.body.nombre,
                            email: req.body.email,
                        })
                    });
                } else {
                    newUser.enviar_email_bienvenida();
                    res.redirect('/usuarios');
                }
            }
        );
    },
    
    delete: function(req, res, next) {
        User.findByIdAndDelete(req.body.id, function(err) {
            if (err) next(err);
            else res.redirect('/usuarios');
        });
    },
};