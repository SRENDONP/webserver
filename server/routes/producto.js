const express = require('express')

const {verificarToken, verificarAdmin_Role} = require ('../middlewares/autenticacion')

let app = express();
let Producto = require('../models/producto')

//==========================
//Obtener productos
//==========================
app.get('/producto', verificarToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Producto.find({disponible: true})
        .skip(desde)
        .limit(limite)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec((err, productos) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                productos
            });
        });
});

//==========================
//Obtener producto por ID
//==========================
app.get('/producto/:id',verificarToken, (req, res) => {

    id = req.params.id;
    Producto.findById(id)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec( (err, productoDB) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ){
            return res.status(400).json({
                ok: false,
                err:{
                    message:"Id Incorrecto"
                }
            });
        }
        res.json({
            ok:true,
            productoDB
        });

    });

})

//==========================
//Buscar Productos
//==========================

app.get('/producto/buscar/:termino',verificarToken, (req, res) => {

    let termino = req.params.termino
    let regex = new RegExp(termino,'i')

    Producto.find({nombre: regex})
        .populate('categoria','descripcion')
        .exec((err, productos)=> {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if( !productos ){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message:"Id Incorrecto"
                    }
                });
            }
            res.json({
                ok:true,
                productos
            });
        })
})

//==========================
//Crear Producto
//==========================
app.post('/producto', verificarToken, (req, res) => {
    //grabar el usuario
    //grabar la categoria
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            producto:productoDB
        });
    });

})

//==========================
//Actualizar producto
//==========================
app.put('/producto/:id',verificarToken, (req, res) => {
    let id = req.params.id
    let body = req.body;

    let updateProduct = {
        nombre:body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        categoria:body.categoria
    };

    Producto.findByIdAndUpdate(id, updateProduct, {new:true, runValidators:true}, (err, productoDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado con id ingresado'
                }
            });
        }

        if( !productoDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            producto:productoDB
        });
    });

})

//==========================
//Eliminar producto
//==========================
app.delete('/producto/:id',verificarToken, (req, res) => {
    let id = req.params.id;

    let disableProduct = {
        disponible:false
    };

    Producto.findByIdAndUpdate(id,disableProduct,[verificarToken, verificarAdmin_Role], (err, productoDB) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message:'Producto con ID ingresado no existe'
                }
            });
        }
        res.json({
            ok:true,
            message: "Producto Elimanado"
        });
    })

})


module.exports = app;
