const facturaCtrl = {};
const rest = require('../configuration/rest');

// crear inventario y renderiza una nueva pagina 
facturaCtrl.renderFactura = async(req, res, next) => {
    var codigoBarras;
    var cantidadProductos = 0;

    if (req.body.codigoBarras) {
        if (Array.isArray(req.body.codigoBarras)) {
            var index = 0;
            cantidadProductos = req.body.productoNombre.length;

            for(let i = 0, length1 = cantidadProductos; i < length1; i++){
                if (req.body.productoNombre[i] === '') {
                    index = i;
                    break;
                }
            }

            codigoBarras = req.body.codigoBarras[index];
        } else {
            codigoBarras = req.body.codigoBarras;
            cantidadProductos = 1;
        }
    }

    rest.get(req, '/api/v1/inventario/' + codigoBarras)
    .then(result => {
        var productos = [];

        for(let k = 0; k < cantidadProductos - 1; k++){
            var productoCompra = {
                producto: {
                    nombre: req.body.productoNombre[k],
                    id: req.body.productoId[k]
                },
                cantidadCompra: req.body.cantidadCompra[k],
                codigoBarras: req.body.codigoBarras[k]
            };
            productos[k] = productoCompra;
        }

        result.data.cantidadCompra = 1;
        result.data.codigoBarras = codigoBarras;

        productos[cantidadProductos] = result.data;

        var defaultProducto = {};
        productos[cantidadProductos + 1] = defaultProducto;

        res.render('Factura', { numeroRemision: req.body.numeroRemision, productos: productos });
    })
    .catch(err => {
        console.log(err);

        var errorMessage;
        if (err.response && err.response.status && err.response.status === 400) {
            errorMessage = 'Parámetros inválidos';
        } else if (err.response && err.response.status && err.response.status === 404 
            && err.response.data && err.response.data.codigo === '40400') {
            errorMessage = 'Producto no existe';
        } else if (err.response && err.response.status && err.response.status === 401) {
            return next(err);
        } else {
            errorMessage = 'Error en la operación';
        }

        var productos = [];

        for(let k = 0; k < cantidadProductos - 1; k++){
            var productoCompra = {
                producto: {
                    nombre: req.body.productoNombre[k],
                    id: req.body.productoId[k]
                },
                cantidadCompra: req.body.cantidadCompra[k],
                codigoBarras: req.body.codigoBarras[k]
            };
            productos[k] = productoCompra;
        }

        var defaultProducto = { codigoBarras: codigoBarras };
        productos[cantidadProductos] = defaultProducto;

        res.render('Factura', {
            numeroRemision: req.body.numeroRemision, 
            productos: productos,
            modalCompleteMessage: errorMessage,
            modalCompleteTitle: 'Error',
            usuario: req.body
        });
    });
};

// exportamos el modelo de las notas 
module.exports = facturaCtrl;