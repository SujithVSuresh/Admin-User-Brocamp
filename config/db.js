const mongoose = require('mongoose')


const uri = 'mongodb://localhost:27017/week06'

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology:true})

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function(){
    console.log('Connected to MongoDB');
})

module.exports = db;