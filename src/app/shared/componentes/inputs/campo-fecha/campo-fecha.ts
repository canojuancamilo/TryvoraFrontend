import {
  Component,
  forwardRef,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  signal,
  computed,
  effect,
  input,
  output,
  viewChild,
  inject,
  afterNextRender,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlValueAccessor, FormControl, FormControlState, FormControlStatus, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormValidationComponent } from '../../form-validation/form-validation';
import { CamposService } from '../../../servicios/campos/campos.service';
import { FechasUtils } from '../../../utils/fechas';
import { ICalendario } from '../../../interfaces/Icalendario';

type VistaCalendario = 'days' | 'months' | 'years';

@Component({
  selector: 'app-campo-fecha',
  standalone: true,
  imports: [CommonModule, FormValidationComponent, ReactiveFormsModule],
  templateUrl: './campo-fecha.html',
  styleUrls: ['./campo-fecha.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CampoFecha),
      multi: true,
    },
  ],
})
export class CampoFecha implements ControlValueAccessor, OnInit, OnDestroy {
  camposService = inject(CamposService);
  fechasUtils = inject(FechasUtils);

  nombreCampo = input.required<string>();
  controlForm = input.required<AbstractControl>();
  placeholder = input<string>('dd/mm/aaaa');
  id = input<string>('');
  bloquearFechasPasadas = input<boolean>(false);
  value = input<Date | null>(null);
  formatoFecha = input<string>("dd/MM/yyyy");
  dateChange = output<Date | null>();
  disabled = input<boolean>(false);

  internalValue = signal<Date | null>(null);
  showCalendar = signal<boolean>(false);
  currentDate = signal<Date>(new Date());
  calendarView = signal<VistaCalendario>('days');

  statusSignal!: ReturnType<typeof toSignal>;

  isDisabled = computed(() => this.disabled());

  dateInput = viewChild.required<ElementRef<HTMLInputElement>>('dateInput');
  validationComp = viewChild(FormValidationComponent);

  private onChange = (value: string | null) => { };
  private onTouched = () => { };

  private valueChangesSubscription?: Subscription;
  private validatorChangesSubscription?: Subscription;
  private isSelfUpdate = false;

  readonly monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  readonly weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor() {
    afterNextRender(() => {
      this.statusSignal = toSignal(
        this.formControlGet.statusChanges,
        { initialValue: this.formControlGet.status }
      );
    });

    effect(() => {
      const control = this.formControlGet;
      const value = this.internalValue();

      if (value) {
        const formattedValue = this.fechasUtils.formatearFecha(value, this.formatoFecha());
        if (control.value !== formattedValue) {
          this.isSelfUpdate = true;
          control.setValue(this.fechasUtils.formatearFecha(value, this.formatoFecha()));
          setTimeout(() => this.isSelfUpdate = false);
        }
      }

      if (this.isDisabled()) {
        control.disable();
      }
    });

    effect(() => {
      const value = this.internalValue();
      if (value) {
        this.currentDate.set(this.createSafeDate(value));
      }
    });
  }

  ngOnInit() {
    this.updateCurrentMonth();

    setTimeout(() => {
      const control = this.formControlGet;
      const value = control.value;

      this.esRequerido.set(control.hasValidator(Validators.required));

      this.validatorChangesSubscription = control.statusChanges
        .subscribe(() => {
          this.esRequerido.set(control.hasValidator(Validators.required));
        });

      if (value) {
        let parsedDate: Date | null = null;

        if (typeof value === 'string') {
          parsedDate = this.fechasUtils.parseDate(value, this.formatoFecha());
        } else if (value instanceof Date) {
          parsedDate = this.createSafeDate(value);
        }

        if (parsedDate && this.fechasUtils.isValidDate(parsedDate)) {
          this.internalValue.set(parsedDate);
        }
      }
    });

    this.valueChangesSubscription = this.formControlGet.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(value => {
      if (this.isSelfUpdate) return;

      if (value) {
        let valorFormateado = this.fechasUtils.formatearFecha(value, this.formatoFecha());
        this.internalValue.set(this.fechasUtils.parseDate(valorFormateado, this.formatoFecha()));
      }
    });
  }

  ngOnDestroy() {
    this.valueChangesSubscription?.unsubscribe();
    this.validatorChangesSubscription?.unsubscribe();    
  }

  get formControlGet(): FormControl {
    return this.camposService.formControlGet(this.controlForm());
  }

  hasError = computed(() => {
    const validator = this.validationComp();
    return validator?.hasError() || false;
  });

  controlName = computed(() => {
    return this.camposService.controlName(this.formControlGet);
  });

  esRequerido = signal(false);

  currentMonth = computed(() => {
    const date = this.currentDate();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  currentYear = computed(() => this.currentDate().getFullYear());

  monthYearDisplay = computed(() => {
    const view = this.calendarView();
    const date = this.currentDate();

    if (view === 'years') {
      const startYear = Math.floor(date.getFullYear() / 10) * 10;
      return `${startYear} - ${startYear + 9}`;
    } else if (view === 'months') {
      return `${date.getFullYear()}`;
    } else {
      return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }
  });

  calendarDays = computed(() => {
    if (this.calendarView() !== 'days') return [];

    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);

    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: ICalendario[] = [];
    const today = new Date();
    const selectedDate = this.internalValue();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isToday = this.isSameDay(date, today);
      const isSelected = selectedDate ? this.isSameDay(date, selectedDate) : false;
      const isDisabled = this.isPastDate(date);

      days.push({
        day: date.getDate(),
        date: new Date(date),
        currentMonth: isCurrentMonth,
        selected: isSelected,
        isToday: isToday,
        disabled: isDisabled,
      });
    }

    return days;
  });

  calendarMonths = computed(() => {
    if (this.calendarView() !== 'months') return [];

    const selectedDate = this.internalValue();
    const currentYear = this.currentYear();
    const today = new Date();

    return this.monthNames.map((name, index) => ({
      name,
      index,
      selected: selectedDate ?
        selectedDate.getFullYear() === currentYear && selectedDate.getMonth() === index : false,
      isCurrentMonth: today.getFullYear() === currentYear && today.getMonth() === index
    }));
  });

  calendarYears = computed(() => {
    if (this.calendarView() !== 'years') return [];

    const currentYear = this.currentYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    const selectedDate = this.internalValue();
    const today = new Date();

    const years: Array<{ year: number; selected: boolean; isCurrentYear: boolean }> = [];
    for (let i = startYear; i < startYear + 10; i++) {
      years.push({
        year: i,
        selected: selectedDate ? selectedDate.getFullYear() === i : false,
        isCurrentYear: today.getFullYear() === i
      });
    }

    return years;
  });

  writeValue(value: Date | string | null): void {
    if (value === null || value === undefined) {
      this.internalValue.set(null);
      return;
    }

    let safeDate: Date | null = null;

    if (typeof value === 'string') {
      safeDate = this.fechasUtils.parseDate(value, this.formatoFecha());
    } else if (value instanceof Date) {
      safeDate = this.createSafeDate(value);
    }

    this.internalValue.set(safeDate);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event): void {
    const control = this.formControlGet;
    const input = event.target as HTMLInputElement;
    control.setValue(input.value);
  }

  onInputFocus(): void {
    this.onTouched();
  }

  onInputBlur(): void {
    const control = this.formControlGet;
    const currentDisplay = control.value;
    if (currentDisplay) {
      const parsedDate = this.fechasUtils.parseDate(currentDisplay, this.formatoFecha());
      if (parsedDate && this.fechasUtils.isValidDate(parsedDate)) {
        this.internalValue.set(parsedDate);
      } else {
        control.setValue('');
        this.internalValue.set(null);
        this.onChange(null);
        this.dateChange.emit(null);
      }
    }
  }

  onInputKeydown(event: KeyboardEvent): void {

    if (event.key === 'Enter' || event.key === 'Tab') {
      this.showCalendar.set(false);
    } else if (event.key === 'Escape') {
      this.showCalendar.set(false);
      this.dateInput().nativeElement.blur();
    }
  }

  toggleCalendar(): void {
    if (!this.isDisabled()) {
      this.showCalendar.set(!this.showCalendar());
      if (this.showCalendar()) {
        this.calendarView.set('days');
        this.updateCurrentMonth();
      }
    }
  }

  closeCalendar(): void {
    this.showCalendar.set(false);
    this.calendarView.set('days');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.input-date-container')) {
      this.closeCalendar();
    }
  }

  navigatePrevious(): void {
    const view = this.calendarView();
    const current = this.currentDate();

    if (view === 'days') {
      this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    } else if (view === 'months') {
      this.currentDate.set(new Date(current.getFullYear() - 1, current.getMonth(), 1));
    } else if (view === 'years') {
      this.currentDate.set(new Date(current.getFullYear() - 10, current.getMonth(), 1));
    }
  }

  navigateNext(): void {
    const view = this.calendarView();
    const current = this.currentDate();

    if (view === 'days') {
      this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    } else if (view === 'months') {
      this.currentDate.set(new Date(current.getFullYear() + 1, current.getMonth(), 1));
    } else if (view === 'years') {
      this.currentDate.set(new Date(current.getFullYear() + 10, current.getMonth(), 1));
    }
  }

  onHeaderClick(): void {
    const view = this.calendarView();
    if (view === 'days') {
      this.calendarView.set('months');
    } else if (view === 'months') {
      this.calendarView.set('years');
    }
  }

  selectDate(date: Date): void {
    if (this.isPastDate(date)) {
      return;
    }

    this.internalValue.set(new Date(date));
    this.showCalendar.set(false);
    this.calendarView.set('days');
    const formattedDate = this.fechasUtils.formatearFecha(this.internalValue(), this.formatoFecha());
    this.onChange(formattedDate);
    this.dateChange.emit(this.internalValue());
    this.onTouched();
  }

  selectMonth(monthIndex: number): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), monthIndex, 1));
    this.calendarView.set('days');
  }

  selectYear(year: number): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(year, current.getMonth(), 1));
    this.calendarView.set('months');
  }

  selectToday(): void {
    const today = new Date();
    this.selectDate(today);
  }

  clearDate(): void {
    this.internalValue.set(null);
    this.showCalendar.set(false);
    this.onChange(null);
    this.dateChange.emit(null);
    this.onTouched();
  }

  private updateCurrentMonth(): void {
    const value = this.internalValue();
    if (value) {
      this.currentDate.set(new Date(value.getFullYear(), value.getMonth(), 1));
    } else {
      const today = new Date();
      this.currentDate.set(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  private isPastDate(date: Date): boolean {
    if (!this.bloquearFechasPasadas()) return false;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return compareDate < todayStart;
  }

  private createSafeDate(date: Date | string): Date {
    const fechaObj = typeof date === 'string' ? new Date(date) : date;

    if (!(fechaObj instanceof Date) || isNaN(fechaObj.getTime())) {
      console.error('Fecha inválida:', date);
      return new Date();
    }

    return new Date(fechaObj.getFullYear(), fechaObj.getMonth(), fechaObj.getDate());
  }
}