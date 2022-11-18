const mongoose = require('mongoose')

const City = mongoose.model('City', {
    name: String,
    mayor: String,
    population: Number,
})

module.exports = City