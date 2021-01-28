import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from 'src/app/method/generic/generic.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  urls = environment;

  lstFavoritos = [];
  itemsCarrito: any = {
    total: 0,
    envio: 0,
    numero: 0,
    lstCarrito: []
  };

  constructor(public generico: GenericService, public favorito: WishlistService, public cart: CartService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.lstFavoritos = this.favorito.verFavoritos();
  }

  public eliminarItemFavorito(id) {
    this.favorito.eliminarItemFavorito(id);
    this.lstFavoritos = this.favorito.verFavoritos();
  }

  public eliminarFavoritos() {
    this.favorito.eliminarFavoritos();
    this.lstFavoritos = this.favorito.verFavoritos();
  }

  public agregarItemCarrito(item) {

    this.cart.agregarItemCarrito(item.idProducto, item, 1);
    this.itemsCarrito = {
      total: this.cart.obtenerTotal(),
      envio: 0,
      numero: this.cart.obtenerNumeroProductos(),
      lstCarrito: this.cart.verCarrito()
    };

    this.eliminarItemFavorito(item.idProducto);
    this.toastr.success('Producto agregado al carrito', 'Favoritos');
  }

  public obtenerPrecio(datos) {
    if (datos.promocion == 1) {
      return datos.precioDescuento;
    } else {
      return datos.precio
    }
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
