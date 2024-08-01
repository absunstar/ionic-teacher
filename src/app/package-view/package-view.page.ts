import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

import {
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

@Component({
  selector: 'app-package-view',
  templateUrl: './package-view.page.html',
  styleUrls: ['./package-view.page.scss'],
  standalone: true,
  imports: [
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
export class PackageViewPage implements OnInit {
  package: any;
  code: string | undefined;
  error: string | undefined;
  buyModal: any;
  quizModal: any;
  constructor(public isite: IsiteService, private route: ActivatedRoute) {
    this.package = {
      lecturesList: [],
    };
    this.buyModal = false;
    this.route.queryParams.forEach((p) => {
      this.getPackage(p['id']);
    });
  }

  ngOnInit() {
    // this.route.queryParams.forEach((p) => {
    //   if (p['id']) {
    //     this.isite.getPackage(p['id']);
    //   }
    // });
  }
  async getPackage(_id: string) {
    this.package = {};
    this.isite
      .api({
        url: '/api/packages/view',
        body: {
          _id: _id,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.doc.imageUrl = res.doc.image
            ? this.isite.baseURL + res.doc.image.url
            : '';

          res.doc.lecturesList = res.doc.lecturesList || [];

          res.doc.lecturesList.forEach(
            (_element: {
              lecture: any;
              imageUrl: string;
            }) => {
              _element.imageUrl =
                _element.lecture && _element.lecture.image
                  ? this.isite.baseURL + _element.lecture.image.url
                  : '';
            }
          );
          this.package = res.doc;
        }
      });
  }

  setOpen(type: any, id: string) {
    if (id == 'buyModal') {
      this.buyModal = type;
    }
    // this[id] = type;
  }

  async buyPackage() {
    this.error = '';
    if (!this.code) {
      this.error = 'يجب إدخال كود الشراء';
      return;
    }
    this.isite
      .api({
        url: '/api/packages/buyCode',
        body: {
          code: this.code,
          packageId: this.package.id,
          packagePrice: this.package.price,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.route.queryParams.forEach((p) => {
            this.getPackage(p['id']);
          });
          this.quizModal = false;
        } else {
          this.error = res.error;
        }
      });
  }
}
