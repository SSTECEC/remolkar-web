
import { Component, EventEmitter, Output } from '@angular/core';
import { spanish } from 'src/app/string/language/spanish';
import { english } from 'src/app/string/language/english';

@Component({
  selector: 'language',
  template: `
  <li><a class="language-click" href="#">{{ idioma.idioma }} <i class="ion-chevron-down"></i></a>
  <ul class="language-dropdown">
    <li (click)="idiomaEspanol()"><a href="#">Español </a></li>
    <li (click)="idiomaIngles()"><a href="#">English </a></li>
  </ul>
    </li>
  `,
})
export class LanguageComponent {

  idioma: any;

  @Output() change: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.idioma = spanish;
  }

  idiomaIngles() {
    this.idioma = english;
    this.change.emit(english);
  }

  idiomaEspanol() {
    this.idioma = spanish;
    this.change.emit(spanish);
  }

}
