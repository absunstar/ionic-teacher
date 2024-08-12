import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicSlides } from '@ionic/angular';

import {
  IonTextarea,
  IonCardTitle,
  IonInput,
  IonModal,
  IonThumbnail,
  IonCardContent,
  IonCard,
  IonText,
  IonImg,
  IonRow,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { IsiteService } from '../isite.service';
import { Swiper } from 'swiper/types';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// 2nd step:

// 3rd step :


// and
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-book-view',
  templateUrl: './book-view.page.html',
  styleUrls: ['./book-view.page.scss'],
  standalone: true,
  imports: [
    IonTextarea,
    FormsModule,
    IonInput,
    IonCardTitle,
    IonModal,
    IonButton,
    IonThumbnail,
    IonCardContent,
    IonCard,
    IonText,
    IonImg,
    IonRow,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
  ],
})
export class BookViewPage implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiperModules = [IonicSlides];
  book: any;
  address: string | undefined;
  error: string | undefined;
  buyModal: any;
  swiper?: Swiper;
  constructor(public isite: IsiteService, private route: ActivatedRoute) {

    this.book = {
      lecturesList: [],
    };
    this.buyModal = false;
    this.route.queryParams.forEach((p) => {
      this.getBook(p['id']);
    });
  }

  swiperReady() {
    console.log("ddddddddddddddddddddddddddddddddddd");
    
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  logActiveIndex() {
    console.log(this.swiperRef?.nativeElement.swiper.activeIndex);
  }
  ngOnInit() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
    this.swiper?.init();
    console.log(this.swiper,"ddddddddddddddddddddddddddddddddddd");
   
  }
  async getBook(_id: string) {
    this.book = {};
    this.isite
      .api({
        url: '/api/books/view',
        body: {
          _id: _id,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.doc.imageUrl = res.doc.image
            ? this.isite.baseURL + res.doc.image.url
            : '';

          this.book = res.doc;
        }
      });
  }

  setOpen(type: any, id: string) {
    if (id == 'buyModal') {
      this.buyModal = type;
      this.address = this.isite.userSession.address;
    }
    // this[id] = type;
  }

  async buyBook() {
    this.error = '';
    if (!this.address) {
      this.error = 'يجب إدخال عنوان التوصيل';
      return;
    }
    this.isite
      .api({
        url: '/api/books/buyCode',
        body: {
          address: this.address,
          bookId: this.book._id,
          bookPrice: this.book.price,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.doc.imageUrl = res.doc.image
            ? this.isite.baseURL + res.doc.image.url
            : '';

          this.book = res.doc;
          this.buyModal = false;
        } else {
          this.error = res.error;
        }
      });
  }
}
