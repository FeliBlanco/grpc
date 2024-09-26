import mongoose from 'mongoose'

async function ConectarDB(){
    try {
        await mongoose.connect('mongodb://localhost:27017/tasks');
    }
    catch(err) {
        console.log("ERROR BASE DE DATOS")
    }
}

export default ConectarDB;