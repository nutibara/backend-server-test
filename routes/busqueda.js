// Requires
var express = require('express');

// Inicializar variables
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ================================================
// Busqueda por coleccion
// ================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex)
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Coleccion no valida: hospitales, medicos y usuarios',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
    // if (tabla === 'hospital') {
    //     buscarHospitales(busqueda, regex)
    //         .then(hospitales => {
    //             res.status(200).json({
    //                 ok: true,
    //                 hospitales
    //             });
    //         });
    // } else if (tabla === 'medico') {
    //     buscarMedicos(busqueda, regex)
    //         .then(medicos => {
    //             res.status(200).json({
    //                 ok: true,
    //                 medicos
    //             });
    //         });
    // } else if (tabla === 'usuario') {
    //     buscarUsuarios(busqueda, regex)
    //         .then(usuarios => {
    //             res.status(200).json({
    //                 ok: true,
    //                 usuarios
    //             });
    //         });
    // } else {
    //     return res.status(400).json({
    //         ok: false,
    //         mensaje: 'Coleccion no valida'
    //     });
    // }
});

// ================================================
// Busqueda general
// ================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex),
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });

});

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });
    });
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }

            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });
    });
}

module.exports = app;