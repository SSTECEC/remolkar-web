import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from 'src/app/method/generic/generic.service';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { SessionService } from 'src/app/services/session/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  urls = environment;

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

  lstTalleres = [];

  fmrEnvios = {
    envio: -1,
    direccion: "",
    taller: -1
  };

  constructor(public generico: GenericService, public conexion: ApiService, public cart: CartService, private toastr: ToastrService, public session: SessionService) { }

  ngOnInit(): void {
    this.usuario = this.session.obtenerDatos();
    this.verCarrito();
    this.listarTalleres();
  }

  public listarTalleres() {
    this.conexion.get("listarTalleres", "").subscribe(
      (res: any) => {
        console.log(res.resultado)
        this.lstTalleres = res.resultado;

      },
      err => {
        console.log(err);
      }
    );
  }

  public gestionTipo() {
    if (this.fmrEnvios.envio == 1) {
      this.recalculoValores();
    } else {
      this.valores = this.generico.desglosarValores(this.cart.obtenerTotal());
    }
  }

  public comprar() {
    if (this.fmrEnvios.envio == -1) {
      this.toastr.warning('Seleccionar tipo de envio.', 'Carrito');
    } else {
      if (this.fmrEnvios.envio == 1) {
        if (this.fmrEnvios.direccion.trim() == "") {
          this.toastr.warning('Ingresar Dirección.', 'Carrito');
        } else {
          window.open(environment.conexionVista + "/compra/" + btoa(JSON.stringify({ envio: this.fmrEnvios.envio, direccion: this.fmrEnvios.direccion, taller: this.fmrEnvios.taller, total: this.valores.total })), "_self");
        }
      } else if (this.fmrEnvios.envio == 2) {
        if (this.fmrEnvios.taller == -1) {
          this.toastr.warning('Seleccionar taller.', 'Carrito');
        } else {
          window.open(environment.conexionVista + "/compra/" + btoa(JSON.stringify({ envio: this.fmrEnvios.envio, direccion: this.fmrEnvios.direccion, taller: this.fmrEnvios.taller, total: this.valores.total })), "_self");
        }
      }
    }
  }

  public recalculoValores() {
    var total = this.cart.obtenerTotal();
    var nuevo = total + 20;
    this.itemsCarrito.total = nuevo;

    this.valores = this.generico.desglosarValores(this.itemsCarrito.total);
  }

  public verCarrito() {
    this.itemsCarrito = {
      total: this.cart.obtenerTotal(),
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

  public eliminarItemCarrito(id) {
    this.cart.eliminarItemCarrito(id);
    this.verCarrito();
  }

  public obtenerTotalItem(cantidad, datos) {
    return this.cart.obtenerTotalItem(cantidad, datos);
  }

  public obtenerPrecio(datos) {
    if (datos.promocion == 1) {
      return datos.precioDescuento;
    } else {
      return datos.precio
    }
  }

  public desglosarValores() {
    this.valores = this.generico.desglosarValores(this.itemsCarrito.total);
  }

  public obtenerImagen(imagenes) {

    var str = imagenes;
    var res = str.split(",");
    var img = "";
    if (res.length >= 2) {
      img = res[1];
    } else {
      img = res[0];
    }
    return img.trim();
  }
}
