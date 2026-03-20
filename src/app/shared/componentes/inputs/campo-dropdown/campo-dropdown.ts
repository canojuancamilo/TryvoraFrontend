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
  private searchTerm = signal<string>(''); // 🔥 Almacenamos el término de búsqueda

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

    // Suscribirse a los cambios del formulario para emitir el valor
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

  /**
   * 🔥 Maneja el filtro de búsqueda
   */
  handleFilter(value: string) {
    this.searchTerm.set(value); // Guardamos el término de búsqueda

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

  /**
   * 🔥 Maneja el evento clear (cuando se hace clic en la X)
   */
  handleClear() {
    // Resetea las opciones filtradas a todas las opciones disponibles
    this.opcionesFiltradas.set([...this.opciones()]);

    // 🔥 Limpiamos el término de búsqueda almacenado
    this.searchTerm.set('');

    // 🔥 Forzamos el cierre del dropdown y reset del filtro
    const ngSelect = this.ngSelectComponent();
    if (ngSelect) {
      // Cerramos el dropdown si está abierto
      ngSelect.close();

      // 🔥 Solución alternativa: usar filter para resetear la búsqueda
      // No podemos asignar directamente searchTerm, pero podemos usar el método filter
      // Esto forzará a que el ng-select se resetee
      setTimeout(() => {
        // Disparamos un evento de búsqueda vacío para resetear
        ngSelect.filter('');
      }, 0);
    }
  }

  /**
   * 🔥 Maneja el evento de cambio de selección
   */
  onSelectionChange(event: any) {
    this.valorCambiado.emit({
      valor: event,
      opcionCompleta: this.getOpcionCompleta(event)
    });

    // Opcional: Limpiar el término de búsqueda después de seleccionar
    // para que al abrir de nuevo muestre todas las opciones
    const ngSelect = this.ngSelectComponent();
    if (ngSelect && this.searchTerm()) {
      this.searchTerm.set('');
      setTimeout(() => {
        ngSelect.filter('');
      }, 0);
    }
  }

  /**
   * 🔥 Obtiene la opción completa a partir de un valor seleccionado
   */
  private getOpcionCompleta(valor: any): any {
    if (!valor) return null;
    return this.opciones().find(opcion => opcion[this.keyOpciones()] === valor);
  }
}