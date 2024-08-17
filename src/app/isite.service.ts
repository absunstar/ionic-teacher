import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

import {
  NavController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { Observable, observeOn } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class IsiteService {
  studentList: any;
  teacherList: any;
  accessToken: string = '';
  setting: any;
  userSession: any = {};
  session: any = {};
  packageList: [any] | undefined;
  lectureList: [any] | undefined;
  bookList: [any] | undefined;
  baseURL: string = 'https://professional.teacher.egytag.com';
  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    private router: Router
  ) {
    console.log('Isite Init ...');
    this.setting = {
      teacher: {},
      textOurPlacesTimes: '',
      email: '',
      host: '',
      whatsapp: '',
      supportEmail: '',
      phone: '',
      facebookAccount: '',
      instagramAccouunt: '',
      youTubeAccouunt: '',
      twitterAccouunt: '',
      snapAccouunt: '',
      linkedinAccouunt: '',
      telegramAccouunt: '',
      skypeAccouunt: '',
      siteName: '',
      titleSeparator: '',
      siteSlogan: '',
      registerAlert: '',
      description: '',
      textPurchaseByBook: '',
      textPurchaseByCode: '',
      logo: '',
      footerLogo: '',
      banner: '',
      codeCard: '',
      isShared: false,
      packagesLimit: 0,
      lecturesLimit: 0,
      booksLimit: 0,
      citiesAndAreasShow: false,
      nationalitiesShow: false,
      nameBesidLogoShow: false,
      showParent: false,
      showPackages: false,
      showLectures: false,
      showBooks: false,
      showBanner: false,
    };
  }

  // return subscribe
  api(options: any) {
    if (typeof options == 'string') {
      options = {
        url: options,
        type: 'post',
      };
    }

    options.headers = options.headers || {};
    options.headers['Access-Token'] = this.accessToken || '';
    options.url = this.baseURL + options.url;
    if (options.type == 'get') {
      return this.http.get(options.url, {
        headers: options.headers,
      });
    } else {
      return this.http.post(options.url, options.body, {
        headers: options.headers,
      });
    }
  }

  start() {
    return new Observable((observeOn) => {
      this.get('accessToken').then((d) => {
        this.accessToken = d;
        observeOn.next(this.accessToken);
      });
    });
  }

  async set(key: string, value: string) {
    if (value) {
      value = JSON.stringify(value);
    }
    await Preferences.set({ key: key, value: value });
  }
  async get(key: string) {
    let value = (await Preferences.get({ key: key })).value;
    if (value) {
      return JSON.parse(value);
    }
    return value;
  }

  getSession() {
    return new Observable((observeOn) => {
      this.api({
        url: '/x-api/session',
        body: {},
      }).subscribe((res: any) => {
        this.session = res.session || {};
        if (this.session.accessToken) {
          this.accessToken = this.session.accessToken;
          this.set('accessToken', this.accessToken);
        }

        if (res.done && this.session.user && this.session.user.image) {
          this.session.user.imageUrl =
            this.baseURL + this.session.user.image.url;
        }
        this.userSession = this.session.user || {};
        observeOn.next(this.session);
      });
    });
  }

  getSetting() {
    return new Observable((observeOn) => {
      if (this.setting && this.setting.loaded) {
        observeOn.next(this.setting);
      } else {
        this.api('/api/get-site-setting').subscribe((res: any) => {
          this.setting = res.doc || {};
          this.setting.loaded = true;
          this.setting.logoUrl = this.setting.logo
            ? this.baseURL + this.setting.logo.url
            : this.baseURL + '/images/logo.png';
          this.setting.footerLogoUrl = this.setting.footerLogo
            ? this.baseURL + this.setting.footerLogo.url
            : this.baseURL + '/images/logo.png';
          this.setting.bannerUrl = this.setting.banner
            ? this.baseURL + this.setting.banner.url
            : this.baseURL + '/images/logo.png';
          observeOn.next(this.setting);
        });
      }
    });
  }

  async getPackages() {
    this.packageList = undefined;
    this.api({
      url: '/api/packages/all',
      body: {
        limit: this.setting.packagesLimit,
        type: 'toStudent',
        select: {
          id: 1,
          _id: 1,
          name: 1,
          price: 1,
          image: 1,
        },
        where: {},
      },
    }).subscribe((res: any) => {
      if (res.done) {
        res.list.forEach(
          (element: { imageUrl: string; image: { url: string } }) => {
            element.imageUrl = element.image
              ? this.baseURL + element.image.url
              : '';
          }
        );
        this.packageList = res.list;
      }
    });
  }

  getLectures() {
    return new Observable((observeOn) => {
      this.api({
        url: '/api/lectures/allToStudent',
        body: {
          limit: this.setting.lecturesLimit,
          type: 'toStudent',
          select: {
            id: 1,
            _id: 1,
            name: 1,
            price: 1,
            image: 1,
          },
          where: {},
        },
      }).subscribe((res: any) => {
        if (res.done) {
          res.list.forEach(
            (element: { imageUrl: string; image: { url: string } }) => {
              element.imageUrl = element.image
                ? this.baseURL + element.image.url
                : '';
            }
          );
          this.lectureList = res.list;
          observeOn.next(this.lectureList);
        }
      });
    });
  }

  async getBooks() {
    this.bookList = undefined;
    this.api({
      url: '/api/books/all',
      body: {
        limit: this.setting.booksLimit,
        type: 'toStudent',
        select: {
          id: 1,
          _id: 1,
          name: 1,
          price: 1,
          image: 1,
        },
        where: {},
      },
    }).subscribe((res: any) => {
      if (res.done) {
        res.list.forEach(
          (element: { imageUrl: string; image: { url: string } }) => {
            element.imageUrl = element.image
              ? this.baseURL + element.image.url
              : '';
          }
        );
        this.bookList = res.list;
      }
    });
  }

  async selectTeacher(id: any) {
    this.api({
      url: '/api/selectTeacher',
      body: id,
    }).subscribe((res: any) => {
      if (res.done) {
        this.getSession().subscribe((session: any) => {
          this.router.navigateByUrl('/welcome', {
            replaceUrl: true,
          });
        });
      }
    });
  }

  async exitTeacher() {
    this.api({
      url: '/api/exitTeacher',
      body: {},
    }).subscribe((res: any) => {
      if (res.done) {
        this.getSession().subscribe((session) => {
          this.router.navigateByUrl('/welcome', {
            replaceUrl: true,
          });
        });
      }
    });
  }

  async getTeachersList() {
    this.api({
      url: '/api/manageUsers/all',
      body: {
        where: {
          type: 'teacher',
        },
        limit: 9,
        select: {
          id: 1,
          firstName: 1,
          lastName: 1,
          image: 1,
          title: 1,
          bio: 1,
        },
      },
    }).subscribe((res: any) => {
      if (res.done) {
        res.list.forEach(
          (element: { imageUrl: string; image: { url: string } }) => {
            element.imageUrl = element.image
              ? this.baseURL + element.image.url
              : '';
          }
        );
        this.teacherList = res.list;
      }
    });
  }

  async getParentsList() {
    this.api({
      url: '/api/manageUsers/all',
      body: {
        where: {
          'parent.id': this.userSession.id,
        },
        select: {
          id: 1,
          firstName: 1,
        },
      },
    }).subscribe((res: any) => {
      if (res.done) {
        res.list.forEach(
          (element: { imageUrl: string; image: { url: string } }) => {
            element.imageUrl = element.image
              ? this.baseURL + element.image.url
              : '';
          }
        );
        this.studentList = res.list;
      }
    });
  }
}
