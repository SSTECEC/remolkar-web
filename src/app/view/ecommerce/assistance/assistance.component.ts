import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/method/generic/generic.service';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assistance',
  templateUrl: './assistance.component.html',
  styleUrls: ['./assistance.component.css']
})
export class AssistanceComponent implements OnInit {

  urls = environment;
  lstServicios = [];
  itemsCarrito: any = {
    total: 0,
    envio: 0,
    numero: 0,
    lstCarrito: []
  };


  constructor(public generico: GenericService, public conexion: ApiService, public cart: CartService, public favorito: WishlistService) { }

  ngOnInit(): void {
    this.listarServicios();
  }


  public listarServicios() {

    this.conexion.get("listarServicios", "").subscribe(
      (res: any) => {
        this.lstServicios = res.resultado;
        console.log(this.lstServicios);
      },
      err => {
        console.log(err);
      }
    );
  }

  public agregarItemCarrito(item) {
    this.cart.agregarItemCarrito(item.idProducto, item, 1);
    this.itemsCarrito = {
      total: this.cart.obtenerTotal(),
      envio: 0,
      numero: this.cart.obtenerNumeroProductos(),
      lstCarrito: this.cart.verCarrito()
    };
  }

  public orden(numero){
    if(numero % 2 == 0){
      return 1;
    }else{
      return 0;
    }
  }

}
