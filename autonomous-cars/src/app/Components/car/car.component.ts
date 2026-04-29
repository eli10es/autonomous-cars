import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Car } from '../../Interfaces/car';
import { Location } from '../../Interfaces/location';
import { NetworkService } from '../../Services/network.service';

@Component({
  selector: 'app-car',
  imports: [],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarComponent implements OnInit, Car, Location {
  manufacturer!: string;
  model!: string;
  ID!: number;
  x!: number;
  y!: number;
  speed!: number;
  encounteredEvents: string[] = [];

  constructor(
    private carNetworkService: NetworkService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  randomCar(): {
    manufacturer: string;
    model: string;
    ID: number;
    x: number;
    y: number;
    speed: number;
  } {
    const models = ['A4', 'A6', 'A8', 'R8', 'RS7'];

    const randomModel = models[Math.floor(Math.random() * models.length)];
    const randomID = Math.floor(Math.random() * 10) + 1;
    const randomX = Math.floor(Math.random() * 100);
    const randomY = Math.floor(Math.random() * 100);
    const randomSpeed = Math.floor(Math.random() * 120) + 1;
    return {
      manufacturer: 'Audi',
      model: randomModel,
      ID: randomID,
      x: randomX,
      y: randomY,
      speed: randomSpeed,
    };
  }

  randomEncounteredEvent(): string {
    const events = ['Accident', 'Traffic', 'Road Work', 'Police'];
    return events[Math.floor(Math.random() * events.length)];
  }

  ngOnInit(): void {
    const car = this.randomCar();
    this.manufacturer = car.manufacturer;
    this.model = car.model;
    this.ID = car.ID;
    this.x = car.x;
    this.y = car.y;
    this.speed = car.speed;
    this.carNetworkService.addCar({
      manufacturer: this.manufacturer,
      model: this.model,
      ID: this.ID,
      x: this.x,
      y: this.y,
      speed: this.speed,
      encounteredEvents: this.encounteredEvents,
    } as CarComponent);
    setInterval(() => {
      this.encounteredEvents.push(this.randomEncounteredEvent());
      this.changeDetector.detectChanges();
    }, 10000);
  }

  getCars() {
    const cars = this.carNetworkService.getCars();
    return cars;
  }

  getClosestCar() {
    const closestCar = this.carNetworkService.getClosestCar(this.x, this.y);
    console.log(closestCar);
  }

  changeSpeed(newSpeed: string) {
    this.speed = Number(newSpeed);
  }
}
