import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import {
  NavController,
  MenuController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class IsiteService {
  studentList: any;
  teacherList: any;
  accessToken: string | null = '';
  setting: any;
  userSession: any;
  session: any;
  baseURL: string = 'http://professional.localhost';
  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.start();
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

  async start() {
    const loader = await this.loadingCtrl.create({
      message: ' انتظر قليلا - جاري التحميل',
    });

    await loader.present();
    if (!this.accessToken) {
      this.accessToken =
        (await (await Preferences.get({ key: 'accessToken' })).value) || null;
    }

    this.getUserSession(() => {
      if (this.userSession && this.userSession.type == 'parent') {
        this.getParentsList();
      }
      loader.dismiss();
    });
  }

  async getUserSession(callback: () => void) {
    this.api({
      url: '/x-api/session',
      body: {},
    }).subscribe((resSession: any) => {
      this.session = resSession.session;
      if (resSession.session.accessToken) {
        this.accessToken = resSession.session.accessToken;
        Preferences.set({ key: 'accessToken', value: this.accessToken || '' });
      }

      if (resSession.done) {
        if (resSession.session.user) {
          // this.updateVisit();

          this.userSession = {
            id: resSession.session.user.id,
            _id: resSession.session.user._id,
            email: resSession.session.user.email,
            mobile: resSession.session.user.mobile,
            firstName: resSession.session.user.firstName,
            lastName: resSession.session.user.lastName,
            imageUrl: resSession.session.user.image
              ? this.baseURL + resSession.session.user.image.url
              : '',
            type: resSession.session.user.type,
            notificationsCount: resSession.session.user.notificationsCount,
            notificationsList: resSession.session.user.notificationsList,
            booksList: resSession.session.user.booksList,
            lecturesList: resSession.session.user.lecturesList,
            packagesList: resSession.session.user.packagesList,
            schoolYear: resSession.session.user.schoolYear,
            educationalLevel: resSession.session.user.educationalLevel,
            address: resSession.session.user.address,
          };
        }
      }
      if (callback) {
        callback();
      }
    });
  }
  async selectTeacher(id: any) {
    this.api({
      url: '/api/selectTeacher',
      body: id,
    }).subscribe((res: any) => {
      if (res.done) {
        this.getUserSession(() => {          
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
        this.getUserSession(() => {          
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

  async getSetting() {
    this.api('/api/get-site-setting').subscribe((res: any) => {
      if (res.done) {
        this.setting = res.doc;
        this.setting.logoUrl = this.setting.logo
          ? this.baseURL + this.setting.logo.url
          : '';
        this.setting.footerLogoUrl = this.setting.footerLogo
          ? this.baseURL + this.setting.footerLogo.url
          : '';
        this.setting.bannerUrl = this.setting.banner
          ? this.baseURL + this.setting.banner.url
          : '';
      }
      
      if (this.setting.isShared) {
        this.getTeachersList();
      }
    });
  }
}
