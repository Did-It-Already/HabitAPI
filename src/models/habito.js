const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const HabitoSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    start_date: { type: Date, required: true },
    frequency: { type: Number, required: true },
    is_done: { type: Boolean, required: true },
    user_id: { type: Number, required: true },
    number_of_times: { type: Number, required: true }

});
const Habito = mongoose.model('habito', HabitoSchema);
 
module.exports = Habito;