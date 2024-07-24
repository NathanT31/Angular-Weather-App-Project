import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TemperatureUnitService {
  temperatureUnit = signal('Fahrenheit');

  constructor() {}

  setTemperatureUnit(unit: string) {
    this.temperatureUnit.set(unit);
  }
}
