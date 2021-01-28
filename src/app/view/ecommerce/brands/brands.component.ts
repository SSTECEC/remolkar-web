import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/method/generic/generic.service';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {

  urls = environment;
  lstMarcas = [];
  filtroMarcas = {
    marca: ""
  }

  constructor(public generico: GenericService, public conexion: ApiService) { }

  ngOnInit(): void {
    this.listarMarcas();
  }

  public verMarcaProductos(marca) {
    this.filtroMarcas.marca = marca;
    var sentencia = JSON.stringify(this.filtroMarcas);
    window.open(environment.conexionVista + "/productos?sentencia=" + btoa(sentencia) + "&tipo=4", "_self");
  }

  public listarMarcas() {
    this.conexion.get("listarMarcas", "").subscribe(
      (res: any) => {
        this.lstMarcas = res.resultado;
        console.log(this.lstMarcas);
      },
      err => {
        console.log(err);
      }
    );
  }

}
