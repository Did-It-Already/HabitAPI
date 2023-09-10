const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const EstadisticaSchema = new Schema({
    habit_id: { type: Object, required: true },
    date: { type: Date, required: true },
    user_id: { type: Number, required: true }

});
const Estadistica = mongoose.model('estadistica', EstadisticaSchema);
 
module.exports = Estadistica;