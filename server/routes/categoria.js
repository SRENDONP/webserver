const express = require('express');

let { verificarToken, verificarAdmin_Role } = require('../middlewares/autenticacion')

let app = express();

let Categoria = require('../models/categoria');

//=============================
//Mostrar Todas las Categorias
//=============================
app.get('/categoria',verificarToken,(req, res)=>{
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err, categorias) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                categorias
            })
        })

});


//=============================
//Mostrar categoria por ID
//=============================
app.get('/categoria/:id',verificarToken, (req,res)=>{

    id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err:{
                    message:"Id Incorrecto"
                }
            });
        }
            res.json({
                ok:true,
                categoriaDB
            });

    });
});


//=============================
//Crear Nueva Categoria
//=============================
app.post('/categoria', verificarToken, (req,res)=>{
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })
    });

});


//=============================
//Actualizar Categoria
//=============================
app.put('/categoria/:id',verificarToken, (req,res)=>{
    let id = req.params.id
    let body = req.body;

    let descCategoria = {
        descripcion:body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, {new:true, runValidators:true}, (err, categoriaDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        });
    });
});

//=============================
//Eliminar Categoria
//=============================
app.delete('/categoria/:id', (req,res)=>{
 let id = req.params.id;

 Categoria.findByIdAndRemove(id,[verificarToken, verificarAdmin_Role], (err, categoriaDB) => {
     if( err ){
         return res.status(500).json({
             ok: false,
             err
         });
     }

     if( !categoriaDB ){
         return res.status(400).json({
             ok: false,
             err: {
                 message:'Categoria con ID ingresado no existe'
             }
         });
     }
     res.json({
         ok:true,
         message: "Categoria Elimanada"
     });
 })
})

module.exports = app;
