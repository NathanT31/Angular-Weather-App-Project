import {
  Component,
  effect,
  EventEmitter,
  inject,
  OnInit,
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

  unit = signal(this.temperatureUnitService.getTemperatureUnit());

  private readonly iconMap: { [key: string]: any } = {
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
    // Suscripción a los cambios en el servicio de unidad de temperatura
    this.temperatureUnitService.temperatureUnit$.subscribe((newUnit) => {
      this.unit.set(newUnit); // Actualiza la señal 'unit'
    });

    // Effect para refrescar la tarjeta cuando cambie la señal 'unit'
    effect(() => {
      this.refreshCard();
    });
  }

  // ngOnInit(): void {
  //   this.fetchData();
  // }

  private fetchData() {
    this.weatherService
      .getWheaterByCoords(
        this.coordinates().lat,
        this.coordinates().lon,
        this.unit()
      )
      .subscribe({
        next: (weatherData) => {
          this.data.set(weatherData);
          this.formatDate();
          this.setWeatherIcon(weatherData.weather[0].main);
          console.log('fetching data...');
        },
        error: (err) => {
          console.error('Error fetching weather data:', err);
        },
      });
  }

  private formatDate() {
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

  private setWeatherIcon(weatherState: string) {
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
      this.refreshCard();
    }
  }

  refreshCard() {
    this.fetchData();
    console.log('refreshing card...');
  }

  removeCard() {
    this.remove.emit();
  }
}
