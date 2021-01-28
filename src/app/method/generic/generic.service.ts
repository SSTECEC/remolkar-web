import { Injectable } from '@angular/core';

@Injectable()
export class GenericService {


  constructor() { }

  public redondear(x) {
    return Number.parseFloat(x).toFixed(2);
  }

  public obtenerFecha(separador) {
    var fecha = new Date();
    var anio = fecha.getFullYear();
    var mes: any = fecha.getMonth() + 1;
    var dia: any = fecha.getDate();

    mes < 10 ? mes = "0" + mes : mes;
    dia < 10 ? dia = "0" + dia : dia;

    return anio + separador + mes + separador;
  }

  public obtenerHora(separador: any) {
    var fecha = new Date();

    var horas: any = fecha.getHours()
    var minutos: any = fecha.getMinutes()
    var segundos: any = fecha.getSeconds()

    horas < 10 ? horas = "0" + horas : horas;
    minutos < 10 ? minutos = "0" + minutos : minutos;
    segundos < 10 ? segundos = "0" + segundos : segundos;

    return horas + separador + minutos + separador + segundos;
  }

  public obtenerFechaCompleta(separador) {
    var fecha = new Date();
    var anio = fecha.getFullYear();
    var mes: any = fecha.getMonth() + 1;
    var dia: any = fecha.getDate();

    var horas: any = fecha.getHours()
    var minutos: any = fecha.getMinutes()
    var segundos: any = fecha.getSeconds()

    horas < 10 ? horas = "0" + horas : horas;
    minutos < 10 ? minutos = "0" + minutos : minutos;
    segundos < 10 ? segundos = "0" + segundos : segundos;

    mes < 10 ? mes = "0" + mes : mes;
    dia < 10 ? dia = "0" + dia : dia;

    return anio + separador + mes + separador + dia + " " + horas + ":" + minutos + ":" + segundos;
  }

  public formatearNumero(amount, decimals) {
    amount += '';
    amount = parseFloat(amount.replace(/[^0-9\.]/g, ''));

    decimals = decimals || 0;

    if (isNaN(amount) || amount === 0)
      return parseFloat("0").toFixed(decimals);

    amount = '' + amount.toFixed(decimals);

    var amount_parts = amount.split('.'),
      regexp = /(\d+)(\d{3})/;

    while (regexp.test(amount_parts[0]))
      amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

    return amount_parts.join('.');
  }


  public desglosarValores(total) {

    var totalReal = parseFloat(total);

    var subtotalCalculo = 0;
    var ivaCalculo = 0;
    var totalCalculo = 0;

    var diferencia = 0;

    subtotalCalculo = Math.round((totalReal / 1.12) * 100) / 100;
    ivaCalculo = Math.round((subtotalCalculo * 0.12) * 100) / 100;
    totalCalculo = Math.round((subtotalCalculo + ivaCalculo) * 100) / 100;

    if (totalCalculo == totalReal) {
      return { subtotal: subtotalCalculo, iva: ivaCalculo, total: totalReal };
    } else {
      diferencia = totalReal - totalCalculo;
      var nuevoIva = ivaCalculo + (diferencia);
      return { subtotal: subtotalCalculo, iva: nuevoIva, total: totalReal };
    }
  }

  public formatoCampo(valor, restriccion, caracteres, tipo) {
    var out = '';
    var filtro = '' + restriccion + '';
    for (var i = 0; i < valor.length; i++) {
      if (filtro.indexOf(valor.charAt(i)) != -1) {
        if (out.length >= caracteres) {
          out.substr(0, caracteres);
        } else {
          out += valor.charAt(i);
        }
      }
    }
    return (tipo == 1) ? out.toUpperCase() : out;
  }

  public validarIdentificacion(tipo, identificacion) {
    var estado = true;
    if (tipo == "RUC") {
      if (identificacion.trim().length != 13) {
        estado = false;
      } else {
        estado = true;
      }
    } else if (tipo == "CÉDULA") {
      if (identificacion.trim().length != 10) {
        estado = false;
      } else {
        estado = true;
      }
    } else if (tipo == "PASAPORTE") {
      if (identificacion.trim().length > 15 || identificacion.trim().length < 5) {
        estado = false;
      } else {
        estado = true;
      }
    } else {
      estado = false;
    }
    return estado;
  }

  public validarTelefonoCelular(telefono) {
    var estado = true;
    var str = telefono.trim();
    var res = str.substring(0, 2);

    if (str.length != 10) {
      estado = false;
    } else {
      if (res != "09") {
        estado = false;
      }
    }

    return estado;
  }

}
