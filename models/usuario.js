var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var saltRounds = 10;


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
        required: [true, 'El nombre es obligatorio'],
        lowercase:true,
        validate: [validateEmail,'Por favor ingrese un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/]
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

module.exports = mongoose.model('Usuario',usuarioSchema);