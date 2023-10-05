const mongoose = require('mongoose')

async function connect(){
    try{
        mongoose.connect('mongodb://localhost/ecweb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect successfully!!')
    } catch(error){
        console.log('Connect failure!!')
    }
}

module.exports = {connect}
