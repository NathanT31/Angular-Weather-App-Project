import { Component, inject, signal } from '@angular/core';
import { WeatherData } from '@shared/models/weather-data.models';
import { WeatherService } from '@shared/services/weather.service';
import { addSeconds, format, fromUnixTime } from 'date-fns';
import { UpperCasePipe, DecimalPipe } from '@angular/common';
import { CityFinderComponent } from '@shared/components/city-finder/city-finder.component';

import { WEATHERCOLORS } from '@shared/constants/weather-colors';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [UpperCasePipe, DecimalPipe, CityFinderComponent],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.css',
})
export class WeatherCardComponent {
  data = signal<WeatherData | null>(null);
  date = signal<string[]>([]);

  weatherColors = WEATHERCOLORS;

  private weatherService = inject(WeatherService);

  // ngOnInit() {
  //   this.weatherService.getWheaterById(4164138).subscribe({
  //     next: (weatherData) => {
  //       this.data.set(weatherData);
  //       this.formatDate();
  //       console.log(weatherData);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  ngOnInit() {
    this.weatherService.getWheaterByCoords(19.4326296, -99.1331785).subscribe({
      next: (weatherData) => {
        this.data.set(weatherData);
        this.formatDate();
        console.log(weatherData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  formatDate() {
    if (this.data) {
      const unixTimestamp = this.data()!.dt;
      const timezoneOffset = this.data()!.timezone;
      const utcDate = fromUnixTime(unixTimestamp);
      const localOffset = new Date().getTimezoneOffset() * 60;
      const cityDate = addSeconds(utcDate, timezoneOffset + localOffset);

      const dayOfWeek = format(cityDate, 'EEEE');
      const dayAndMonth = format(cityDate, 'MMMM d');
      const time = format(cityDate, 'HH:mm');

      this.date.set([dayOfWeek, dayAndMonth, time]);
    }
  }

  getColorClass(state: string);
}
