import { Component } from '@angular/core';
import { WeatherCardComponent } from '@weather/components/weather-card/weather-card.component';

@Component({
  selector: 'app-weather-info',
  standalone: true,
  imports: [WeatherCardComponent],
  templateUrl: './weather-info.component.html',
  styleUrl: './weather-info.component.css',
})
export class WeatherInfoComponent {}
