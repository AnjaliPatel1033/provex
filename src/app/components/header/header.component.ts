import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkHeroScroll();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.checkHeroScroll();
  }

  private checkHeroScroll() {
    const heroEl = document.querySelector('.hero-scroll-container') as HTMLElement;
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      const scrollEnd = heroEl.scrollHeight - window.innerHeight;
      
      if (scrollEnd > 0) {
        const progress = -rect.top / scrollEnd;
        // Glass-door styling activates as hero reaches completion (Phase 3 at 0.70+) and beyond
        this.isScrolled = progress >= 0.70;
      } else {
        this.isScrolled = rect.bottom <= window.innerHeight;
      }
    } else {
      this.isScrolled = window.scrollY > 300;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
