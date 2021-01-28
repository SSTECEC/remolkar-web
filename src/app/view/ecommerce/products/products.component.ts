import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Options, LabelType } from 'ng5-slider';
import { GenericService } from 'src/app/method/generic/generic.service';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  urls = environment;

  lstRin = [];
  lstCategorias = [];
  lstMarcas = [];
  lstProductos = [];
  rangoPrecios = { minimo: 0, maximo: 0 };
  opcionesRangoPrecios: Options = {
    floor: 0,
    ceil: 0
  };

  tipoFiltro = {
    url: false,
    filtro: false
  }

  filtros = {
    categoria: 0,
    rin: 0,
    marca: 0,
  }

  sentencia = "";

  pagina = 0;
  contador = 0;

  itemsCarrito: any = {
    total: 0,
    envio: 0,
    numero: 0,
    lstCarrito: []
  };

  constructor(private router: Router, public generico: GenericService, public conexion: ApiService, public cart: CartService, public favorito: WishlistService) { }

  ngAfterViewInit() {
    this.listarProductosRangoPrecios();
  }

  ngOnInit(): void {
    this.listarCategorias();
    this.listarDetallesLlanta();
    this.listarMarcas();
    this.listarBusquedaParametros();
  }

  public listarBusquedaParametros() {
    var url = this.router.parseUrl(this.router.url);
    var sentencia = url.queryParams.sentencia;
    var tipo = url.queryParams.tipo;

    this.sentencia = "";
    this.contador = 0;
    this.pagina = 0;

    if (sentencia != undefined) {

      this.tipoFiltro.url = true;
      this.tipoFiltro.filtro = false;

      var aux = atob(sentencia);
      var lstFiltro = JSON.parse(aux);

      if (tipo == 1) {
        this.sentencia = '(ancho = "' + lstFiltro.ancho + '" AND perfil = "' + lstFiltro.perfil + '" AND rin = "' + lstFiltro.rin + '")';
      } else if (tipo == 2) {
        this.sentencia = '(marcaAuto LIKE "%' + lstFiltro.vehiculo + '%" OR modeloAuto LIKE "%' + lstFiltro.vehiculo + '%")';
      } else if (tipo == 3) {
        this.sentencia = '(nombre LIKE "%' + lstFiltro.producto + '%" OR tag LIKE "%' + lstFiltro.producto + '%")';
      } else if (tipo == 4) {
        this.sentencia = '(marcaNombre LIKE "%' + lstFiltro.marca + '%")';
      }

      console.log(this.sentencia);

      this.conexion.post("listarProductosLlantas", "", { sentencia: this.sentencia, pagina: this.pagina }).subscribe(
        (res: any) => {
          this.lstProductos = res.resultado;
          console.log(res.resultado);
        },
        err => {
          console.log(err);
        }
      );
    } else {
      this.tipoFiltro.url = false;
      this.tipoFiltro.filtro = true;
      this.filtrar(1, 1);
    }
  }

  public listarCategorias() {

    this.conexion.get("listarCategorias", "").subscribe(
      (res: any) => {
        this.lstCategorias = res.resultado;
        console.log(this.lstCategorias)
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarDetallesLlanta() {

    this.conexion.get("listarDetallesLlanta", "").subscribe(
      (res: any) => {
        this.lstRin = JSON.parse(res.resultado.rin);
        console.log(this.lstRin)
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarProductosRangoPrecios() {

    this.conexion.get("listarProductosRangoPrecios", "").subscribe(
      (res: any) => {
        this.rangoPrecios = res.resultado[0];

        this.opcionesRangoPrecios = {
          floor: this.rangoPrecios.minimo,
          ceil: this.rangoPrecios.maximo,
          translate: (value: number, label: LabelType): string => {
            switch (label) {
              case LabelType.Low:
                return '$' + value;
              case LabelType.High:
                return '$' + value;
              default:
                return '$' + value;
            }
          }
        }
        console.log(this.rangoPrecios)
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarMarcas() {

    this.conexion.get("listarMarcas", "").subscribe(
      (res: any) => {
        this.lstMarcas = res.resultado;
        console.log(this.lstMarcas)
      },
      err => {
        console.log(err);
      }
    );
  }

  public filtrar(tipo, dato) {
    this.sentencia = "";
    this.contador = 0;
    this.pagina = 0;

    this.tipoFiltro.url = false;
    this.tipoFiltro.filtro = true;

    if (tipo == 1) {
      this.sentencia = " AND idCategoria = " + dato;
    } else if (tipo == 2) {
      this.sentencia = " AND rin = " + dato;
    } else if (tipo == 3) {
      this.sentencia = " AND precio BETWEEN " + this.rangoPrecios.minimo + " AND " + this.rangoPrecios.maximo;
    } else if (tipo == 4) {
      var data = "";
      var validacion = [];
      $("input:checkbox[name=marcas]:checked").each(function () {
        data += "idMarca = " + $(this).val() + " OR ";
        validacion.push($(this).val());
      });
      this.sentencia = (validacion.length == 0 ? "" : "AND ( " + data.substr(0, (data.length - 4)) + " )");
    }
    console.log(this.sentencia);
    this.conexion.post("listarProductosPaginacion", "", { sentencia: this.sentencia, pagina: this.pagina }).subscribe(
      (res: any) => {
        this.lstProductos = res.resultado;
        console.log(this.lstProductos);
      },
      err => {
        console.log(err);
      }
    );
  }

  public siguiente() {

    var metodo = "";
    if (this.tipoFiltro.url) {
      var metodo = "listarProductosLlantas";
    } else if (this.tipoFiltro.filtro) {
      var metodo = "listarProductosPaginacion";
    }

    if (this.lstProductos.length == 12) {
      this.contador++;
      this.pagina = 12 * this.contador;
      this.conexion.post(metodo, "", { sentencia: this.sentencia, pagina: this.pagina }).subscribe(
        (res: any) => {
          this.lstProductos = res.resultado;
          console.log(this.lstProductos);
        },
        err => {
          console.log(err);
        }
      );
    }

  }

  public atras() {
    var metodo = "";
    if (this.tipoFiltro.url) {
      var metodo = "listarProductosLlantas";
    } else if (this.tipoFiltro.filtro) {
      var metodo = "listarProductosPaginacion";
    }

    if (this.pagina > 0) {
      this.contador--;
      this.pagina = 12 * this.contador;

      this.conexion.post(metodo, "", { sentencia: this.sentencia, pagina: this.pagina }).subscribe(
        (res: any) => {
          this.lstProductos = res.resultado;
          console.log(this.lstProductos);
        },
        err => {
          console.log(err);
        }
      );
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
