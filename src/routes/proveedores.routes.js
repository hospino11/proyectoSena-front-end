var express = require('express');
var router = express.Router();
// crud 
const {
    crearProveedor,
    renderProveedores,
    renderEditarProveedor,
    renderActualizarProveedor
} = require('../controllers/proveedores.controller');

router.post('/proveedores/new-proveedor', crearProveedor);
router.get('/proveedores/all', renderProveedores);
router.get('/proveedores/edit/:id', renderEditarProveedor);
router.post('/proveedores/actualizar-proveedor', renderActualizarProveedor);
router.use(function(err, req, res, next) {
    if (!err) {
        console.log(err);
    }

    if (err.response.status === 401) {
        res.redirect('/Login');
    } else {
        res.redirect('/Error');
    }
});

module.exports = router