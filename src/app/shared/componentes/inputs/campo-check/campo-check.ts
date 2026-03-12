import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CamposService } from '../../../servicios/campos.service';

@Component({
  selector: 'app-campo-check',
  imports: [ReactiveFormsModule],
  templateUrl: './campo-check.html',
  styleUrl: './campo-check.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampoCheck {
  camposService = inject(CamposService);
  
  textoCampo = input.required<string>();
  controlForm = input.required<AbstractControl>();

   get formControlGet(): FormControl {
    return this.camposService.formControlGet(this.controlForm());
  }

 }
