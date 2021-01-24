const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//=========================
//configuraciones de google
//=========================


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend

    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img : payload.picture,
        google: true

    }

}


app.post('/google', async(req, res)=>{

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err:e
            });
        });

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB){
            if (usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:"Debe usar su autenticacion normal"
                    }
                });
            }else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                });
            }
        }else{
            //Si el Usuario no existe en la base de datos

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email            ;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password= ':)';

            usuario.save((err, usuarioDB) => {
                if( err ){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                });
                }
            });

        }

    });



})


module.exports = app;
