import { Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-header-section',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './header-section.html',
  styleUrl: './header-section.css',
})
export class HeaderSection {
  title = input.required<string>();
  subtitle = input<string>('');
}
