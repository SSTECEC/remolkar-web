import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/method/generic/generic.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  dtsEmpresa: any = { "idEmpresa": 0, "tipoIdentificacion": "", "identificacion": "", "nombre": "", "email": "", "logo": "", "acerca": "", "idHorario": 0, "apertura": "", "cierre": "", "descripcion": "", "idSucursal": 0, "nombreSucursal": "", "telefonoSucursal": "", "direccionSucursal": "", "latitudSucursal": "", "longitudSucursal": "", "provinciaSucursal": "", "principalSucursal": 0 };


  formEmail : any = {
    nombre : '',
    correo : '',
    asunto : '',
    mensaje : ''
  }; 

  constructor(public conexion: ApiService, public generico: GenericService) { }

  ngOnInit(): void {
    this.listarEmpresa();
  }

  
  public listarEmpresa() {
    this.conexion.get("listarEmpresa", "").subscribe(
      (res: any) => {
        this.dtsEmpresa = res.resultado;
        console.log(this.dtsEmpresa)
      },
      err => {
        console.log(err);
      }
    );
  }

  public enviarMail(){
    var datos : any = {
      nombre : this.formEmail.nombre,
      correo : this.formEmail.correo,
      asunto : this.formEmail.asunto,
      mensaje : this.formEmail.mensaje
    }

    console.log(datos);

    this.conexion.post("enviarEmail","",datos).subscribe(
      (res: any) => {
        if(res){
          console.log(res);
          this.generico.alerta();
        }
      },
      err => {
        console.log(err);
      }
    );
  }



}
