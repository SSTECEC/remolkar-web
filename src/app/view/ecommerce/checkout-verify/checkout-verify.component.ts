import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from 'src/app/method/generic/generic.service';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ScriptService } from 'src/app/services/script/script.service';
import { SessionService } from 'src/app/services/session/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout-verify',
  templateUrl: './checkout-verify.component.html',
  styleUrls: ['./checkout-verify.component.css']
})
export class CheckoutVerifyComponent implements OnInit {

  urls = environment;
  fmrDatosFacturacion = { "idUsuario": 0, "email": "", "rol": "", "estadoUsuario": 0, "idPersona": 0, "tipoIdentificacion": "", "identificacion": "", "nombre": "", "telefono": "", "direccion": "", "estadoPersona": 0, "idCliente": 0, "estadoCliente": "0" }
  usuario: any;
  data: any;
  resourcePath = "";
  itemsCarrito: any = {
    total: 0,
    envio: 0,
    numero: 0,
    lstCarrito: []
  };
  valores = {
    subtotal: 0,
    iva: 0,
    total: 0
  };

  resultadoPago = { "id": "", "paymentType": "", "paymentBrand": "", "amount": "", "currency": "", "descriptor": "", "merchantTransactionId": "", "result": { "code": "", "description": "" }, "resultDetails": { "RiskFraudStatusCode": "", "RequestId": "", "ConnectorTxID1": "", "ReferenceNbr": "", "EXTERNAL_SYSTEM_LINK": "", "OrderId": "", "ExtendedDescription": "", "RiskStatusCode": "", "clearingInstituteName": "", "RiskResponseCode": "", "AcquirerResponse": "", "action": "", "RiskOrderId": "" }, "card": { "bin": "", "binCountry": "", "last4Digits": "", "holder": "", "expiryMonth": "", "expiryYear": "" }, "customer": { "givenName": "", "surname": "", "middleName": "", "merchantCustomerId": "", "phone": "", "email": "", "identificationDocType": "", "identificationDocId": "", "ip": "", "ipCountry": "", "browserFingerprint": { "value": "" } }, "customParameters": { "SHOPPER_VAL_BASEIMP": "", "SHOPPER_EndToEndIdentity": "", "CTPE_DESCRIPTOR_TEMPLATE": "", "SHOPPER_MID": "", "SHOPPER_TID": "", "SHOPPER_VAL_BASE0": "", "SHOPPER_VAL_IVA": "" }, "risk": { "score": "", "parameters": { "USER_DATA2": "" } }, "cart": { "items": [{ "name": "", "description": "", "quantity": "", "price": "" }] }, "buildNumber": "", "timestamp": "", "ndc": "", "recurring": { "numberOfInstallments": 0 } };
  estadoPago = true;
  constructor(private router: Router, public generico: GenericService, public conexion: ApiService, public cart: CartService, private toastr: ToastrService, public session: SessionService, private scripts: ScriptService, private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.usuario = this.session.obtenerDatos();
    this.fmrDatosFacturacion = this.usuario.resultado;
    var datos = this.router.parseUrl(this.router.url);
    this.resourcePath = datos.queryParams["resourcePath"];
    
    console.log(datos.queryParams["resourcePath"]);
    console.log(datos)

    this.verCarrito();
    this.obtenerResultado();
  }

  public obtenerResultado() {
    var datos = {
      resourcePath: this.resourcePath
    };
    this.spinner.show();
    this.conexion.post("obtenerResultado", this.usuario.token, datos).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log(JSON.stringify(res.resultado));
        console.log(res.resultado);

        this.resultadoPago = res.resultado;
        this.estadoPago = this.obtenerEstadoPago();
        console.log(this.estadoPago);

        //this.cart.eliminarCarrito();
        //800.120.100
        //200.300.404
      },
      err => {
        this.spinner.hide();
        this.toastr.warning("Error al obtener los datos de la transacción, intente nuevamente.", "Resultado Pago");
        console.log(err);
      }
    );
  }

  public gestionDetallePago(tipo, path) {

    var detallePago = {
      identificador: 1,
      idDetallePago: 0,
      tipo: tipo,
      ruta: path,
      estado: 1,
      id: '',
      paymentType: '',
      paymentBrand: '',
      merchantTransactionId: '',
      code_: '',
      description: '',
      ReferenceNbr: '',
      AcquirerResponse: '',
      ExtendedDescription: '',
      bin: '',
      binCountry: '',
      last4Digits: '',
      holder: '',
      expiryMonth: '',
      expiryYear: '',
      merchantCustomerId: '',
      recurring: '',
      trama: ''
    }

    this.conexion.post("gestionDetallePago", this.usuario.token, detallePago).subscribe(
      (res: any) => {
        var resultado = res.resultado;
        this.gestionFactura(path, resultado);
      },
      err => {
        this.toastr.warning("Error al ingresar los detalles del apg, intente nuevamente.", "Gestión Detalle Pago");
        console.log(err);
      }
    );
  }

  public gestionFactura(path, idDetallePago) {
    var factura = {
      identificador: 1,
      idFactura: 0,
      codigo: '',
      autorizacion: '',
      fecha: '',
      subtotal12: this.valores.subtotal,
      subtotal0: 0,
      subtotalSinImpuestos: 0,
      descuento: 0,
      ice: 0,
      iva: this.valores.iva,
      total: this.valores.total,
      estado: 1,
      idCliente: this.fmrDatosFacturacion.idCliente,
      idEmpleado: 1,
      idFormaPago: 3,
      idDetallePago: idDetallePago,
      idTaller: 1,
      ruta: path
    };

    this.conexion.post("gestionFactura", this.usuario.token, factura).subscribe(
      (res: any) => {
        var resultado = res.resultado;
        this.getionFacturaDetalle(resultado);
      },
      err => {
        this.toastr.warning("Error al generar ingresar la factura, intente nuevamente.", "Gestión Factura");
        console.log(err);
      }
    );
  }

  public getionFacturaDetalle(idFactura) {

    var query = '';
    for (let carrito of this.itemsCarrito.lstCarrito) {
      query += '(' + carrito.cantidad + ',' + this.obtenerTotalItem(carrito.cantidad, carrito.data) + ',' + carrito.data.idProducto + ',' + idFactura + '),';
    }
    var trama = query.substr(0, query.length - 1);

    this.conexion.post("gestionFacturaDetalle", this.usuario.token, { trama: trama }).subscribe(
      (res: any) => {
        var resultado = res.resultado;
        this.toastr.success("Factura Agregada Exitosamente", "Gestión Factura");
        this.cart.eliminarCarrito();
        window.open(environment.conexionVista + "/", "_self");
      },
      err => {
        this.toastr.warning("Error al generar ingresar el detalle de la factura, intente nuevamente.", "Gestión Detalle Factura");
        console.log(err);
      }
    );
  }


  public verCarrito() {
    this.itemsCarrito = {
      total: this.data.total,
      envio: 0,
      numero: this.cart.obtenerNumeroProductos(),
      lstCarrito: this.cart.verCarrito()
    };
    this.desglosarValores();
  }

  public eliminarCarrito() {
    this.cart.eliminarCarrito();
    this.verCarrito();
  }

  public obtenerTotalItem(cantidad, datos) {
    return this.cart.obtenerTotalItem(cantidad, datos);
  }

  public desglosarValores() {
    this.valores = this.generico.desglosarValores(this.itemsCarrito.total);
  }

  public obtenerPrecio(datos) {
    if (datos.promocion == 1) {
      return datos.precioDescuento;
    } else {
      return datos.precio
    }
  }


  obtenerEstadoPago() {
    var estado = false;
    var filtro = this.urls.verificacionPagoExitoso.filter(e => e == this.resultadoPago.result.code);
    if (filtro.length == 0) {
      estado = false;
    } else {
      estado = true;
    }
    return estado;
  }
}
