import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherData } from '@shared/models/weather-data.models';
import { City } from '@shared/models/city.models';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiKey = '1de4868bd9d256de0f112493591c7678';

  constructor() {}

  getWheaterByCoords(lat: number, lon: number, units: string = 'Fahrentheit') {
    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lon', lon.toString());
    if (units === 'Celsius') {
      url.searchParams.set('units', 'metric');
    } else {
      url.searchParams.set('units', 'imperial');
    }
    url.searchParams.set('appid', this.apiKey);

    return this.http.get<WeatherData>(decodeURIComponent(url.toString()));
  }

  getWheaterById(cityId: number) {
    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.searchParams.set('id', cityId.toString());
    url.searchParams.set('units', 'imperial');
    url.searchParams.set('appid', this.apiKey);

    return this.http.get<WeatherData>(decodeURIComponent(url.toString()));
  }

  searchCities(query: string) {
    const url = new URL('http://api.openweathermap.org/geo/1.0/direct');
    url.searchParams.set('q', query);
    url.searchParams.set('limit', '5');
    url.searchParams.set('appid', this.apiKey);

    return this.http.get<City[]>(decodeURIComponent(url.toString()));
  }
}
