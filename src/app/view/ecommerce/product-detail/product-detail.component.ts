import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from 'src/app/method/generic/generic.service';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  urls = environment;

  idProducto = 0;
  producto = { "idProducto": 0, "codigo": "", "nombre": "", "descripcion": "", "descripcionCorta": "", "imagen": "", "precio": 0, "precioDescuento": 0, "descuento": 0, "promocion": 0, "promocionUnica": 0, "tiempo": "", "stock": 0, "tag": "", "ancho": "", "perfil": "", "rin": "", "marcaAuto": "", "modeloAuto": "", "estado": 0, "modeloNombre": "", "marcaNombre": "", "tipoNombre": "", "categoriaNombre": "", "idCategoria": 0 };
  imagenes = [];
  imagenSeleccionada = "";
  tags = [];
  cantidad = 1;
  lstProductosRelacionados = [];
  itemsCarrito: any = {
    total: 0,
    envio: 0,
    numero: 0,
    lstCarrito: []
  };

  constructor(private router: ActivatedRoute, public generico: GenericService, public conexion: ApiService, public cart: CartService, public favorito: WishlistService) { }


  ngOnInit(): void {
    this.idProducto = parseInt(this.router.snapshot.params.id);
    this.listarProducto();
  }

  public listarProducto() {

    this.conexion.get("listarProducto?idProducto=" + this.idProducto, "").subscribe(
      (res: any) => {
        this.producto = res.resultado;
        this.obtenerImagenes();
        this.imagenSeleccionada = this.imagenes[0];
        console.log(this.producto);
        this.listarProductosRelacionados();
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarProductosRelacionados() {

    this.conexion.get("listarProductosRelacionados?idCategoria=" + this.producto.idCategoria, "").subscribe(
      (res: any) => {
        this.lstProductosRelacionados = res.resultado;
        console.log(this.lstProductosRelacionados)
      },
      err => {
        console.log(err);
      }
    );
  }


  public agregarItemCarrito(item, tipo) {
    this.cart.agregarItemCarrito(item.idProducto, item, (tipo == 1 ? this.cantidad : 1) );
    this.itemsCarrito = {
      total: this.cart.obtenerTotal(),
      envio: 0,
      numero: this.cart.obtenerNumeroProductos(),
      lstCarrito: this.cart.verCarrito()
    };
  }

  public cambiarImagen(img){
    this.imagenSeleccionada = img;
  }

  public obtenerImagenes() {
    var str = this.producto.imagen;
    var res = str.split(",");
    
    for(let img of res){
      this.imagenes.push(img.trim());
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
