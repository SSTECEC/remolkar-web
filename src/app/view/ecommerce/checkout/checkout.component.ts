import { Renderer2, Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from 'src/app/method/generic/generic.service';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { SessionService } from 'src/app/services/session/session.service';
import { ScriptService } from 'src/app/services/script/script.service';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  urls = environment;
  fmrDatosFacturacion = { "idUsuario": 0, "email": "", "rol": "", "estadoUsuario": 0, "idPersona": 0, "tipoIdentificacion": "", "identificacion": "", "nombre": "", "telefono": "", "direccion": "", "estadoPersona": 0, "idCliente": 0, "estadoCliente": "0" }

  panelesCompra = {
    panel1: true,
    panel2: false,
    panel3: false
  }

  panelProgreso = {
    panel1: false,
    panel2: false,
    panel3: false
  }

  usuario: any;

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

  url = "";
  checkoutid = "";

  data: any;

  idFormaPago = -1;
  pago: any = { "idFormaPago": 0, "tipo": "0", "nombre": "", "foto": null, "estado": 0, "tipoCuenta": null, "numeroCuenta": null, "bancoCuenta": null, "identificacionCuenta": null, "nombreCuenta": null };
  lstFormasPago = [];
  comprobante: any;
  img: any;
  urlRetorno = this.urls.conexionVista;
  tipoTarjeta = 0;
  tipoCredito = 0;
  banco = 0;

  constructor(private router: ActivatedRoute, public generico: GenericService, public conexion: ApiService, public cart: CartService, private toastr: ToastrService, public session: SessionService, private scripts: ScriptService, private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.usuario = this.session.obtenerDatos();
    console.log(this.usuario)
    this.fmrDatosFacturacion = this.usuario.resultado;
    this.data = JSON.parse(atob(this.router.snapshot.params.data));

    this.verCarrito();
    this.listarFormasPago();

  }

  public listarFormasPago() {
    this.conexion.get("listarFormasPago", "").subscribe(
      (res: any) => {
        this.lstFormasPago = res.resultado;
      },
      err => {
        console.log(err);
      }
    );
  }

  public informacionFacturacion() {
    if (this.fmrDatosFacturacion.tipoIdentificacion.trim() == "") {
      this.toastr.warning('Seleccionar tipo de identificación', 'Datos Facturación');
    } else if (this.fmrDatosFacturacion.identificacion.trim() == "") {
      this.toastr.warning('Ingresar número de identificación', 'Datos Facturación');
    } else if (this.generico.validarIdentificacion(this.fmrDatosFacturacion.tipoIdentificacion, this.fmrDatosFacturacion.identificacion) == false) {
      this.toastr.warning('Ingresar número de identificación válido', 'Datos Facturación');
    } else if (this.fmrDatosFacturacion.nombre.trim() == "") {
      this.toastr.warning('Ingresar nombre', 'Datos Facturación');
    } else if (this.fmrDatosFacturacion.direccion.trim() == "") {
      this.toastr.warning('Ingresar dirección', 'Datos Facturación');
    } else if (this.fmrDatosFacturacion.telefono.trim() == "") {
      this.toastr.warning('Ingresar número de teléfono', 'Datos Facturación');
    } else if (this.generico.validarTelefonoCelular(this.fmrDatosFacturacion.telefono) == false) {
      this.toastr.warning('Ingresar número de teléfono válido', 'Datos Facturación');
    } else {
      this.actualizarDatosCliente();
    }
  }

  public actualizarDatosCliente() {
    var cliente = {
      identificador: 2,
      idCliente: this.fmrDatosFacturacion.idCliente,
      tipoIdentificacion: this.fmrDatosFacturacion.tipoIdentificacion,
      identificacion: this.fmrDatosFacturacion.identificacion,
      nombre: this.fmrDatosFacturacion.nombre,
      telefono: this.fmrDatosFacturacion.telefono,
      direccion: this.fmrDatosFacturacion.direccion,
      email: this.fmrDatosFacturacion.email
    }
    this.spinner.show();
    this.conexion.post("gestionCliente", this.usuario.token, cliente).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.panelesCompra.panel2 = true;
        this.panelProgreso.panel1 = true;
        console.log(res.resultado);
      },
      err => {
        this.spinner.hide();
        this.toastr.warning("Error al actualizar la información de facturación, intente nuevamente.", "Información de Facturación");
        console.log(err);
      }
    );
  }

  public resumenCompra() {
    this.panelesCompra.panel3 = true;
  }

  public generarCheckoutId() {

    var datos = {
      subtotal: this.generico.redondear(this.valores.subtotal),
      iva: this.generico.redondear(this.valores.iva),
      total: this.generico.redondear(this.valores.total),
      primerNombre: "",
      segundoNombre: "",
      apellido: this.fmrDatosFacturacion.nombre,
      idCliente: this.fmrDatosFacturacion.idCliente,
      idTransaccion: this.fmrDatosFacturacion.idCliente + "" + this.fmrDatosFacturacion.idUsuario + "" + this.fmrDatosFacturacion.idPersona + this.generico.obtenerHora(""),
      email: this.fmrDatosFacturacion.email,
      identificacion: this.fmrDatosFacturacion.identificacion,
      nombreProducto: "LOTE PRODUCTOS " + this.fmrDatosFacturacion.idCliente + this.fmrDatosFacturacion.idUsuario + this.fmrDatosFacturacion.idPersona,
      telefono: this.fmrDatosFacturacion.telefono,
      direccion: this.fmrDatosFacturacion.direccion,
    };

    console.log(datos);
    this.spinner.show();
    this.conexion.post("obtenerChekoutId", this.usuario.token, datos).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log(res.resultado);
        var resultado = res.resultado;
        this.checkoutid = resultado.id;
        this.panelesCompra.panel3 = true;
        this.url = environment.conexionDatafast + this.checkoutid;
        this.scripts.inicializarScriptsDatafast(this.checkoutid);
        this.cargarScriptFormularioDatafast(this.checkoutid);

      },
      err => {
        this.spinner.hide();
        this.toastr.warning("Error al generar el formulario de pago, intente nuevamente.", "Formulario Pago");
        console.log(err);
      }
    );
  }

  public cargarScriptFormularioDatafast(checkoutId) {
    this.removerScriptsVarios();
    this.scripts.removerScriptsCss(this.urls.conexionDatafast + checkoutId, "js");
    this.scripts.removerScriptsCss("card-datafast.js", "js");

    this.scripts.cargarScriptsDinamicamente('checkoutId-datafast', 'card-datafast').then(data => {

      setTimeout(() => {

        $("input[name='card.holder']").val(this.fmrDatosFacturacion.nombre);
        console.log(this.tipoTarjeta)
        if (this.tipoTarjeta == 1) {
          $("#tipoCredito").empty();
          $("#tipoCredito").append('<option value="00">Corriente</option>');
          $("#tipoCredito").val("00");

          $("#diferidos").empty();
          $("#diferidos").append('<option value="0">Corriente</option>');
          $("#diferidos").val("0");
        } else if (this.tipoTarjeta == 2) {

          if (this.banco == 5) {
            $("#tipoCredito").empty();
            $("#tipoCredito").append('<option value="00">Corriente</option>');
            $("#tipoCredito").val("00");

            $("#diferidos").empty();
            $("#diferidos").append('<option value="0">Corriente</option>');
            $("#diferidos").val("0");
          } else {

            $("#tipoCredito").empty();
            var tipo = '<option value="-1"></option>' + '<option value="00">Corriente</option>' + '<option value="02">Diferido Con Intereses</option>' + '<option value="03">Diferido Sin Intereses</option>';
            $("#tipoCredito").append(tipo);

            $("#tipoCredito").change(function () {

              if ($("#tipoCredito").val() == "03") {
                $("#diferidos").empty();
                var diferidos =
                  '<option value="3">3 Meses Sin Intereses</option>' +
                  '<option value="6">6 Meses Sin Intereses</option>';
                $("#diferidos").append(diferidos);
              } else if ($("#tipoCredito").val() == "02") {
                $("#diferidos").empty();
                var diferidos =
                  '<option value="3">3 Meses Con Intereses</option>' +
                  '<option value="6">6 Meses Con Intereses</option>' +
                  '<option value="9">9 Meses Con Intereses</option>' +
                  '<option value="12">12 Meses Con Intereses</option>';
                $("#diferidos").append(diferidos);
              } else {
                $("#diferidos").empty();
                $("#diferidos").append('<option value="0">Corriente</option>');
                $("#diferidos").val("0");
              }

            });
          }


        }


        /* $("#token").prop("checked", true);
         $("#diferidos").change(function () {
 
           console.log($("#tipoCredito").val());
 
         });*/
      }, 5000);
    }).catch(error => console.log(error));

  }

  public removerScriptsVarios() {
    this.scripts.removerScriptsCss("https://test.oppwa.com/v1/static/f23b5b6541ad0e05a4b39d836d8eab2b/js/static.min.js", "js");
    this.scripts.removerScriptsCss("https://ci-mpsnare.iovation.com/snare.js", "js");
    this.scripts.removerScriptsCss("https://ci-mpsnare.iovation.com/script/logo.js", "js");
    $("#loadDeviceId").remove();
  }

  public verificarTipoTarjeta() {
    if (this.tipoTarjeta == 1) {
      this.generarCheckoutId();
    }
  }

  public verificarBanco() {
    this.generarCheckoutId();
  }

  public obtenerComprobante(ev) {
    this.comprobante = ev.target;
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
      estado: this.idFormaPago == 3 ? 1 : 2,
      idCliente: this.fmrDatosFacturacion.idCliente,
      idEmpleado: 1,
      idFormaPago: this.idFormaPago,
      idDetallePago: idDetallePago,
      idTaller: 1,
      ruta: path
    };
    console.log(this.idFormaPago)
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

  public finalizarCompra() {

    if (this.idFormaPago == 2) {
      if (this.comprobante.files.length > 0) {
        let form = new FormData();
        form.append('file', this.comprobante.files[0]);
        this.spinner.show();
        this.conexion.upload("obtenerPath", form).subscribe(
          (res: any) => {
            console.log(res)
            this.spinner.hide();
            this.gestionDetallePago('TRANSFERENCIA', res.resultado.path);
          },
          err => {
            this.spinner.hide();
            console.log(err);
          }
        );
      }
    } else {
      this.gestionDetallePago('EFECTIVO', '');
    }

  }

  public enviarEmail() {

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

  public gestionPago() {
    console.log(this.idFormaPago);
    if (this.idFormaPago == 3) {
      //this.generarCheckoutId();
    }
    for (let pago of this.lstFormasPago) {
      if (pago.idFormaPago == this.idFormaPago) {
        this.pago = pago;
      }
    }
  }

  public visualizarBoton() {
    this.generarCheckoutId();
  }

}
