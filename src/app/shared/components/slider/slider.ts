import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SliderComponent implements AfterViewInit, OnChanges {
  @Input() items: any[] = [];

  @Input() slidesPerView = 4;
  @Input() spaceBetween = 20;
  @Input() loop = true;
  @Input() autoplay = false;
  @Input() pagination = true;

  @ContentChild(TemplateRef)
  itemTemplate!: TemplateRef<any>;

  @ViewChild('swiperRef')
  swiperRef!: ElementRef;

  ngAfterViewInit() {
    const swiperEl = this.swiperRef.nativeElement;

    Object.assign(swiperEl, {
      slidesPerView: this.slidesPerView,
      spaceBetween: this.spaceBetween,
      loop: this.loop,

      pagination: this.pagination ? { clickable: true } : false,

      autoplay: this.autoplay
        ? {
            delay: 2500,
            disableOnInteraction: false,
          }
        : false,

      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      },
    });

    swiperEl.initialize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && this.swiperRef?.nativeElement?.swiper) {
      setTimeout(() => {
        this.swiperRef.nativeElement.swiper.update();
      });
    }
  }

  next() {
    this.swiperRef.nativeElement.swiper.slideNext();
  }

  prev() {
    this.swiperRef.nativeElement.swiper.slidePrev();
  }
}
