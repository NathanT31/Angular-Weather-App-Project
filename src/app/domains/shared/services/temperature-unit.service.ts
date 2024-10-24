import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemperatureUnitService {
  private temperatureUnit = new BehaviorSubject<string>('Fahrenheit');

  // Observable para que otros componentes puedan suscribirse a los cambios
  temperatureUnit$ = this.temperatureUnit.asObservable();

  constructor() {}

  setTemperatureUnit(unit: string) {
    this.temperatureUnit.next(unit);
  }

  getTemperatureUnit() {
    return this.temperatureUnit.getValue();
  }
}
