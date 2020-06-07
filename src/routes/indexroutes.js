var express = require('express');
var router = express.Router();
const auth = require("../configuration/authFilter");

// conexion con las interfaces 
const {
    renderIndex,
    renderAbout,
    renderUsuarios,
    renderProveedores,
    renderFactura,
    renderLogin,
    renderLogout
} = require('../controllers/index.controler')

router.use('/Proveedores', auth.filter);
router.use('/Usuarios', auth.filter);
router.use('/Factura', auth.filter);

router.get('/', renderIndex);
router.get('/About', renderAbout);
router.get('/Usuarios', renderUsuarios);
router.get('/Proveedores', renderProveedores);
router.get('/Factura', renderFactura);
router.get('/Login', renderLogin);
router.get('/Logout', renderLogout);

router.use(auth.secureEndpoints);

//exportamos routes
module.exports = router;