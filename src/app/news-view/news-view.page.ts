import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import {
  IonRefresher,
  IonRefresherContent,
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
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { IsiteService } from '../isite.service';

@Component({
  selector: 'app-news-view',
  templateUrl: './news-view.page.html',
  styleUrls: ['./news-view.page.scss'],
  standalone: true,
  imports: [
    IonRefresher,
    IonRefresherContent,
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
    IonSelect,
    IonSelectOption,
  ],
})
export class NewsViewPage implements OnInit {
  news: any;
  purchase: any;
  purchaseTypeList: any;
  error: string | undefined;
  buyModal: any;
  constructor(
    public isite: IsiteService,
    private route: ActivatedRoute,
    public http: HttpClient,
    private sanitized: DomSanitizer
  ) {}

  ngOnInit() {
    this.news = {
      lecturesList: [],
    };
    this.buyModal = false;
    this.route.queryParams.forEach((p) => {
      this.getNews(p['id']);
    });
  }

  async getNews(_id: string) {
    this.news = {};
    this.isite
      .api({
        url: '/api/news/view',
        body: {
          _id: _id,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.doc.imageUrl = res.doc.image
            ? this.isite.baseURL + res.doc.image.url
            : '';

          res.doc.imageList = res.doc.imageList || [];
         
          res.doc.imageList.forEach(
            (_element: { image: any; imageUrl: string }) => {
              _element.imageUrl = _element.image
                ? this.isite.baseURL + _element.image.url
                : '';
            }
          );
          this.news = res.doc;
          
          this.news.content = this.sanitized.bypassSecurityTrustHtml(
            this.news.content
          );
        }
      });
  }

  handleRefresh(event: { target: { complete: () => void } }) {
    setTimeout(() => {
      this.ngOnInit();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }
}
