const express = require('express')
const mongoose = require('mongoose')
const City = require('./models/City')

const DB_USER = 'prueba'
const DB_PASSWORD = 'prueba'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.json({message: 'Hola Sr. Stark'})
})

app.post('/city', async (req, res) => {
    const{name, mayor, population} = req.body
    if(!name){
        res.status(422).json({error: 'El nombre es obligatorio'})
        return
    }
    const city = {
        name, 
        mayor,
        population,
    }

    try {
        await City.create(city)
        res.status(201).json({ message: 'La ciudad ha sido creada!' })
      
    } catch (error) {
        res.status(500).json({ error: error})
    }
})

app.get('/city', async (req, res) => {
    try {
        const cities = await City.find()
        res.status(200).json(cities)
    } catch (error) {
        res.status(500).json({error:error})
    }
})

app.get('/city/:id', async (req, res) => {
    //console.log(req)
    const id =req.params.id 
    try {
        const city = await City.findOne({_id: id})  
        if(!city){ 
            res.status(422).json({ message: 'Ciudad no encontrada'})
            return
        }
        res.status(200).json(city)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

app.patch('/city/:id', async (req, res) => {
    const id = req.params.id
    const { name, capital, n_habitantes } = req.body
    const city = {
        name,
        capital,
        n_habitantes,
    }
    try {
        const updateCity = await City.updateOne({_id:id},city) 
        if(updateCity.matchedCount === 0){
            res.status(422).json({ message: 'Ciudad no encontrada'})
            return
        }
        res.status(200).json(city) 
    } catch (error) {
        res.status(500).json({error: error}) 
    }
})

app.delete('/city/:id', async (req, res) => {
    const id = req.params.id
    const city = await City.findOne({_id:id})
    if(!city){ 
        res.status(422).json({ message: 'Ciudad no encontrada'})
        return
    }
    try {
        await City.deleteOne({_id:id})
        res.status(200).json({ message: 'Ciudad eliminada'})
    } catch (error) {
        res.status(500).json({ error: error})
    }
})

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@miapi.le36swu.mongodb.net/?retryWrites=true&w=majority`
    ).then(() => {
        console.log('Conectado al mongodb')
        app.listen(5000)
    })
    .catch((err) => {
        console.log(err)
    })