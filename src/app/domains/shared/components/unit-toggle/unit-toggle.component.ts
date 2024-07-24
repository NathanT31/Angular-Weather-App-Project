import { Component, inject } from '@angular/core';
import { TemperatureUnitService } from '@shared/services/temperature-unit.service';

@Component({
  selector: 'app-unit-toggle',
  standalone: true,
  imports: [],
  templateUrl: './unit-toggle.component.html',
  styleUrl: './unit-toggle.component.css',
})
export class UnitToggleComponent {
  private temperatureUnitService = inject(TemperatureUnitService);

  onUnitChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const unit = input.checked ? 'Celsius' : 'Fahrenheit';
    this.temperatureUnitService.setTemperatureUnit(unit);
  }
}
