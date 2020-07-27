import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormUtils {
    /**
 * Si regresa falso significa que hay un error de validacion en el control del formulario.
 * @param form 
 * @param nombreControl 
 */
    public validarControl = function (form: FormGroup, nombreControl: string): boolean {
        return form.controls[nombreControl].touched && form.controls[nombreControl].errors != null;
    }

    /**
     * Si el control tiene error de validacion regresa un mensaje, en caso contrario regresa una cadena vacía.
     * @param form 
     * @param nombreControl 
     */
    public obtenerMensajeValidacion = function (form: FormGroup, nombreControl: string): string {
        let mensajeError = '';
        let control = form.get(nombreControl) as AbstractControl;
        let errors = control.errors as ValidationErrors;
        if (control.touched && errors != null) {
            if (errors.required) {
                mensajeError = "El campo es requerido.";
            } else if (errors.email) {
                mensajeError = "El formato de correo es incorrecto.";
            }
        }
        return mensajeError;
    }
}
