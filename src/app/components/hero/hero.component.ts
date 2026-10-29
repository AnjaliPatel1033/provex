import { Component, HostListener, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef<HTMLElement>;
  @ViewChild('heroCanvas') heroCanvas!: ElementRef<HTMLCanvasElement>;
  
  private readonly TOTAL_FRAMES = 120;
  private loadedImages: Map<number, HTMLImageElement> = new Map();
  private currentFrame = 1;
  private rafId: number | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    this.preloadFrames();
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    this.updateScroll();
    this.render();
  }

  ngOnDestroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }

  private getFrameUrl(index: number): string {
    const padded = String(index).padStart(4, '0');
    return `images/frames/frame_${padded}.jpg`;
  }

  private preloadFrames() {
    // 1. Preload first frame with highest priority for immediate rendering
    const firstImg = new Image();
    firstImg.src = this.getFrameUrl(1);
    const onFirstLoad = () => {
      this.loadedImages.set(1, firstImg);
      this.requestRender();
    };
    if (firstImg.complete && firstImg.naturalWidth > 0) {
      onFirstLoad();
    } else {
      firstImg.onload = onFirstLoad;
    }

    // 2. Preload remaining frames progressively
    for (let i = 2; i <= this.TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = this.getFrameUrl(i);
      const onLoad = () => {
        this.loadedImages.set(i, img);
        if (this.currentFrame === i || !this.loadedImages.has(this.currentFrame)) {
          this.requestRender();
        }
      };
      if (img.complete && img.naturalWidth > 0) {
        onLoad();
      } else {
        img.onload = onLoad;
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.isBrowser) return;
    this.updateScroll();
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.isBrowser) return;
    this.updateScroll();
    this.requestRender();
  }

  private updateScroll() {
    const element = this.heroSection.nativeElement;
    const rect = element.getBoundingClientRect();
    const scrollEnd = element.scrollHeight - window.innerHeight;
    
    let progress = -rect.top / Math.max(1, scrollEnd);
    progress = Math.max(0, Math.min(1, progress));
    
    element.style.setProperty('--scroll', progress.toString());
    
    // Map progress (0 -> 1) to frame index (1 -> 120)
    const frameIndex = Math.min(
      this.TOTAL_FRAMES, 
      Math.max(1, Math.round(progress * (this.TOTAL_FRAMES - 1)) + 1)
    );

    if (this.currentFrame !== frameIndex) {
      this.currentFrame = frameIndex;
      this.requestRender();
    }

    // Dynamic cinematic text transitions
    const text1Opacity = Math.max(0, 1 - progress * 3.6);
    const text2Opacity = Math.max(0, 1 - Math.abs(progress - 0.48) * 5.0);
    const text3Opacity = Math.max(0, Math.min(1, (progress - 0.72) / 0.22));
    const scale2 = Math.max(0.9, 1 + (0.5 - Math.abs(progress - 0.48)) * 0.4);

    element.style.setProperty('--text-1', text1Opacity.toFixed(3));
    element.style.setProperty('--text-2', text2Opacity.toFixed(3));
    element.style.setProperty('--text-3', text3Opacity.toFixed(3));
    element.style.setProperty('--scale-2', scale2.toFixed(3));
    element.style.setProperty('--cta-pointer', progress > 0.82 ? 'auto' : 'none');
  }

  private requestRender() {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.render();
    });
  }

  private findBestFrame(target: number): HTMLImageElement | null {
    if (this.loadedImages.has(target)) {
      return this.loadedImages.get(target)!;
    }
    // Search outward for the nearest loaded frame so canvas never flickers
    for (let offset = 1; offset < this.TOTAL_FRAMES; offset++) {
      const prev = target - offset;
      if (prev >= 1 && this.loadedImages.has(prev)) {
        return this.loadedImages.get(prev)!;
      }
      const next = target + offset;
      if (next <= this.TOTAL_FRAMES && this.loadedImages.has(next)) {
        return this.loadedImages.get(next)!;
      }
    }
    return null;
  }

  private render() {
    if (!this.heroCanvas) return;
    const canvas = this.heroCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = this.findBestFrame(this.currentFrame);
    if (!img) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    const requiredW = Math.floor(width * dpr);
    const requiredH = Math.floor(height * dpr);

    if (canvas.width !== requiredW || canvas.height !== requiredH) {
      canvas.width = requiredW;
      canvas.height = requiredH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Compute cover dimensions
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }
}
