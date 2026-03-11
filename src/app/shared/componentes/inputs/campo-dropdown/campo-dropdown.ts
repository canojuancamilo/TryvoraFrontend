import { Component, computed, effect, inject, input, output, viewChild, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidationComponent } from '../../form-validation/form-validation';
import { CamposService } from '../../../servicios/campos/campos.service';

@Component({
  selector: 'app-campo-dropdown',
  imports: [FormValidationComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './campo-dropdown.html'
})
export class CampoDropDown {
  camposService = inject(CamposService);
  private cdr = inject(ChangeDetectorRef);

  nombreCampo = input.required<string>();
  controlForm = input.required<AbstractControl>();
  datos = input.required<any[]>();
  textoDatos = input.required<string>();
  keyDatos = input.required<string>();

  espacioReservado = input<string>("");
  filterable = input<boolean>(false);

  blur = output<void>();
  
  validationComp = viewChild(FormValidationComponent);
  
  datosFiltrados = signal<any[]>([]);
  datosOriginales: any[] = [];

  get formControlGet(): FormControl {
    return this.camposService.formControlGet(this.controlForm());
  }

  get defaultItem() {
    if (this.espacioReservado() != "") {
      return {
        [this.textoDatos()]: this.espacioReservado(),
        [this.keyDatos()]: null
      };
    } else {
      return null;
    }
  }

  constructor() {
    effect(() => {
      const datos = this.datos();
      this.datosOriginales = datos || [];
      this.datosFiltrados.set(datos || []);
      
      const debeSeleccionar = this.espacioReservado() == "";

      if (datos && datos.length > 0) {
        const formControl = this.formControlGet;
        const valorActual = formControl.value;
        
        // Solo aplicar selección automática si NO hay valor y NO hay espacioReservado
        if ((valorActual === null || valorActual === undefined) && this.espacioReservado() == "") {
          setTimeout(() => {
            // Verificar nuevamente por si se estableció mientras esperábamos
            if (formControl.value === null || formControl.value === undefined) {
              const primerValor = datos[0][this.keyDatos()];
              formControl.setValue(primerValor, { emitEvent: false });
            }
          });
        }
      }
    });
  }

  hasError = computed(() => {
    const validator = this.validationComp();
    return validator?.hasError() || false;
  });

  controlName = computed(() => {
    return this.camposService.controlName(this.formControlGet);
  });

  esRequerido = computed(() => {
    return this.camposService.esRequerido(this.formControlGet);
  });

  onBlur() {
    this.blur.emit();
  }

  handleFilter(value: string) {
    if (!value) {
      this.datosFiltrados.set(this.datosOriginales);
      return;
    }
    
    const filtered = this.datosOriginales.filter((item) =>
      item[this.textoDatos()]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    
    this.datosFiltrados.set(filtered);
  }

  // Método público para forzar sincronización del dropdown
  forzarSincronizacion(): void {
    // if (this.kendoDropdown) {
    //   this.cdr.detectChanges();
    //   // Forzar refresco del componente Kendo
    //   setTimeout(() => {
    //     this.kendoDropdown.reset();
    //     this.cdr.detectChanges();
    //   }, 10);
    // }
  }
}