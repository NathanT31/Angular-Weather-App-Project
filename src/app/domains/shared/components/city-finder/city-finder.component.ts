import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { City } from '@shared/models/city.models';
import { WeatherService } from '@shared/services/weather.service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-city-finder',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent],
  templateUrl: './city-finder.component.html',
  styleUrl: './city-finder.component.css',
})
export class CityFinderComponent {
  @Input({ required: true }) cityName?: string = '';
  isFocused = signal<boolean>(false);
  cities: City[] = [];

  @Output() focusChange = new EventEmitter<boolean>();
  @Output() selectedCityCoords = new EventEmitter<{
    lat: number;
    lon: number;
  }>();

  findCityCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  private weatherService = inject(WeatherService);

  constructor() {
    this.findCityCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((query: string) => query.trim().length > 0),
        switchMap((query) => this.weatherService.searchCities(query))
      )
      .subscribe((results) => (this.cities = results));
  }

  onFocus() {
    this.isFocused.set(true);
    this.focusChange.emit(true);
  }

  onBlur() {
    setTimeout(() => {
      this.isFocused.set(false);
      this.focusChange.emit(false);
    }, 200);
  }

  onHandleSelectedCity(lat: number, lon: number) {
    this.emitCoordinates({ lat, lon });
  }

  emitCoordinates(coords: { lat: number; lon: number }) {
    this.selectedCityCoords.emit(coords);
  }
}
