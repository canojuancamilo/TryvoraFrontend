import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IStepd } from '../../../../core/interfaces/registro';

@Component({
  selector: 'app-registro-stepper',
  imports: [],
  templateUrl: './registro-stepper.html',
  styleUrl: './registro-stepper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroStepper {
  currentStep = input<number>(1);

  steps = input<IStepd[]>([{ number: 1, label: 'Club' },
  { number: 2, label: 'Ramas' },
  { number: 3, label: 'Categorías' },
  { number: 4, label: 'Admin' }]);
}
