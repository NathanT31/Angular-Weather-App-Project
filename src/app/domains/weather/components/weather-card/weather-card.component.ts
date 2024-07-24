import {
  Component,
  effect,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import { WeatherData } from '@shared/models/weather-data.models';
import { WeatherService } from '@shared/services/weather.service';
import { TemperatureUnitService } from '@shared/services/temperature-unit.service';
import { addSeconds, format, fromUnixTime } from 'date-fns';
import { UpperCasePipe, DecimalPipe } from '@angular/common';
import { CityFinderComponent } from '@shared/components/city-finder/city-finder.component';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [UpperCasePipe, DecimalPipe, CityFinderComponent, NgIconComponent],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.css',
})
export class WeatherCardComponent {
  data = signal<WeatherData | null>(null);
  date = signal<string[]>([]);
  weatherIcon = signal<string>('');
  night = signal<boolean>(false);
  isSearchBarFocused = signal<boolean>(false);

  @Output() remove = new EventEmitter<void>();

  private weatherService = inject(WeatherService);
  private temperatureUnitService = inject(TemperatureUnitService);

  unit = this.temperatureUnitService.temperatureUnit;

  private iconMap: { [key: string]: any } = {
    Thunderstorm: 'phosphorCloudLightning',
    Drizzle: 'phosphorCloudSnow',
    Rain: 'phosphorCloudRain',
    Snow: 'phosphorSnowflake',
    Atmosphere: 'phosphorCloudFog',
    Clear: 'phosphorSun',
    Night: 'phosphorMoon',
    Clouds: 'phosphorCloud',
  };

  coordinates = signal<{ lat: number; lon: number }>({
    lat: 0,
    lon: 0,
  });

  constructor() {
    effect(() => {
      this.fetchData(this.coordinates());
    });
  }

  ngAfterViewInit() {
    this.fetchData(this.coordinates());
  }

  fetchData(coordinates: { lat: number; lon: number }) {
    this.weatherService
      .getWheaterByCoords(coordinates.lat, coordinates.lon, this.unit())
      .subscribe({
        next: (weatherData) => {
          this.data.set(weatherData);
          this.formatDate();
          this.setWeatherIcon(weatherData.weather[0].main);
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

      const hour = parseInt(format(cityDate, 'HH'), 10);
      this.night.set(hour < 6 || hour >= 18);
    }
  }

  setWeatherIcon(weatherState: string) {
    this.weatherIcon.set(
      this.night() && weatherState === 'Clear'
        ? 'phosphorMoon'
        : this.iconMap[weatherState] || 'phosphorSun'
    );
  }

  getColorClass(state: string | undefined) {
    if (state) return `bg-${state}`;
    return;
  }

  onFocusChange(isFocused: boolean) {
    this.isSearchBarFocused.set(isFocused);
  }

  onCoordinatesChange(coords: { lat: number; lon: number }) {
    if (coords) {
      this.coordinates.set(coords);
      this.fetchData(this.coordinates());
    }
  }

  removeCard() {
    this.remove.emit();
  }
}
