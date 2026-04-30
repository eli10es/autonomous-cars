import { Injectable } from '@angular/core';
import { CarComponent } from '../Components/car/car.component';
import { BehaviorSubject } from 'rxjs';
import { EncounteredEvent } from '../Interfaces/event';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor() {}

  private cars: CarComponent[] = [];

  private eventsData = new BehaviorSubject<EncounteredEvent>({
    event: '',
    IDFrom: 0,
    IDto: 0,
  });

  event$ = this.eventsData.asObservable();

  sendData(event: EncounteredEvent) {
    this.eventsData.next(event);
  }

  addCar(car: CarComponent) {
    this.cars.push(car);
  }

  getCars(): CarComponent[] {
    return this.cars;
  }

  getCarById(ID: number) {
    for (const car of this.cars) {
      if (car.ID === ID) return car;
    }
    return null;
  }

  calculateDistanceBetween2Cars(carId: number, x: number, y: number) {
    const car = this.getCarById(carId);
    return this.calculateDistance(car as CarComponent, x, y);
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
