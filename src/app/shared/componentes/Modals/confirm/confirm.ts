import { Component, inject } from '@angular/core';
import { ModalesService } from '../../../servicios/modales.service';

@Component({
  selector: 'app-confirm',
  imports: [],
  templateUrl: './confirm.html',
  styleUrl: './confirm.css'
})
export class Confirm {
   confirmService = inject(ModalesService);
 }
