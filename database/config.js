const mongoose = require('mongoose');

const dbConnection=async()=>{
    
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useCreateIndex:true,
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify:false
        });
        console.log('db Online')
    } catch (error) {
        console.log(error)
        throw new Error('error al inicializar la base de datos')
    }
}

module.exports={dbConnection}