import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  phosphorCloudLightning,
  phosphorCloudSnow,
  phosphorCloudRain,
  phosphorSnowflake,
  phosphorCloudFog,
  phosphorSun,
  phosphorMoon,
  phosphorCloud,
  phosphorWind,
  phosphorDrop,
  phosphorUmbrellaSimple,
  phosphorMapPinSimple,
  phosphorPlus,
} from '@ng-icons/phosphor-icons/regular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIconComponent],
  providers: [
    provideIcons({
      phosphorCloudLightning,
      phosphorCloudSnow,
      phosphorCloudRain,
      phosphorSnowflake,
      phosphorCloudFog,
      phosphorSun,
      phosphorMoon,
      phosphorCloud,
      phosphorWind,
      phosphorDrop,
      phosphorUmbrellaSimple,
      phosphorMapPinSimple,
      phosphorPlus,
    }),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
