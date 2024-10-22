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
import { catchError, Observable, observeOn } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class IsiteService {
  studentList: any;
  teacherList: any;
  accessToken: string = '';
  setting: any;
  userSession: any = {};
  words: any = {};
  session: any = {};
  packageList: [any] | undefined;
  lectureList: [any] | undefined;
  bookList: [any] | undefined;
  newsList: [any] | undefined;
  liveBroadcastList: [any] | undefined;
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
      isFaculty: false,
      newsLimit: 0,
      showNews: false,
      packagesLimit: 0,
      lecturesLimit: 0,
      miniBooksLimit: 0,
      booksLimit: 0,
      citiesAndAreasShow: false,
      nationalitiesShow: false,
      nameBesidLogoShow: false,
      showParent: false,
      showPackages: false,
      showLectures: false,
      showBooks: false,
      showMiniBooks: false,
      showSubscriptions: false,
      showBanner: false,
    };
  }

  async set(key: string, value: string) {
    if (value && (typeof value == 'object' || typeof value == 'string')) {
      value = JSON.stringify(value);
    }
    await Preferences.set({ key: key, value: value });
  }
  async get(key: string) {
    let value = (await Preferences.get({ key: key })).value;
    if (value && typeof value == 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    }
    return value;
  }

  // return subscribe
  api(options: any) {
    if (typeof options == 'string') {
      options = {
        url: options,
        type: 'post',
      };
    }

    return new Observable((observeOn) => {
      this.get('accessToken').then((accessToken) => {
        this.accessToken = accessToken;

        options.headers = options.headers || {};
        if (this.accessToken) {
          options.headers['Access-Token'] = this.accessToken;
        }
        options.url = this.baseURL + options.url;

        if (options.type == 'get') {
          this.http
            .get(options.url, {
              headers: options.headers,
            })
            .subscribe((res) => {
              observeOn.next(res);
            });
        } else {
          this.http
            .post(options.url, options.body, {
              headers: options.headers,
            })
            .subscribe((res: any) => {
              if (res.session && res.session.accessToken) {
                this.accessToken = res.session.accessToken;
                this.set('accessToken', this.accessToken);
              }
              if (res.accessToken) {
                this.accessToken = res.accessToken;
                this.set('accessToken', this.accessToken);
              }
              observeOn.next(res);
            });
        }
      });
    });
  }

  getSession() {
    return new Observable((observeOn) => {
      this.api({
        url: '/x-api/session',
        body: {},
      }).subscribe((res: any) => {
        this.session = res.session || {};

        if (res.done && this.session.user && this.session.user.image) {
          this.session.user.imageUrl =
            this.baseURL + this.session.user.image.url;
        }

        this.userSession = this.session.user || {};
        observeOn.next({
          session: this.session,
          userSession: this.userSession,
        });
      });
    });
  }

  getSetting() {
    return new Observable((observeOn) => {
      if (this.setting && this.setting.loaded) {
        observeOn.next({
          setting: this.setting,
          session: this.session,
          userSession: this.userSession,
        });
      } else {
        this.api('/api/get-site-setting').subscribe((res: any) => {
          this.setting = res.doc || {};
          this.setting.loaded = true;
          if (this.setting.logo) {
            this.setting.logoUrl = this.baseURL + this.setting.logo.url;
          } else {
            this.setting.logoUrl = this.baseURL + '/images/logo.png';
          }

          if (this.setting.footerLogo) {
            this.setting.footerLogoUrl =
              this.baseURL + this.setting.footerLogo.url;
          } else {
            this.setting.footerLogoUrl = this.baseURL + '/images/logo.png';
          }

          if (this.setting.banner) {
            this.setting.bannerUrl = this.baseURL + this.setting.banner.url;
          } else {
            this.setting.bannerUrl = this.baseURL + '/images/logo.png';
          }

          observeOn.next({
            setting: this.setting,
            session: this.session,
            userSession: this.userSession,
          });
          if (this.setting.isFaculty) {
            this.words.educationalLevel = 'الفرقة';
            this.words.schoolYear = 'الشُعبة';
            this.words.center = 'الكلية';
          } else {
            this.words.educationalLevel = 'المرحلة الدراسية';
            this.words.schoolYear = 'العام الدراسي';
            this.words.center = 'السنتر';
          }
        });
      }
    });
  }

  getPackages() {
    return new Observable((observeOn) => {
      this.packageList = undefined;
      this.api({
        url: '/api/packages/all',
        body: {
          limit: this.setting.packagesLimit || 6,
          type: 'toStudent',
          select: {
            id: 1,
            _id: 1,
            name: 1,
            price: 1,
            totalLecturesPrice: 1,
            image: 1,
          },
          where: { active: true },
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
          observeOn.next(this.packageList);
        }
      });
    });
  }

  getLectures() {
    return new Observable((observeOn) => {
      this.api({
        url: '/api/lectures/allToStudent',
        body: {
          limit: this.setting.lecturesLimit || 6,
          type: 'toStudent',
          select: {
            id: 1,
            _id: 1,
            name: 1,
            price: 1,
            image: 1,
          },
          where: { active: true },
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
  getMiniBooks() {
    return new Observable((observeOn) => {
      this.api({
        url: '/api/miniBooks/allToStudent',
        body: {
          limit: this.setting.miniBooksLimit || 6,
          type: 'toStudent',
          select: {
            id: 1,
            _id: 1,
            name: 1,
            price: 1,
            image: 1,
          },
          where: { active: true },
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
  getBooks() {
    return new Observable((observeOn) => {
      this.bookList = undefined;
      this.api({
        url: '/api/books/all',
        body: {
          limit: this.setting.booksLimit || 6,
          type: 'toStudent',
          select: {
            id: 1,
            _id: 1,
            name: 1,
            price: 1,
            image: 1,
          },
          where: { active: true },
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
          observeOn.next(this.bookList);
        }
      });
    });
  }

  getSubscriptions() {
    return new Observable((observeOn) => {
      this.bookList = undefined;
      this.api({
        url: '/api/subscriptions/all',
        body: {
          limit: this.setting.subscriptionsLimit || 6,
          type: 'toStudent',
          select: {
            id: 1,
            _id: 1,
            name: 1,
            price: 1,
            image: 1,
          },
          where: { active: true },
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
          observeOn.next(this.bookList);
        }
      });
    });
  }

  getNews() {
    return new Observable((observeOn) => {
      this.newsList = undefined;
      this.api({
        url: '/api/news/all',
        body: {
          limit: this.setting.newsLimit || 6,
          type: 'toStudent',
          select: {
            id: 1,
            _id: 1,
            name: 1,
            image: 1,
            newsType: 1,
          },
          where: { active: true },
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
          this.newsList = res.list;
          observeOn.next(this.newsList);
        }
      });
    });
  }
  getLiveBroadcast() {
    return new Observable((observeOn) => {
      this.liveBroadcastList = undefined;
      this.api({
        url: '/api/lectures/allToStudent',
        body: {
          where: { active: true, liveBroadcast: true },
        },
      }).subscribe((res: any) => {
        if (res.done) {
          this.liveBroadcastList = res.list;
          observeOn.next(this.liveBroadcastList);
        }
      });
    });
  }
  getTeachersList() {
    return new Observable((observeOn) => {
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
          observeOn.next(this.teacherList);
        }
      });
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
