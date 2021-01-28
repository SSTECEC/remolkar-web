import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private keyCliente: string = "l:cart";

  constructor(private toastr: ToastrService) { }

  public eliminarCarrito() {
    this.toastr.warning('Carrito Eliminado', 'Carrito');
    localStorage.removeItem(this.keyCliente);
  }

  public verCarrito() {
    var articulos: any = localStorage.getItem(this.keyCliente) == null ? [] : JSON.parse(localStorage.getItem(this.keyCliente));
    return articulos;
  }

  public eliminarItemCarrito(id) {
    var articulos: any = localStorage.getItem(this.keyCliente) == null ? [] : JSON.parse(localStorage.getItem(this.keyCliente));

    var eliminarItemVector = function (lista) {
      var items = [];
      lista.map((e) => { items.push(e.data.idProducto); });
      var posicion = items.indexOf(id);
      if (posicion > -1) {
        lista.splice(posicion, 1);
      }
    }
    eliminarItemVector(articulos);
    this.toastr.warning('Producto eliminado del carrito', 'Carrito');
    localStorage.setItem(this.keyCliente, JSON.stringify(articulos));
    return this.verCarrito();
  }

  public agregarItemCarrito(id, detalle, cantidad) {

    var articulos: any = localStorage.getItem(this.keyCliente) == null ? [] : JSON.parse(localStorage.getItem(this.keyCliente));
    var flag = false;

    if (articulos.length > 0) {

      for (let art of articulos) {
        if (id == art.data.idProducto) {
          art.cantidad = (art.cantidad + cantidad);
          flag = true;
          break;
        }
      }

    }
    if (!flag) {
      articulos.push({ data: detalle, cantidad: cantidad });
    }
    this.toastr.success('Producto agregado al carrito', 'Carrito');
    localStorage.setItem(this.keyCliente, JSON.stringify(articulos));
  }

  public obtenerNumeroProductos() {
    var articulos: any = localStorage.getItem(this.keyCliente) == null ? [] : JSON.parse(localStorage.getItem(this.keyCliente));
    var total = 0;
    for (let carrito of articulos) {
      total += carrito.cantidad;
    }

    return Math.round(total * 100) / 100;
  }


  public obtenerTotal() {
    var articulos: any = localStorage.getItem(this.keyCliente) == null ? [] : JSON.parse(localStorage.getItem(this.keyCliente));
    var total = 0;
    for (let carrito of articulos) {
      total += this.obtenerTotalItem(carrito.cantidad, carrito.data);
    }
    return total;
  }

  public obtenerTotalItem(cantidad, datos) {
    if (datos.promocion == 1) {
      return cantidad * datos.precioDescuento;
    } else {
      return cantidad * datos.precio
    }
  }

}
