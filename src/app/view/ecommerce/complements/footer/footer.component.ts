import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  url = environment;
  dtsEmpresa: any = { "idEmpresa": 0, "tipoIdentificacion": "", "identificacion": "", "nombre": "", "email": "", "logo": "", "acerca": "", "social": "[]", "idHorario": 0, "apertura": "", "cierre": "", "descripcion": "", "idSucursal": 0, "nombreSucursal": "", "telefonoSucursal": "", "direccionSucursal": "", "latitudSucursal": "", "longitudSucursal": "", "provinciaSucursal": "", "principalSucursal": 0 };
  lstSocial = [];
  constructor(public conexion: ApiService) {
    
    $(document).ready(function () {

      $("#detalleWp").css({ "display": "none" });
      $("#btnWp").css({ "display": "block" });
      $("#btnWpClose").css({ "display": "none" });

      $("#btnWp").click(function () {
          $("#detalleWp").css({ "display": "block" });
          $("#btnWp").css({ "display": "none" });
          $("#btnWpClose").css({ "display": "block" });
      });

      $("#btnWpClose").click(function () {
          $("#detalleWp").css({ "display": "none" });
          $("#btnWp").css({ "display": "block" });
          $("#btnWpClose").css({ "display": "none" });
      });

  });
   }

  ngOnInit(): void {
    this.listarEmpresa();
    
  }

  public listarEmpresa() {
    this.conexion.get("listarEmpresa", "").subscribe(
      (res: any) => {
        this.dtsEmpresa = res.resultado;
        this.listarSocial();
      },
      err => {
        console.log(err);
      }
    );
  }

  public listarSocial(){
    var redes = JSON.parse(this.dtsEmpresa.social);
    this.lstSocial = redes;
  }

  public reducirTexto(texto: string){
    if(texto.length <= 100){
      return texto;
    }else{
      return texto.substr(0, 100) + "... (ver más).";
    }
  }

}
