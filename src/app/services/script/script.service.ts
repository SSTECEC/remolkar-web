import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface Scripts {
  name: string;
  src: string;
}

declare var document: any;

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  private scripts: any = {};

  public ScriptStore: Scripts[] = [];

  constructor() {
  }

  public inicializarScriptsDatafast(id) {
    console.log(environment.conexionDatafast + id);
    this.ScriptStore = [
      { name: 'checkoutId-datafast', src: environment.conexionDatafast + id },
      { name: 'card-datafast', src: 'assets/card-datafast/card-datafast.js' }
    ];

    this.ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  public cargarScriptsDinamicamente(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.gestionScripts(script)));
    return Promise.all(promises);
  }

  public gestionScripts(name: string) {
    return new Promise((resolve, reject) => {

      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = this.scripts[name].src;
      if (script.readyState) {  //IE
        script.onreadystatechange = () => {
          if (script.readyState === "loaded" || script.readyState === "complete") {
            script.onreadystatechange = null;
            this.scripts[name].loaded = true;
            resolve({ script: name, loaded: true, status: 'Loaded' });
          }
        };
      } else {  //Others
        script.onload = () => {
          this.scripts[name].loaded = true;
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
      }
      script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }

  public removerScriptsCss(filename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
    var allsuspects = document.getElementsByTagName(targetelement)
    for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
      if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
        allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
  }
}
