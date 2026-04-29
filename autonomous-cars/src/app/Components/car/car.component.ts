import { Component, OnInit } from '@angular/core';
import { Car } from '../../Interfaces/car';
import { Location } from '../../Interfaces/location';

@Component({
  selector: 'app-car',
  imports: [],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css',
})
export class CarComponent implements OnInit, Car, Location {
  manufacturer!: string;
  model!: string;
  ID!: number;
  x!: number;
  y!: number;
  speed!: number;
  encounteredEvents: string[] = [];

  constructor() {}

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
    console.log(car);
    setInterval(() => {
      this.encounteredEvents.push(this.randomEncounteredEvent());
    }, 10000);
  }
}
