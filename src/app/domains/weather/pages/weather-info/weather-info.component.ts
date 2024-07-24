import {
  Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { WeatherCardComponent } from '@weather/components/weather-card/weather-card.component';
import { UnitToggleComponent } from '@shared/components/unit-toggle/unit-toggle.component';

@Component({
  selector: 'app-weather-info',
  standalone: true,
  imports: [WeatherCardComponent, NgIconComponent, UnitToggleComponent],
  templateUrl: './weather-info.component.html',
  styleUrl: './weather-info.component.css',
})
export class WeatherInfoComponent {
  @ViewChild('weatherCardContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;
  weatherCards: ComponentRef<WeatherCardComponent>[] = [];

  addWeatherCard() {
    if (this.weatherCards.length < 3) {
      const componentRef = this.container.createComponent(WeatherCardComponent);
      componentRef.instance.remove.subscribe(() =>
        this.removeWeatherCard(componentRef)
      );

      this.weatherCards.push(componentRef);
    }
  }

  removeWeatherCard(componentRef: ComponentRef<WeatherCardComponent>) {
    const index = this.weatherCards.indexOf(componentRef);
    if (index !== -1) {
      this.weatherCards.splice(index, 1);
      componentRef.destroy();
    }
  }
}
