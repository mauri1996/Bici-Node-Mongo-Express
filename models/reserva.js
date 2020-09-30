var mongoose = require('mongoose');
var Reserva = require('moment');
var Schema = mongoose.Schema;

var reservarSchema =  new Schema({
    desde: Date,
    hasta: Date,
    bicicleta: {type: mongoose.Schema.Types.ObjectId,ref:'Bicicletas'},
    usuario: {type: mongoose.Schema.Types.ObjectId,ref:'Usuario'}

});

reservarSchema.methods.diasDeReserva = function(){
    return moment(this.hasta).diff(moment(this.desde),'days')+1;
}

module.exports = mongoose.model('Reserva',reservarSchema);