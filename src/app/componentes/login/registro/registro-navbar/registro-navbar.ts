import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro-navbar',
  imports: [RouterLink],
  templateUrl: './registro-navbar.html',
  styleUrl: './registro-navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroNavbar { }
