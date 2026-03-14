import { Injectable, signal } from '@angular/core';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activitiesSignal = signal<Activity[]>([
    { icon: 'building-add', bg: '#EEF2FF', color: '#4F46E5', text: '<strong>Club Fútbol Sala Centro</strong> se registró en la plataforma', time: 'Hace 15 min' },
    { icon: 'person-check-fill', bg: '#ECFDF5', color: '#059669', text: '<strong>47 jugadores</strong> actualizaron su estado de pago en Club Atlético Norte', time: 'Hace 1 hora' },
    { icon: 'currency-euro', bg: '#FFFBEB', color: '#D97706', text: 'Ingreso de <strong>€2,800</strong> registrado en CD Montaña FC', time: 'Hace 2 horas' },
    { icon: 'exclamation-triangle-fill', bg: '#FEF2F2', color: '#DC2626', text: 'Club <strong>Voleibol Playa</strong> fue suspendido por falta de pago', time: 'Hace 3 horas' },
    { icon: 'bell-fill', bg: '#ECFEFF', color: '#0891B2', text: 'Notificación de recordatorio enviada a <strong>43 jugadores deudores</strong>', time: 'Hace 5 horas' },
    { icon: 'person-plus-fill', bg: '#EEF2FF', color: '#4F46E5', text: '<strong>Natación Rápida</strong> añadió 3 nuevos jugadores', time: 'Ayer, 18:30' }
  ]);

  readonly activities = this.activitiesSignal.asReadonly();
}