var User = require('../models/usuario');

module.exports = {
    list: function(req, res, next) {
        User.find({}, (err, usuarios) => {
            res.render('usuarios/index', { usuarios: usuarios });
        });
    },

    update_get: function(req, res, next) {
        User.findById(req.params.id, function(err, user) {
            res.render('usuarios/update', { errors: {}, usuario: user });
        });
    },

    update: function(req, res, next) {        
        //console.log(req.params.id);
        console.log(req.body);        
        User.findById(req.params.id, function (err, user) {
            console.log(user);
            user.nombre = req.body.nombre;
            //user.password = user.password;
            user.save();
            res.redirect('/usuarios');
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