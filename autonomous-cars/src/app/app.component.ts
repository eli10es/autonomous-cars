import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarComponent } from './Components/car/car.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'autonomous-cars';
}
