import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Alerta } from "./shared/componentes/Alerta/Alerta";
import { Confirm } from "./shared/componentes/Modals/confirm/confirm";
import { Loading } from "./shared/componentes/loading/loading";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Alerta, Confirm, Loading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TryvoraFrontend');
}
