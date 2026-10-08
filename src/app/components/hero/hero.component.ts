import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  isLoaded = false;

  ngOnInit() {
    // Trigger initial load animation after a short delay
    setTimeout(() => {
      this.isLoaded = true;
    }, 100);
  }
}
