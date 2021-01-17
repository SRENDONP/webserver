const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');

app.post('/login',function(req, res){
    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDb) =>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !usuarioDb ){
            return res.status(400).json({
                ok: false,
                message: '(Usuario) o contraseña Incorrectos'
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDb.password )){
            return res.status(400).json({
                ok: false,
                message: 'Usuario o (Contraseña) Incorrectos'
            });
        }

        let token = jwt.sign({
            usuario:usuarioDb
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

        res.json({
            ok:true,
            usuario:usuarioDb,
            token

        })


    });

});

module.exports = app;
