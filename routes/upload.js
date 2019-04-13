// Requires
var express = require('express');

var fs = require('fs');

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

var fileUpload = require('express-fileupload');

// Inicializar variables
var app = express();

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Coleccion no valida',
            errors: { message: 'Las colecciones validas son ' + tiposValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extArchivo = nombreCortado[nombreCortado.length - 1];

    //Solo estas extensiones aceptamos
    var extValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extValidas.indexOf(extArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son ' + extValidas.join(', ') }
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extArchivo}`;

    //Mover el archivo del temporal a un path especifico
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = `./uploads/${tipo}/${usuario.img}`;

            //Si existe elimina el archivo anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al eliminar archivo',
                            errors: err
                        });
                    }
                });
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                }

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });

        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = `./uploads/${tipo}/${hospital.img}`;

            //Si existe elimina el archivo anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al eliminar archivo',
                            errors: err
                        });
                    }
                });
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });

            });

        });
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });
            }

            var pathViejo = `./uploads/${tipo}/${medico.img}`;

            //Si existe elimina el archivo anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al eliminar archivo',
                            errors: err
                        });
                    }
                });
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar medico',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });

            });

        });
    }
}

module.exports = app;