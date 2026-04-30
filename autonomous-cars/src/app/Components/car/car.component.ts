import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Car } from '../../Interfaces/car';
import { Location } from '../../Interfaces/location';
import { NetworkService } from '../../Services/network.service';
import { EncounteredEvent } from '../../Interfaces/event';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-car',
  imports: [ReactiveFormsModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarComponent implements OnInit, Car, Location, OnDestroy {
  manufacturer!: string;
  model!: string;
  ID!: number;
  x!: number;
  y!: number;
  speed!: number;
  encounteredEvents: string[] = [];
  receivedEvents: { from: number; event: string }[] = [];
  eventToSend = new FormControl<string>('');
  carToSend = new FormControl<string>('');
  receivedEvent: any;
  showClosestCar: boolean = false;
  showDistanceToAnotherCar: boolean = false;

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
    this.encounteredEvents.push(this.randomEncounteredEvent());
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
      const event = this.randomEncounteredEvent();
      if (!this.encounteredEvents.includes(event)) {
        this.encounteredEvents.push(event);
        this.changeDetector.detectChanges();
      }
    }, 10000);
    this.receivedEvent = this.carNetworkService.event$.subscribe((data) => {
      this.receiveData(data);
    });
  }

  receiveData(data: EncounteredEvent) {
    if (!data) {
      return;
    }

    if (data.IDto === this.ID) {
      this.receivedEvents.push({ from: data.IDFrom, event: data.event });
      this.changeDetector.detectChanges();
    }
  }

  getCars() {
    const cars = this.carNetworkService.getCars();
    return cars;
  }

  getClosestCar() {
    const closestCar = this.carNetworkService.getClosestCar(this.x, this.y);
    this.showClosestCar = true;
    return `${closestCar?.model} ID:${closestCar?.ID}`;
  }

  hideClosestCar() {
    this.showClosestCar = false;
  }

  calculateDistanceToOtherCar(ID: string) {
    this.showDistanceToAnotherCar = true;
    return this.carNetworkService.calculateDistanceBetween2Cars(
      Number(ID),
      this.x,
      this.y,
    );
  }

  hideDistance() {
    this.showDistanceToAnotherCar = false;
  }

  changeSpeed(newSpeed: string) {
    this.speed = Number(newSpeed);
  }

  sendEvent() {
    const event = this.eventToSend.value;
    const carTo = this.carToSend.value;
    const carFrom = this.ID;

    this.carNetworkService.sendData({
      event: event as string,
      IDFrom: carFrom,
      IDto: Number(carTo),
    });
  }

  ngOnDestroy(): void {
    this.receivedEvent.unsubscribe();
  }
}
