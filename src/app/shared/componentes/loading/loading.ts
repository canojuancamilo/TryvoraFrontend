import { Component, inject } from '@angular/core';
import { LoadingService } from '../../servicios/loading.service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl:'./loading.css'
})
export class Loading { 
  loadingService = inject(LoadingService);
}
