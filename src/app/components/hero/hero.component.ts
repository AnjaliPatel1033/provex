import { Component, HostListener, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Preload all 7 frames for a buttery smooth cinematic experience
    if (isPlatformBrowser(this.platformId)) {
      for (let i = 1; i <= 7; i++) {
        const img = new Image();
        img.src = `images/hero-seq/frame-${i}.jpg`;
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const element = this.heroSection.nativeElement;
    const rect = element.getBoundingClientRect();
    const scrollEnd = element.scrollHeight - window.innerHeight;
    
    let progress = -rect.top / scrollEnd;
    if (progress <= 0) progress = 0;
    if (progress >= 1) progress = 1;
    
    element.style.setProperty('--scroll', progress.toString());
    
    // Calculate precise cross-fades between the 7 images to simulate a 3D video sequence
    for (let i = 1; i <= 7; i++) {
      const peak = (i - 1) / 6;
      let opacity = 1 - Math.abs(progress - peak) * 6;
      if (opacity < 0) opacity = 0;
      element.style.setProperty(`--frame-${i}`, opacity.toString());
    }

    // Calculate cinematic text opacity with tighter bounds so they fade out faster
    element.style.setProperty('--text-1', Math.max(0, 1 - Math.abs(progress * 4)).toString());
    element.style.setProperty('--text-2', Math.max(0, 1 - Math.abs((progress - 0.5) * 4)).toString());
    element.style.setProperty('--text-3', Math.max(0, 1 - Math.abs((progress - 1) * 4)).toString());
    
    // Calculate text-2 scale dynamically (since CSS abs() causes issues with preprocessors)
    element.style.setProperty('--scale-2', (1 + Math.abs(progress - 0.5) * 2).toString());
  }
}
