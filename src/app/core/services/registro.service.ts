import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AdminInfo, CategoriasInfo, ClubInfo, RamasInfo, RegistroData, StepNumber } from '../models/registro.models';
import { AuthApiService } from './apis/auth.api.services';
import { ICategoria, IRama, IRegistrarClub } from '../interfaces/apis/auth/IRegistrarClub';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private readonly storageKey = 'registro_temp_data';
  private authApiService = inject(AuthApiService);

  private dataSignal = signal<RegistroData>(this.getInitialData());
  private stepSignal = signal<StepNumber>(1);

  readonly data = this.dataSignal.asReadonly();
  readonly step = this.stepSignal.asReadonly();

  readonly canGoNext = computed(() => {
    const currentStep = this.step();
    return this.validateStep(currentStep);
  });

  readonly canGoPrev = computed(() => this.step() > 1);
  readonly isLastStep = computed(() => this.step() === 4);
  readonly isSuccessStep = computed(() => this.step() === 5);

  readonly progreso = computed(() => {
    const step = this.step();
    return step === 5 ? 100 : (step - 1) * 25;
  });

  constructor() {
    effect(() => {
      const currentData = this.dataSignal();
      localStorage.setItem(this.storageKey, JSON.stringify(currentData));
    });

    this.loadFromStorage();
  }

  private getInitialData(): RegistroData {
    return {
      club: {
        nombre: '',
        deporteId: null,
        ciudadId: null,
        telefono: '',
        email: '',
        direccion: '',
        descripcion: '',
        departamentoId: null
      },
      ramas: {
        masculina: false,
        femenina: false,
        nombreMasculina: '',
        nombreFemenina: ''
      },
      categorias: {
        masculina: ['M-14', 'M-18', 'Tercera', 'Segunda', 'Primera'],
        femenina: ['M-14', 'M-18', 'Tercera', 'Segunda', 'Primera']
      },
      admin: {
        nombres: '',
        apellidos: '',
        documento: '',
        telefono: '',
        email: '',
        password: '',
        confirmPassword: '',
        aceptaTerminos: false,
        aceptaComunicaciones: false
      }
    };
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.dataSignal.set(data);
      } catch (e) {
        console.error('Error loading saved data', e);
      }
    }
  }

  updateClubData(club: Partial<ClubInfo>): void {
    this.dataSignal.update(current => ({
      ...current,
      club: { ...current.club, ...club }
    }));
  }

  updateRamasData(ramas: Partial<RamasInfo>): void {
    this.dataSignal.update(current => ({
      ...current,
      ramas: { ...current.ramas, ...ramas }
    }));
  }

  updateCategoriasData(categorias: Partial<CategoriasInfo>): void {
    this.dataSignal.update(current => ({
      ...current,
      categorias: { ...current.categorias, ...categorias }
    }));
  }

  updateAdminData(admin: Partial<AdminInfo>): void {
    this.dataSignal.update(current => ({
      ...current,
      admin: { ...current.admin, ...admin }
    }));
  }

  goToStep(step: StepNumber): void {
    if (step >= 1 && step <= 5) {
      this.stepSignal.set(step);
    }
  }

  nextStep(): void {
    const current = this.stepSignal();
    if (current < 5) {
      this.stepSignal.set((current + 1) as StepNumber);
    }
  }

  prevStep(): void {
    const current = this.stepSignal();
    if (current > 1) {
      this.stepSignal.set((current - 1) as StepNumber);
    }
  }

  resetForm(): void {
    localStorage.removeItem(this.storageKey);
    this.dataSignal.set(this.getInitialData());
    this.stepSignal.set(1);
  }

  submitRegistro(): void {
    const data = this.dataSignal();
    const datosApi = this.prepararCuerpo(data);
    this.authApiService.registrarClub(datosApi).subscribe();
   // localStorage.removeItem(this.storageKey);
  }

  prepararCuerpo(datosTemporales: RegistroData): IRegistrarClub {
    debugger;
    const ramas: IRama[] = [];
    const categorias: ICategoria[] = [];

    if (datosTemporales.ramas.masculina) {
      ramas.push(
        {
          tipoRamaId: 1,
          nombre: datosTemporales.ramas.nombreMasculina == "" ? 'Rama Masculina' : datosTemporales.ramas.nombreMasculina,
          descripcion: ''
        }
      );

      datosTemporales.categorias.masculina.forEach(cat => {
        categorias.push({
          nombre: cat,
          ramaNombre: datosTemporales.ramas.nombreMasculina == "" ? 'Rama Masculina' : datosTemporales.ramas.nombreMasculina,
          descripcion: ''
        });
      });
    }

    if (datosTemporales.ramas.femenina) {
      ramas.push(
        {
          tipoRamaId: 2,
          nombre: datosTemporales.ramas.nombreFemenina == "" ? 'Rama Femenina' : datosTemporales.ramas.nombreFemenina,
          descripcion: ''
        }
      );

      datosTemporales.categorias.femenina.forEach(cat => {
        categorias.push({
          nombre: cat,
          ramaNombre: datosTemporales.ramas.nombreFemenina == "" ? 'Rama Femenina' : datosTemporales.ramas.nombreFemenina,
          descripcion: ''
        });
      });
    }

    if (!datosTemporales.ramas.masculina && !datosTemporales.ramas.femenina) {
      ramas.push(
        {
          tipoRamaId: 3,
          nombre: 'Mixta',
          descripcion: ''
        }
      );

      datosTemporales.categorias.masculina.forEach(cat => {
        categorias.push({
          nombre: cat,
          ramaNombre: 'Mixta',
          descripcion: ''
        });
      });
    }

    const datos: IRegistrarClub = {
      nombre: datosTemporales.club.nombre,
      deporteId: datosTemporales.club.deporteId!,
      ciudadId: datosTemporales.club.ciudadId!,
      direccion: datosTemporales.club.direccion,
      telefono: datosTemporales.club.telefono,
      email: datosTemporales.club.email,
      descripcion: datosTemporales.club.descripcion,
      ramas: ramas,
      adminEmail: datosTemporales.admin.email,
      adminUsername: '',
      adminPassword: datosTemporales.admin.password,
      adminNombre: datosTemporales.admin.nombres,
      adminApellido: datosTemporales.admin.apellidos,
      adminDocumento: datosTemporales.admin.documento,
      adminTelefono: datosTemporales.admin.telefono,
      categorias: categorias
    };

    return datos;
  }

  // Validaciones
  validateStep(step: StepNumber): boolean {
    const data = this.dataSignal();

    switch (step) {
      case 1:
        return this.validateStep1(data.club);
      case 2:
        return true; // Paso 2 siempre válido
      case 3:
        return this.validateStep3(data.categorias, data.ramas);
      case 4:
        return this.validateStep4(data.admin);
      default:
        return true;
    }
  }

  private validateStep1(club: ClubInfo): boolean {
    return !!(
      club.nombre?.trim() &&
      club.deporteId &&
      club.ciudadId &&
      club.departamentoId &&
      club.telefono?.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(club.email)
    );
  }

  private validateStep3(categorias: CategoriasInfo, ramas: RamasInfo): boolean {
    if (!ramas.masculina && !ramas.femenina) {
      return categorias.masculina.length > 0;
    }

    let valid = true;
    if (ramas.masculina) {
      valid = valid && categorias.masculina.length > 0;
    }
    if (ramas.femenina) {
      valid = valid && categorias.femenina.length > 0;
    }
    return valid;
  }

  private validateStep4(admin: AdminInfo): boolean {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email);
    const passwordValid = admin.password.length >= 8;
    const passwordsMatch = admin.password === admin.confirmPassword;
    const termsAccepted = admin.aceptaTerminos;

    return !!(
      admin.nombres?.trim() &&
      admin.documento?.trim() &&
      admin.telefono?.trim() &&
      emailValid &&
      passwordValid &&
      passwordsMatch &&
      termsAccepted
    );
  }
}