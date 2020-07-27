import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { FormUtils } from 'src/assets/utils/form-utils';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DatosPersonales } from 'src/app/models/datos-personales';
import { MessageResponse } from 'src/app/models/message-response';
import { EnviarDatosService } from 'src/app/services/enviar-datos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { emit } from 'process';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('modalConfirmacion')
  public modalConfirmacion: any;
  public modalConfirmacionRef: NgbModalRef;
  catalogoCiudadEstado: string[] = [];
  ciudadesFiltradas: Observable<string[]>;
  correoUsuario: string = '';

  public formDatosPeronales: FormGroup;
  public datosEnviados: boolean = false;

  constructor(public formBuilder: FormBuilder,
    public formUtils: FormUtils,
    public enviarDatosService: EnviarDatosService,
    public ngbModalService: NgbModal) { }

  ngOnInit() {
    this.inicializarFormularioHome();
  }

  ngAfterViewInit(): void {
    this.getCatalogoCiudadEstado();
  }

  public getCatalogoCiudadEstado() {
    this.enviarDatosService.getCatalogoCiudadEstado().subscribe(
      data => {
        this.catalogoCiudadEstado = data.response;
      }
    )
  }

  public inicializarFormularioHome() {
    this.formDatosPeronales = this.formBuilder.group({
      nombreUser: new FormControl('', [Validators.required]),
      emailUser: new FormControl('', [Validators.required, Validators.email]),
      telefonoUser: new FormControl('', [Validators.required]),
      fechaUser: new FormControl('', [Validators.required]),
      ciudadEstadoUser: new FormControl('', [Validators.required])
    })

    this.ciudadesFiltradas = this.formDatosPeronales.get('ciudadEstadoUser').valueChanges.pipe(
      startWith(''),
      map(value => this.filtroArregloCiudad(value))
    );

    this.formDatosPeronales.get('emailUser').valueChanges.subscribe(
      (email: string) => {
        if (email != '') {
          this.correoUsuario = email;
        } else {
          this.correoUsuario = '';
        }
      });

  }

  private filtroArregloCiudad(value: string): string[] {
    const filterValue = this.normalizarValor(value);
    return this.catalogoCiudadEstado.filter(ciudad => this.normalizarValor(ciudad).includes(filterValue));
  }

  private normalizarValor(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  public enviarDatosPersonales(): void {
    let datos: DatosPersonales = this.obtenerModeloDatosPersonales();
    this.enviarDatosService.guardarDatosPersonales(datos).subscribe(
      (messageResponse: MessageResponse<any>) => {
        if (messageResponse.success) {
          this.enviarDatosService.enviarEmail(messageResponse.response)
            .subscribe((messageResponse: MessageResponse<any>) => {
              if (messageResponse.success) {
                this.abrirModal();
              }
            })
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      });
  }

  public obtenerModeloDatosPersonales(): DatosPersonales {
    return {
      nombre: this.formDatosPeronales.get('nombreUser').value,
      email: this.formDatosPeronales.get('emailUser').value,
      telefono: this.formDatosPeronales.get('telefonoUser').value,
      fecha: this.obtenerFechaConFormato(this.formDatosPeronales.get('fechaUser').value),
      ciudadEstado: this.formDatosPeronales.get('ciudadEstadoUser').value
    }
  }

  public obtenerFechaConFormato(fecha: Date): string {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    let fechaConvert: Date = new Date(fecha);
    let fechaprueba = (fechaConvert.getUTCDate() + " de " + monthNames[fechaConvert.getUTCMonth()] + " de " + fechaConvert.getUTCFullYear());
    return fechaprueba;
  }

  public abrirModal() {
    this.datosEnviados = true;
    this.modalConfirmacionRef = this.ngbModalService.open(this.modalConfirmacion, {
      centered: true,
      windowClass: 'modal-confirmacion',
      backdrop: 'static',
      keyboard: false
    });
  }

  public aceptarModal() {
    this.datosEnviados = false;
    this.formDatosPeronales.reset();
    this.modalConfirmacionRef.close();
  }
}
