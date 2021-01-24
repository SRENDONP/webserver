require('./config/config');


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const {MongoClient} = require('mongodb');

const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Habilitar el public
app.use(express.static(path.resolve( __dirname, '../public')));

//Configuracion global de rutas
app.use(require('./routes/index'));



async function main(){

    const uri = "mongodb+srv://srendon:CxVy1LVi7YFk8G1@cluster0-b9m4c.mongodb.net/cafe"

    const client = new MongoClient(uri)


    try {
        await client.connect();
        await listDatabases(client);
        mongoose.connect('mongodb+srv://srendon:CxVy1LVi7YFk8G1@cluster0-b9m4c.mongodb.net/cafe',{useNewUrlParser: true, useCreateIndex: true});
        console.log("Conexion a base de datos exitosa ")
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


app.listen(process.env.PORT)
