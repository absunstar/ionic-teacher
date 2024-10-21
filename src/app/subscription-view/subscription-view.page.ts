import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-subscription-view',
  templateUrl: './subscription-view.page.html',
  styleUrls: ['./subscription-view.page.scss'],
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
export class SubscriptionViewPage implements OnInit {
  subscription: any;
  purchase: any;
  purchaseTypeList: any;
  error: string | undefined;
  buyModal: any;
  constructor(
    public isite: IsiteService,
    private route: ActivatedRoute,
    public http: HttpClient
  ) {}

  ngOnInit() {
    this.subscription = {
      lecturesList: [],
    };
    this.buyModal = false;
    this.route.queryParams.forEach((p) => {
      this.getSubscription(p['id']);
    });
  }
  async selectImage(type: string) {
    Camera.checkPermissions()
      .then(async (permissions) => {
        console.log('selectImage ..............', permissions);

        if (
          permissions.photos === 'denied' ||
          permissions.camera === 'denied'
        ) {
          let p = await Camera.requestPermissions();
          if (p.photos === 'denied' || p.camera === 'denied') {
            return false;
          } else {
            return this.selectImage(type);
          }
        }
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Prompt, // Camera, Photos or Prompt!
        });
        if (image) {
          this.startUpload(image, type);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async startUpload(image: any, type: string) {
    this.purchase.$error = '';
    const base64Response = await fetch(image.dataUrl);
    const blob = await base64Response.blob();
    const formData = new FormData();
    formData.append('fileToUpload', blob, 'image1.png');
    this.uploadData(formData, type);
  }
  async uploadData(formData: FormData, type: string) {
    this.purchase.$error = '';

    this.http
      .post(`${this.isite.baseURL}/x-api/upload/image`, formData)
      .subscribe((res: any) => {
        if (type == 'image') {
          this.purchase.$imageTransfer = res.image.url;
          this.purchase.$_imageTransfer = this.isite.baseURL + res.image.url;
        }
        /* this.user.image_url = res.image.url;
        this.user.$image_url = this.isite.baseURL + res.image.url; */
      });
  }
  async getSubscription(_id: string) {
    this.subscription = {};
    this.isite
      .api({
        url: '/api/subscriptions/viewToStudent',
        body: {
          _id: _id,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.doc.imageUrl = res.doc.image
            ? this.isite.baseURL + res.doc.image.url
            : '';
          this.subscription = res.doc;
          this.getPurchaseTypeTeacher(this.subscription.teacherId);
        }
      });
  }
  async getPurchaseTypeTeacher(teacherId: any) {
    this.error = '';
    if (this.isite.userSession && this.isite.userSession.id) {
      this.isite
        .api({
          url: '/api/manageUsers/purchaseTypeTeacher',
          body: teacherId,
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.purchaseTypeList = res.list;
            this.purchase = {};
            this.purchase.purchaseType = res.list.find(
              (p: { default: boolean }) => p?.default
            );
            this.purchase.$purchaseType = this.purchase?.purchaseType?.name;
          }
        });
    }
  }
  setOpen(type: any, id: string) {
    if (id == 'buyModal') {
      this.buyModal = type;
    }
    // this[id] = type;
  }

  async changePurchaseType(type: any) {
    this.purchase.purchaseType = this.purchaseTypeList.find(
      (a: { name: string }) => a.name == type
    );
  }

  async buySubscription() {
    this.error = '';
    if (!this.purchase.$purchaseType) {
      this.error = 'يجب إختيار نوع الشراء';
      return;
    }
    if (!this.purchase.code && this.purchase.$purchaseType== 'code') {
      this.error = 'يجب إدخال كود الشراء';
      return;
    }
    if (!this.purchase.numberTransferFrom && this.purchase.$purchaseType != 'code') {
      this.error = 'يجب إدخال الرقم المحول منه';
      return;
    }
    this.purchase.image = { url: this.purchase.$imageTransfer };

    this.isite
      .api({
        url: '/api/subscriptions/buyCode',
        body: {
          purchase: this.purchase,
          subscriptionId: this.subscription.id,
          subscriptionPrice: this.subscription.price,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.route.queryParams.forEach((p) => {
            this.getSubscription(p['id']);
          });
          this.buyModal = false;
        } else {
          this.error = res.error;
        }
      });
  }
  handleRefresh(event: { target: { complete: () => void } }) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }
}
