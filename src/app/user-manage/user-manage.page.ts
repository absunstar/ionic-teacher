import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import {
  NavController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import {
  ActivatedRoute,
  RouterLink,
  Router,
  RouterLinkActive,
} from '@angular/router';
import {
  IonCol,
  IonInputPasswordToggle,
  IonModal,
  IonDatetimeButton,
  IonDatetime,
  IonText,
  IonSelect,
  IonSelectOption,
  IonRow,
  IonButton,
  IonInput,
  IonImg,
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
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.page.html',
  styleUrls: ['./user-manage.page.scss'],
  standalone: true,
  imports: [
    IonInputPasswordToggle,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonCol,
    IonSelect,
    IonSelectOption,
    IonText,
    IonButton,
    IonRow,
    IonInput,
    IonImg,
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
    FormsModule,
  ],
})
export class UserManagePage implements OnInit {
  error: string | undefined;
  user: any;
  countriesList: any;
  govesList: any;
  citiesList: any;
  areasList: any;
  parentSearch : string | undefined
  constructor(
    public isite: IsiteService,
    private router: Router,
    public loadingCtrl: LoadingController,
    public http: HttpClient
  ) {
    this.getUser();
    addIcons({ ...icons });
    this.user = {};
    this.parentSearch = '';
  }

  ngOnInit() {}

  selectUserType(type: string) {
    this.user.$error = '';

    this.user.type = type;
    if (type == 'student') {
      this.user.$showUserType = false;
      this.user.$showPlaceType = true;
    }
    if (type == 'parent') {
      this.user.$showUserType = false;
      this.user.$showContent = true;
    }
  }

  selectPlaceType(type: string) {
    this.user.$error = '';
    this.user.placeType = type;
    this.user.$showPlaceType = false;
    this.user.$showContent = true;
  }

  async selectImage(type: string) {
    this.user.$error = '';
    await Camera.checkPermissions().then((permissions) => {
      if (permissions.photos !== 'granted') {
        Camera.requestPermissions();
      }
    });

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // Camera, Photos or Prompt!
    });
    this.startUpload(image, type);
  }

  async startUpload(image: any, type: string) {
    this.user.$error = '';
    const base64Response = await fetch(image.dataUrl);
    const blob = await base64Response.blob();
    const formData = new FormData();
    formData.append('fileToUpload', blob, 'image1.png');
    this.uploadData(formData, type);
  }
  async uploadData(formData: FormData, type: string) {
    this.user.$error = '';
    const loading = await this.loadingCtrl.create({
      message: 'جاري تحميل الصورة',
    });
    await loading.present();
    this.http
      .post(`${this.isite.baseURL}/x-api/upload/image`, formData)
      .subscribe((res: any) => {
        if (type == 'image') {
          this.user.$imageUrl = res.image.url;
          this.user.$_imageUrl = this.isite.baseURL + res.image.url;
        }
        /* this.user.image_url = res.image.url;
        this.user.$image_url = this.isite.baseURL + res.image.url; */
        loading.dismiss();
      });
  }

  getParentsList() {    
    this.isite
      .api({
        url: '/api/manageUsers/all',
        body: {
          where: {
            email: this.parentSearch,
            type: "parent",
            active: true,
          },
          select: {
            id: 1,
            firstName: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {          
          this.user.parent = res.list[0];
        } else {
          this.error = 'لا يوجد'
        }
      });
  }

  getCountriesList() {
    this.isite
      .api({
        url: '/api/countries/all',
        body: {
          where: {
            active: true,
          },
          select: {
            id: 1,
            name: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.countriesList = res.list;
        }
      });
  }
  getGovesList(country: any) {
    this.isite
      .api({
        url: '/api/goves/all',
        body: {
          where: {
            active: true,
            'country.id': Number(country),
          },
          select: {
            id: 1,
            name: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.govesList = res.list;
        }
      });
  }

  getCitiesList(gov: any) {
    this.isite
      .api({
        url: '/api/cities/all',
        body: {
          where: {
            active: true,
            'gov.id': Number(gov),
          },
          select: {
            id: 1,
            name: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.citiesList = res.list;
        }
      });
  }

  getAreasList(city: any) {
    this.isite
      .api({
        url: '/api/areas/all',
        body: {
          where: {
            active: true,
            'city.id': Number(city),
          },
          select: {
            id: 1,
            name: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.areasList = res.list;
        }
      });
  }

  updateUser(user: any) {
    if (user.$busy) {
      return;
    }
    user.$error = '';

    if (user) {
      if (!user.firstName) {
        user.$error = 'يجب إدخال الإسم الرباعي';
        return;
      }
      if (!user.$imageUrl) {
        user.$error = 'يجب إدخال الصورة الشخصية';
        return;
      } else if (!user.email) {
        user.$error = 'يجب إدخال البريد';
        return;
      } else if (!user.mobile) {
        user.$error = 'يجب إدخال الجوال';
        return;
      } else if (!user.password) {
        user.$error = 'يجب إدخال كلمة السر';
        return;
      } else if (!user.$country) {
        user.$error = 'يجب إختيار الدولة';
        return;
      } else if (!user.$gov) {
        user.$error = 'يجب إختيار المحافظة';
        return;
      }
      user.image = { url: user.$imageUrl };
      this.user.country = this.countriesList.find(
        (a: { id: number }) => a.id == Number(user.$country)
      );

      this.user.gov = this.govesList.find(
        (a: { id: number }) => a.id == Number(user.$gov)
      );

      if (this.citiesList && this.citiesList.length > 0) {
        this.user.city = this.citiesList.find(
          (a: { id: number }) => a.id == Number(user.$city)
        );
      }
      if (this.areasList && this.areasList.length > 0) {
        this.user.area = this.areasList.find(
          (a: { id: number }) => a.id == Number(user.$area)
        );
      }

      user.$busy = true;

      this.isite
        .api({
          url: '/api/user/update',
          body: user,
        })
        .subscribe((res: any) => {
          user.$busy = false;
          if (res.error) {
            user.$error = res.error;
            this.parentSearch = '';
          } else if (res.user) {
            this.isite.getUserSession(() => {
              this.router.navigateByUrl('/user-manage', { replaceUrl: true });
            });
          }
        });
    } else {
      // user.$error = 'يجب ملء البيانات';
    }
  }

  getUser() {
    if (this.isite.userSession && this.isite.userSession.id) {
      this.isite
        .api({
          url: '/api/user/view',
          body: { id: this.isite.userSession.id },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.user = res.doc;

            this.user.$imageUrl = this.user.image ? this.user.image.url : '';

            this.user.$_imageUrl = this.user.image
              ? this.isite.baseURL + this.user.image.url
              : '';

            if (this.user.country && this.user.country.id) {
              this.user.$country = this.user.country.id.toString();
              this.getCountriesList();
              this.getGovesList(this.user.country.id);
            }
            if (this.user.gov && this.user.gov.id) {
              this.user.$gov = this.user.gov.id.toString();
              this.getCitiesList(this.user.gov.id);
            }
            if (this.user.city && this.user.city.id) {
              this.user.$city = this.user.city.id.toString();
              this.getAreasList(this.user.city.id);
            }
            if (this.user.area && this.user.area.id) {
              this.user.$area = this.user.area.id.toString();
            }
          }
        });
    }
  }
}
