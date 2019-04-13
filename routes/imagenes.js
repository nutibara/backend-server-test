// Requires
var express = require('express');

// Inicializar variables
var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (!fs.existsSync(pathImagen)) {
        pathImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
    }

    res.sendFile(pathImagen);

});

module.exports = app;