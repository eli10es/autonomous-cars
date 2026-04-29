import { Injectable } from '@angular/core';
import { CarComponent } from '../Components/car/car.component';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor() {}

  

  private cars: CarComponent[] = [];

  addCar(car: CarComponent) {
    this.cars.push(car);
  }

  getCars(): CarComponent[] {
    return this.cars;
  }

  getClosestCar(x: number, y: number): CarComponent | null {
    if (this.cars.length === 1) {
      return null;
    }
    let closestCar: CarComponent | null = null;
    let minDistance = Infinity;

    for (const car of this.cars) {
      if (car.x === x && car.y === y) {
        continue;
      } else {
        const distance = this.calculateDistance(car, x, y);
        if (distance < minDistance) {
          minDistance = distance;
          closestCar = car;
        }
      }
    }
    return closestCar;
  }

  calculateDistance(car: CarComponent, x: number, y: number): number {
    return Math.sqrt((car.x - x) ** 2 + (car.y - y) ** 2);
  }
}
