import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SliderComponent implements AfterViewInit {
  @Input() items: any[] = [];

  // ===== Options =====
  @Input() slidesPerView = 4;
  @Input() spaceBetween = 20;
  @Input() loop = true;
  @Input() autoplay = false;
  @Input() pagination = true;

  // ===== UI =====
  @Input() shape: 'circle' | 'square' | 'rounded' = 'rounded';
  @Input() loading = false;

  @ViewChild('swiperRef') swiperRef!: ElementRef;

  ngAfterViewInit() {
    const swiperEl = this.swiperRef.nativeElement;

    Object.assign(swiperEl, {
      slidesPerView: this.slidesPerView,
      spaceBetween: this.spaceBetween,
      loop: this.loop,

      pagination: this.pagination ? { clickable: true } : false,

      autoplay: this.autoplay
        ? {
            delay: 2000,
            disableOnInteraction: false,
          }
        : false,

      breakpoints: {
        0: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: this.slidesPerView },
      },
    });

    swiperEl.initialize();
  }

  // ===== Navigation =====
  next() {
    this.swiperRef.nativeElement.swiper.slideNext();
  }

  prev() {
    this.swiperRef.nativeElement.swiper.slidePrev();
  }

  // ===== Card Shape =====
  getCardClass() {
    switch (this.shape) {
      case 'circle':
        return 'circle-card';
      case 'square':
        return 'square-card';
      default:
        return 'rounded-card';
    }
  }
}
