import { Component, computed, effect, inject, input, output, signal, viewChild, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidationComponent } from '../../form-validation/form-validation';
import { CamposService } from '../../../servicios/campos.service';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-campo-dropdown',
  standalone: true,
  imports: [
    FormValidationComponent,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule
  ],
  templateUrl: './campo-dropdown.html',
  styleUrl: './campo-dropdown.css'
})
export class CampoDropDown {

  camposService = inject(CamposService);

  nombreCampo = input.required<string>();
  controlForm = input.required<AbstractControl>();

  opciones = input.required<any[]>();
  textoOpciones = input.required<string>();
  keyOpciones = input.required<string>();

  placeholder = input<string>("Seleccionar...");
  filterable = input<boolean>(true);

  blur = output<void>();
  valorCambiado = output<any>();

  validationComp = viewChild(FormValidationComponent);
  ngSelectComponent = viewChild(NgSelectComponent);

  opcionesFiltradas = signal<any[]>([]);
  private searchTerm = signal<string>('');

  get formControlGet(): FormControl {
    return this.camposService.formControlGet(this.controlForm());
  }

  constructor() {
    effect(() => {
      const datos = this.opciones() ?? [];
      this.opcionesFiltradas.set(datos);

      const formControl = this.formControlGet;
      const valorActual = formControl.value;

      const tienePlaceholder = !!this.placeholder();

      if (!tienePlaceholder && datos.length && (valorActual === null || valorActual === undefined)) {
        formControl.setValue(datos[0][this.keyOpciones()], { emitEvent: false });
      }
    });

    effect(() => {
      const formControl = this.formControlGet;

      if (!formControl) return;

      const subscription = formControl.valueChanges.subscribe((valor) => {
        this.valorCambiado.emit({
          valor: valor,
          opcionCompleta: this.getOpcionCompleta(valor)
        });
      });

      return () => subscription.unsubscribe();
    }); 
  }

  hasError = computed(() => {
    const validator = this.validationComp();
    return validator?.hasError() || false;
  });

  esRequerido = computed(() => {
    return this.camposService.esRequerido(this.formControlGet);
  });

  onBlur() {
    this.blur.emit();
  }


  handleFilter(value: string) {
    this.searchTerm.set(value);

    const datos = this.opciones();

    if (!value) {
      this.opcionesFiltradas.set(datos);
      return;
    }

    const filtered = datos.filter(x =>
      x[this.textoOpciones()]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    this.opcionesFiltradas.set(filtered);
  }


  handleClear() {
    this.opcionesFiltradas.set([...this.opciones()]);
    this.searchTerm.set('');
    const ngSelect = this.ngSelectComponent();

    if (ngSelect) {
      ngSelect.close();
      setTimeout(() => {
        ngSelect.filter('');
      }, 0);
    }
  }

  onSelectionChange(event: any) {
    this.valorCambiado.emit({
      valor: event,
      opcionCompleta: this.getOpcionCompleta(event)
    });
    
    const ngSelect = this.ngSelectComponent();
    if (ngSelect && this.searchTerm()) {
      this.searchTerm.set('');
      setTimeout(() => {
        ngSelect.filter('');
      }, 0);
    }
  }

  private getOpcionCompleta(valor: any): any {
    if (!valor) return null;
    return this.opciones().find(opcion => opcion[this.keyOpciones()] === valor);
  }
}