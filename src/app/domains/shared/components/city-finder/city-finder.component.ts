import { Component, inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { City } from '@shared/models/city.models';
import { WeatherService } from '@shared/services/weather.service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-city-finder',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './city-finder.component.html',
  styleUrl: './city-finder.component.css',
})
export class CityFinderComponent {
  @Input({ required: true }) cityName?: string = '';
  cities: City[] = [];

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
}
