import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GenericService } from 'src/app/method/generic/generic.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { spanish } from 'src/app/string/language/spanish';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { SessionService } from 'src/app/services/session/session.service';
declare var $: any;

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  urls = environment;
  idioma: any;
  @Output() change: EventEmitter<any> = new EventEmitter();

  @Input() datosCarrito: any = {
    total: 0,
    envio: 0,
    numero: 0,
    lstCarrito: []
  };

  public fmrBusqueda: FormGroup;

  public fmrLogin = {
    email: "",
    contrasena: ""
  };

  public fmrRegistro = {
    email: "",
    contrasena: "",
    contrasena2: "",
    rol: 1,
    tipoIdentificacion: "",
    identificacion: "",
    nombre: "",
    telefono: "",
    direccion: "",
    tipo: 1
  };

  public usuario: any;

  dtsEmpresa: any = { "idEmpresa": 0, "tipoIdentificacion": "", "identificacion": "", "nombre": "", "email": "", "logo": "", "acerca": "", "idHorario": 0, "apertura": "", "cierre": "", "descripcion": "", "idSucursal": 0, "nombreSucursal": "", "telefonoSucursal": "", "direccionSucursal": "", "latitudSucursal": "", "longitudSucursal": "", "provinciaSucursal": "", "principalSucursal": 0 };

  constructor(public generico: GenericService, public cart: CartService, private formBuilder: FormBuilder, private toastr: ToastrService, public conexion: ApiService, public session: SessionService) { }

  ngOnInit() {
    this.idioma = spanish;
    this.verCarrito();

    this.fmrBusqueda = this.formBuilder.group({
      producto: ["", [Validators.required, , Validators.minLength(3)]]
    });
    this.usuario = this.session.obtenerDatos();

    this.listarEmpresa();
  }

  public listarEmpresa() {
    this.conexion.get("listarEmpresa", "").subscribe(
      (res: any) => {
        this.dtsEmpresa = res.resultado;
      },
      err => {
        console.log(err);
      }
    );
  }

  cambiarIdioma(idioma) {
    this.idioma = idioma;
    this.change.emit(idioma);
  }

  public abrirModal(tipo) {
    if (tipo == 1) {
      $('#RegisterModal').modal('toggle');
    } else if (tipo == 2) {
      $('#LoginModal').modal('toggle');
    }
  }

  public iniciarSesion() {
    if (this.fmrLogin.email.trim() == "") {
      this.toastr.warning('Ingresar correo electrónico', 'Inicio Sesión');
    } else if (this.fmrLogin.contrasena.trim() == "") {
      this.toastr.warning('Ingresar contraseña', 'Inicio Sesión');
    } else {
      this.conexion.post("iniciarSesion", "", this.fmrLogin).subscribe(
        (res: any) => {
          if (res.resultado == null) {
            this.toastr.warning('Credenciales Incorrectas', 'Inicio Sesión');
          } else {
            this.session.iniciarSesion(res);
            this.toastr.success('Ingreso Exitoso', 'Inicio Sesión');
            $('#LoginModal').modal('toggle');
            this.limpiarLogin();
            this.usuario = this.session.obtenerDatos();
          }
        },
        err => {
          this.toastr.warning('Error al registrar, intente nuevamente mas tarde.', 'Inicio Sesión');
          console.log(err);
        }
      );
    }
  }

  public registrarUsuario() {

    if (this.fmrRegistro.nombre.trim() == "") {
      this.toastr.warning('Ingresar nombre', 'Registro Cliente');
    } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(this.fmrRegistro.email) == false) {
      this.toastr.warning('Correo electrónico no válido', 'Registro Cliente');
    } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/.test(this.fmrRegistro.contrasena) == false) {
      this.toastr.warning('Ingresar una contraseña segura', 'Registro Cliente');
    } else if (this.fmrRegistro.contrasena.trim() != this.fmrRegistro.contrasena2.trim()) {
      this.toastr.warning('Las contraseñas nos coinciden', 'Registro Cliente');
    } else {
      this.conexion.post("registroUsuario", "", this.fmrRegistro).subscribe(
        (res: any) => {
          $('#RegisterModal').modal('toggle');
          $('#LoginModal').modal('toggle');
          this.toastr.success('Registro exitoso, inicia sesión para comenzar a comprar.', 'Registro Cliente');
          this.limpiarRegistro();
        },
        err => {
          this.toastr.warning('Error al registrar, intente nuevamente mas tarde.', 'Registro Cliente');
          console.log(err);
        }
      );
    }

  }

  public cerrarSesion() {
    this.session.cerrarSesion();
  }

  public verCarrito() {
    this.datosCarrito.lstCarrito = this.cart.verCarrito();
    this.obtenerTotal();
    this.obtenerNumeroProductos();
  }

  public eliminarItemCarrito(id) {
    this.cart.eliminarItemCarrito(id);
    this.verCarrito();
  }

  public obtenerTotal() {
    this.datosCarrito.total = this.cart.obtenerTotal();
  }

  public obtenerTotalItem(cantidad, datos) {
    return this.cart.obtenerTotalItem(cantidad, datos);
  }

  public obtenerNumeroProductos() {
    this.datosCarrito.numero = this.cart.obtenerNumeroProductos();
  }

  public acortarNombre(nombre) {
    if (nombre.length >= 20) {
      return nombre.substr(0, 17) + "...";
    } else {
      return nombre;
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

  public filtrar(fmrValores: any) {
    if (this.fmrBusqueda.controls.producto.status == "INVALID") {
      this.toastr.warning('Ingresar un producto', 'Filtro Productos');
    } else {
      var sentencia = JSON.stringify(fmrValores);
      window.open(environment.conexionVista + "/productos?sentencia=" + btoa(sentencia) + "&tipo=3", "_self");
    }
  }

  public limpiarLogin() {
    this.fmrLogin = {
      email: "",
      contrasena: ""
    };
  }


  public limpiarRegistro() {
    this.fmrRegistro = {
      email: "",
      contrasena: "",
      contrasena2: "",
      rol: 1,
      tipoIdentificacion: "",
      identificacion: "",
      nombre: "",
      telefono: "",
      direccion: "",
      tipo: 1
    };
  }

}
