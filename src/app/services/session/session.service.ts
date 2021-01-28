import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private keyEncriptacion: string = "19B6AB007C12A038BECCB6EEAE73E664702FF9F70DE053C3B3D8ECD8B667F07E";
  private keyCliente: string = "l:key";

  constructor(private router: Router) { }

  cerrarSesion() {
    localStorage.removeItem(this.keyCliente);
    window.open(environment.conexionVista + "/", "_self");
  }

  iniciarSesion(usuario: any) {
    var datosCifrados = CryptoJS.AES.encrypt(JSON.stringify(usuario), this.keyEncriptacion).toString();
    localStorage.setItem(this.keyCliente, datosCifrados);
    if (usuario.rol == "ADMINISTRADOR") {
      this.router.navigate(['/administrador/inicio']);
    }
  }
  
  obtenerDatos() {
    var datos = localStorage.getItem(this.keyCliente);
    var datosPlanos: any;
    if (datos == null) {
      datosPlanos = { 'resultado': null, 'token': null };
    } else {
      var bytes = CryptoJS.AES.decrypt(datos, this.keyEncriptacion);
      datosPlanos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return datosPlanos;
  }
}
