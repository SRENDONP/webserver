require('./config/config');


const express = require('express')
const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//Peticion Get de Usuarios
app.get('/usuario', function (req, res) {
    res.json("Get de usuario")
});

//Peticion Post de Usuarios
app.post('/usuario', function (req, res) {
    let body = req.body;

    if(body.nombre === undefined){
        res.status(400).json({
            OK: false,
            mensaje: "El nombre es necesario"
        })
    }else{
        res.json({persona : body})
    }


});

//Peticion Put de Usuarios
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

//Peticion Delete de Usuarios
app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
});


app.listen(process.env.PORT)
