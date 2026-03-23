// src/app/app.component.ts
import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Confirm } from "./shared/componentes/Modals/confirm/confirm";
import { Loading } from "./shared/componentes/loading/loading";
import { Toast } from "./shared/componentes/toast/toast";
import { ScrollService } from './core/services/scroll.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Confirm, Loading, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TryvoraFrontend');  
  private scrollService = inject(ScrollService);
}