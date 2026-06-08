import { Component } from '@angular/core';
import { HeroComponent } from '../../shared/components/hero/hero';
import { HeaderSection } from '../../shared/components/header-section/header-section';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, HeaderSection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
