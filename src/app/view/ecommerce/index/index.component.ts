import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from 'src/app/method/generic/generic.service';
import { ApiService } from 'src/app/services/api/api.service';
import { spanish } from 'src/app/string/language/spanish';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService } from 'src/app/services/cart/cart.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';

declare var $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  idioma: any;
  urls = environment;

  carrusel = {
    primero: {
      descripcion: "",
      foto: ""
    },
    segundo: {
      descripcion: "",
      foto: ""
    },
    tercero: {
      descripcion: "",
      foto: ""
    }
  };

  lstLlantas = {
    rin: [],
    ancho: [],
    perfil: [],
  };

  filtroLlantas = {
    rin: "0",
    ancho: "0",
    perfil: "0",
    vehiculo: ""
  }

  filtroLlantasVehiculo = {
    marca: "0",
    vehiculo: "0"
  }

  lstMarcas = [];
  lstModelos = [];
  lstVideos = [];
  lstProductosDescuentos = [];

  productoPromocion = {
    datos: { "idProducto": 0, "codigo": "", "nombre": "", "descripcion": "", "descripcionCorta": "", "imagen": "", "precio": 0, "precioDescuento": 0, "descuento": 0, "promocion": 0, "promocionUnica": 0, "tiempo": "", "stock": 0, "tag": "", "ancho": "", "perfil": "", "rin": "", "marcaAuto": "", "modeloAuto": "", "estado": 0, "modeloNombre": "", "marcaNombre": "", "tipoNombre": "", "categoriaNombre": "" },
    estado: 1
  };

  lstProductosNuevos = [];

  itemsCarrito: any = {
    total: 0,
    envio: 0,
    numero: 0,
    lstCarrito: []
  };

  lstProductosFavoritos = [];


  constructor(private toastr: ToastrService, public generico: GenericService, public conexion: ApiService, public sanitizer: DomSanitizer, public cart: CartService, public favorito: WishlistService) { }

  ngOnInit() {
    this.idioma = spanish;
    this.listarCarrusel();
    this.listarDetallesLlanta();
    this.listarMarcasVehiculos();
    this.listarVideos();
    this.listarProductosDescuentos();
    this.listarProductoPromocionUnica();
    this.listarProductosNuevos();
    this.listarFavoritosProductos();
  }

  cambiarIdioma(idioma) {
    this.idioma = idioma;
  }


  public listarCarrusel() {

    this.conexion.get("listarCarrusel", "").subscribe(
      (res: any) => {
        this.carrusel.primero.descripcion = res.resultado[0].descripcion;
        this.carrusel.primero.foto = this.urls.conexionImagenes + res.resultado[0].foto;
        this.carrusel.segundo.descripcion = res.resultado[1].descripcion;
        this.carrusel.segundo.foto = this.urls.conexionImagenes + res.resultado[1].foto;
        this.carrusel.tercero.descripcion = res.resultado[2].descripcion;
        this.carrusel.tercero.foto = this.urls.conexionImagenes + res.resultado[2].foto;
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarDetallesLlanta() {

    this.conexion.get("listarDetallesLlanta", "").subscribe(
      (res: any) => {
        
        this.lstLlantas.rin = this.ordenar(JSON.parse(res.resultado.rin));
        this.lstLlantas.ancho = this.ordenar(JSON.parse(res.resultado.ancho));
        this.lstLlantas.perfil = this.ordenar(JSON.parse(res.resultado.perfil));
       
      },
      err => {
        console.log(err);
      }
    );
  }

  public ordenar(lista) {

    var tipo_all = lista;
  
    var tipo_number = [];
    var tipo_string = [];
  
    for (let i = 0; i < tipo_all.length; i++) {
      if (this.isNumeric(tipo_all[i])) {
        tipo_number.push(parseFloat(tipo_all[i]));
      } else {
        tipo_string.push(tipo_all[i]);
      }
    }
  
    const total_array = tipo_number.sort((a, b) => a - b).concat(tipo_string.sort((a, b) => a - b));
  
    return total_array;
  }
  
  public isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  

  public listarMarcasVehiculos() {
   
    this.conexion.get("listarMarcasVehiculo", "").subscribe(
      (res: any) => {
        this.lstMarcas = res.resultado;
        console.log(this.lstMarcas);
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarModelosVehiculos() {
    console.log("entro");
    this.conexion.get("listarModelosVehiculo?idMarca=" + this.filtroLlantasVehiculo.marca, "").subscribe(
      (res: any) => {
        this.lstModelos = res.resultado;
        console.log(this.lstModelos);
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarVideos() {

    this.conexion.get("listarVideos", "").subscribe(
      (res: any) => {
        this.lstVideos = res.resultado;
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarProductosDescuentos() {
    this.conexion.get("listarProductosDescuentos", "").subscribe(
      (res: any) => {
        this.lstProductosDescuentos = res.resultado;
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarProductoPromocionUnica() {
    this.conexion.get("listarProductoPromocionUnica", "").subscribe(
      (res: any) => {
        this.productoPromocion.datos = res.resultado[0];
        this.productoPromocion.estado = res.resultado.length;
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarProductosNuevos() {
    this.conexion.get("listarProductosUltimos", "").subscribe(
      (res: any) => {
        this.lstProductosNuevos = res.resultado;
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarFavoritosProductos() {
    this.conexion.get("listarFavoritosProductos", "").subscribe(
      (res: any) => {
        this.lstProductosFavoritos = res.resultado;
      },
      err => {
        console.log(err);
      }
    );
  }

  public filtrarLlantas() {

    if (this.filtroLlantas.ancho == "0" && this.filtroLlantas.perfil == "0" && this.filtroLlantas.rin == "0") {
      this.toastr.warning('Seleccionar al menos una opción', 'Filtro Llantas');
    } else {
      var sentencia = JSON.stringify(this.filtroLlantas);
      window.open(environment.conexionVista + "/productos?sentencia=" + btoa(sentencia) + "&tipo=1", "_self");
    }
  }

  public filtrarLlantasVehiculo() {

    if (this.filtroLlantasVehiculo.vehiculo.trim() == "0") {
      this.toastr.warning('Ingresar un texto para buscar', 'Filtro Vehículos');
    } else {
      var sentencia = JSON.stringify(this.filtroLlantasVehiculo);
      window.open(environment.conexionVista + "/productos?sentencia=" + btoa(sentencia) + "&tipo=2", "_self");
    }
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

  public abrirModal(){
    $('#exampleModalCenter').modal('toggle');
  }

  public transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
