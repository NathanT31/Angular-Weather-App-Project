import { Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-float-info-button',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './float-info-button.component.html',
  styleUrl: './float-info-button.component.css',
})
export class FloatInfoButtonComponent {
  hover: boolean = false;
  openModal: boolean = false;

  developerName = 'NathanT31';
  developerGithub = 'https://github.com/NathanT31';
  githubLink = 'https://github.com/NathanT31/Angular-Weather-App-Project';
  year = '2024';
}
