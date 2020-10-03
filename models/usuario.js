var mongoose = require('mongoose');
var Reserva = require('./reserva');
var uniqueValidator = require('mongoose-unique-validator'); // libreria instalada
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt'); // libreria instalada para encriptar
var crypto = require('crypto');
var saltRounds = 10;

const Token = require('../models/token');
const mailer = require('../mailer/mailer'); // libreria instalada para enviar mensajes

const validateEmail = function(email){
    const re= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/;
    return re.test(email);
}

var usuarioSchema = new Schema({
    nombre:{
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email:{
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase:true,
        unique:true,
        //validate: [validateEmail,'Por favor ingrese un email valido'],
        //match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
        unique:true
    },
    password:{
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    passwordResetToken:String,
    passwordResetTokenExpire:Date,
    verificado:{
        type: Boolean,
        default:false
    }
});
// plugin necesario para verificar q el email sea unico
usuarioSchema.plugin(uniqueValidator,{message:'El {PATH} ya existe con otro USUARIO'});

usuarioSchema.pre('save',function(next){
    if (this.isModified('password')){
        this.password = bcrypt.hashSync(this.password,saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}


usuarioSchema.methods.reservar = function (biciId,desde,hasta,cb){
    var reserva = new Reserva ({usuario: this._id,bicicleta: biciId, desde: desde,hasta:hasta});
    console.log(reserva);
    reserva.save(cb);
};

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({
        _userId: this.id,
        token: crypto.randomBytes(16).toString('hex')
    });
    const emailDestination = this.email;
    
    token.save(function(err) {
        if (err) {
            return console.log(err.message);
        }

        const mailOptions = {
            from: 'no-reply@bicicletas.com',
            to: emailDestination,
            subject: 'Account Verification',
            text: 'Hola,\n\n' + 'Please, to verify your account, click on the following link:\n\n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) {
                return console.log(err.message);
            }

            console.log('Email send to ' + emailDestination + '.');
        });
    });    
};
usuarioSchema.methods.resetPassword = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err) {
        if (err) { return cb(err); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password',
            text: 'Hola,\n\n' + 'Por favor, para resetear el password de su cuenta haga click en este link:\n' + 'http://localhost:3000' + '\/resetPassword\/' + token.token + '\n'
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) { return cb(err); }
            console.log('Se envio un email para resetear el password a: ' + email_destination + '.');
        });

        cb(null);
    });
};
usuarioSchema.statics.findOneOrCreatebyGoogle = function findOneOrCreate( condition, callback){
    const self =this;
    console.log('-------- CONDITION **********');
    console.log(condition);
    self.findOne({
        $or:[
            {'googleId':condition.id},{'email':condition.emails[0].value}
        ]}, (err, result) =>{
            if(result){
                callback(err,result);
            }else{
                console.log('-------- CONDITION --------');
                console.log(condition);
                let values = {};
                values.googleId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || 'Sin Nombre';
                values.verificado = true;
                values.password = 'condition._json.etag';
                console.log('-------- VALUES --------');
                console.log(values);
                self.create(values , (err,result)=>{
                    if(err) {console.log(err);}
                    return callback(err,result)
                })
            }
    })

};



module.exports = mongoose.model('Usuario',usuarioSchema);