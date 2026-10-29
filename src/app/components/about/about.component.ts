import { Component, ElementRef, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {
  yearsCount = 0;
  projectsCount = 0;
  toleranceDev = 0;
  qualityRate = 0;
  private hasAnimated = false;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initCounterObserver();
    }
  }

  private initCounterObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this.el.nativeElement);
  }

  private animateCounters() {
    const duration = 1800; // ms
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      this.yearsCount = Math.floor(ease * 10);
      this.projectsCount = Math.floor(ease * 500);
      this.qualityRate = Math.round(ease * 99.98 * 10) / 10;
      this.toleranceDev = Math.round(ease * 0.001 * 1000) / 1000;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.yearsCount = 10;
        this.projectsCount = 500;
        this.qualityRate = 99.98;
        this.toleranceDev = 0.001;
      }
    };

    requestAnimationFrame(step);
  }
}
