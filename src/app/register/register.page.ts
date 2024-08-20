import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { Platform } from '@ionic/angular';

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
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPage implements OnInit {
  user: any;
  educationalLevelsList: any;
  schoolYearsList: any;
  gendersList: any;
  countriesList: any;
  govesList: any;
  citiesList: any;
  areasList: any;
  centersList: any;
  constructor(
    public isite: IsiteService,
    private router: Router,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    private platform: Platform
  ) {
    this.getEducationalLevelsList();
    this.getGendersList();
    this.getCountriesList();
    this.getCentersList();
    addIcons({ ...icons });
    this.user = {
      type: '',
      placeType: '',
      $error: '',
      $busy: false,
      $showUserType: false,
      $showPlaceType: false,
      $showContent: false,
      firstName: '',
      lastName: '',
      userName: '',
      mobile: '',
      parentMobile: '',
      email: '',
      password: '',
      rePassword: '',
      $imageUrl: '',
      nationalId: '',
      $nationalIdImageUrl: '',
      $_nationalIdImageUrl: '',
      $birthOfDate: '',
      birthOfDate: Date,
      address: '',
      $gender: '',
      gender: {},
      $center: '',
      center: {},
      $educationalLevel: '',
      educationalLevel: {},
      $schoolYear: '',
      schoolYear: {},
      $country: '',
      country: {},
      $gov: '',
      gov: {},
      $city: '',
      city: {},
      $area: '',
      area: {},

      latitude: '',
      longitude: '',
    };
    this.user.$birthOfDate = new Date().toISOString();
    if (this.isite.setting.showParent) {
      this.user.$showUserType = true;
    } else {
      this.user.type = 'student';
      this.user.$showPlaceType = true;
    }
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
          source: CameraSource.Photos, // Camera, Photos or Prompt!
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
    this.user.$error = '';
    const base64Response = await fetch(image.dataUrl);
    const blob = await base64Response.blob();
    const formData = new FormData();
    formData.append('fileToUpload', blob, 'image1.jpg');
    this.uploadData(formData, type);
  }
  
  async uploadData(formData: FormData, type: string) {
    this.user.$error = '';

    this.isite
      .api({ url: '/x-api/upload/image', body: formData })
      .subscribe((res: any) => {
        if (type == 'image') {
          this.user.image = res.image;
          this.user.$imageUrl = this.isite.baseURL + this.user.image.url;
        } else if (type == 'nationalIdImage') {
          this.user.$nationalIdImageUrl = res.image.url;
          this.user.$_nationalIdImageUrl = this.isite.baseURL + res.image.url;
        }
        console.log(this.user);
      });
  }

  getGendersList() {
    this.isite
      .api({
        url: '/api/genders',
        body: {},
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.gendersList = res.list;
        }
      });
  }

  getEducationalLevelsList() {
    this.isite
      .api({
        url: '/api/educationalLevels/all',
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
          this.educationalLevelsList = res.list;
        }
      });
  }
  getSchoolYearsList(educationalLevel: any) {
    this.isite
      .api({
        url: '/api/schoolYears/all',
        body: {
          where: {
            active: true,
            'educationalLevel.id': Number(educationalLevel),
          },
          select: {
            id: 1,
            name: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.schoolYearsList = res.list;
        }
      });
  }

  getCentersList() {
    this.isite
      .api({
        url: '/api/centers/all',
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
          this.centersList = res.list;
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

  addUser(user: {
    parentMobile: any;
    type: string;
    $birthOfDate: any;
    $busy: boolean;
    $error: string;
    firstName: any;
    email: any;
    mobile: any;
    password: any;
    placeType: string;
    $center: any;
    nationalId: any;
    latitude: any;
    longitude: any;
    nationalIdImage: { url: any };
    $nationalIdImageUrl: any;
    image: { url: any };
    $imageUrl: any;
    rePassword: any;
    $country: any;
    $gov: any;
    $city: any;
    $area: any;
    $gender: any;
    $educationalLevel: any;
    $schoolYear: any;
  }) {
    if (user.$busy) {
      return;
    }
    user.$error = '';

    if (user) {
      if (!user.firstName) {
        user.$error = 'يجب إدخال الإسم الرباعي';
        return;
      }
      if (!user.$birthOfDate) {
        user.$error = 'يجب إدخال تاريخ الميلاد';
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
      } else if (!user.rePassword) {
        user.$error = 'يجب إعادة إدخال كلمة السر';
        return;
      } else if (!user.$country) {
        user.$error = 'يجب إختيار الدولة';
        return;
      } else if (!user.$gov) {
        user.$error = 'يجب إختيار المحافظة';
        return;
      }
      if (!user.$gender) {
        user.$error = 'يجب تحديد نوع الجنس';
        return;
      }
      if (user.placeType == 'offline') {
        if (!user.$center) {
          user.$error = '##word.Must Enter Center##';
          return;
        }
      } else if (user.placeType == 'online') {
        if (!user.$nationalIdImageUrl) {
          user.$error = 'يجب إدخال صورة البطاقة';
          return;
        } else if (!user.nationalId) {
          user.$error = 'يجب إدخال رقم البطاقة';
          return;
        } else if (!user.latitude || !user.longitude) {
          user.$error = 'يجب إدخال بيانات الموقع';
          return;
        }
      }
      if (user.type == 'student') {
        if (!user.$educationalLevel) {
          user.$error = 'يجب إختيار المرحلة الدراسية';
          return;
        } else if (!user.$schoolYear) {
          user.$error = 'يجب إختيار العام الدراسي';
          return;
        } else if (!user.parentMobile) {
          user.$error = 'يجب إختيار هاتف ولي الأمر';
          return;
        }
      }
      user.nationalIdImage = { url: user.$nationalIdImageUrl };
      if (user.password === user.rePassword) {
        this.user.birthOfDate = new Date(this.user.$birthOfDate);
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

        this.user.gender = this.gendersList.find(
          (a: { id: number }) => a.id == Number(user.$gender)
        );

        if (this.centersList && this.centersList.length > 0) {
          this.user.center = this.centersList.find(
            (a: { id: number }) => a.id == Number(user.$center)
          );
        }

        if (
          this.educationalLevelsList &&
          this.educationalLevelsList.length > 0
        ) {
          this.user.educationalLevel = this.educationalLevelsList.find(
            (a: { id: number }) => a.id == Number(user.$educationalLevel)
          );
        }

        if (this.schoolYearsList && this.schoolYearsList.length > 0) {
          this.user.schoolYear = this.schoolYearsList.find(
            (a: { id: number }) => a.id == Number(user.$schoolYear)
          );
        }
        user.$busy = true;

        this.isite
          .api({
            url: '/api/register',
            body: { user },
          })
          .subscribe((res: any) => {
            user.$busy = false;
            if (res.error) {
              user.$error = res.error;
            } else if (res.user) {
              this.isite.getSession().subscribe((data: any) => {
                console.log(data);
                
                this.router.navigateByUrl('/welcome', { replaceUrl: true });
              });
            }
          });
      } else {
        user.$error = 'كلمة السر غير متطابقة';
      }
    } else {
      // user.$error = 'يجب ملء البيانات';
    }
  }

  async printCurrentPosition() {
    this.user.$error = '';

    const coordinates = await Geolocation.getCurrentPosition();

    if (coordinates && coordinates.coords) {
      this.user.latitude = coordinates.coords.latitude;
      this.user.longitude = coordinates.coords.longitude;
    } else {
      this.user.$err = 'يوجد مشكلة في تفعيل الموقع';
    }
  }
}
