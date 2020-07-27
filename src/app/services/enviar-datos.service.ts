import { Injectable } from '@angular/core';
import { DatosPersonales } from '../models/datos-personales';
import { Observable } from 'rxjs';
import { MessageResponse } from '../models/message-response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnviarDatosService {

  public url: string;

  constructor(private http: HttpClient) {
    this.url = "http://localhost:61260/api/home";
  }

  public guardarDatosPersonales(datos: DatosPersonales): Observable<MessageResponse<any>> {
    return this.http.get<MessageResponse<any>>(this.url + "/guardarDatosPersonales?nombre=" + datos.nombre + "&email=" + datos.email + "&telefono=" + datos.telefono + "&fecha=" + datos.fecha + "&ciudadEstado=" + datos.ciudadEstado);
  }

  public enviarEmail(idUser: number): Observable<MessageResponse<any>> {
    return this.http.get<MessageResponse<any>>(this.url + "/sendEmail?idUser=" + idUser);
  }

  public getCatalogoCiudadEstado(): Observable<any> {
    return this.http.get(this.url + '/GetCatalogoCiudadEstado');
  }

}
