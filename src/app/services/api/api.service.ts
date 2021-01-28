import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { retry } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = "";
  constructor(private http: HttpClient) {
    this.url = environment.conexionApi;
  }

  upload(endpoint: string, body: any): Observable<any> {
    return this.http.post(this.url + "" + endpoint, body).pipe(retry(3));
  }

  post(endpoint: string, auth: any, body: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": auth
      })
    };
    return this.http.post(this.url + "" + endpoint, body, httpOptions).pipe(retry(3));
  }

  get(endpoint: string, auth: any, params?: any, reqOpts?: any): Observable<any> {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }

    reqOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": auth
      })
    };

    return this.http.get(this.url + "" + endpoint, reqOpts).pipe(retry(3));
  }
}
