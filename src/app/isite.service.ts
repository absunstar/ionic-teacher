import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class IsiteService {
  accessToken: string = '';
  setting: any;
  userSession: any;
  
  baseURL: string = 'http://professional.localhost';
  constructor(public http: HttpClient) {
    this.setting = {
      teacher: {},
      textOurPlacesTimes : '',
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

  async getUserSession(callback: () => void) {
    this.api({
      url: '/x-api/session',
      body: {},
    }).subscribe((resUserSession: any) => {
      if (callback) {
        callback();
      }
      if (resUserSession.session.accessToken) {
        this.accessToken = resUserSession.session.accessToken;
        Preferences.set({ key: 'accessToken', value: this.accessToken });
      }

      if (resUserSession.done) {
        if (resUserSession.session.user) {
          // this.updateVisit();

          this.userSession = {
            id: resUserSession.session.user.id,
            _id: resUserSession.session.user._id,
            email: resUserSession.session.user.email,
            mobile: resUserSession.session.user.mobile,
            firstName: resUserSession.session.user.firstName,
            lastName: resUserSession.session.user.lastName,
            imageUrl: resUserSession.session.user.image
              ? this.baseURL + resUserSession.session.user.image.url
              : '',
            type: resUserSession.session.user.type,
            notificationsCount: resUserSession.session.user.notificationsCount,
            notificationsList: resUserSession.session.user.notificationsList,
            booksList: resUserSession.session.user.booksList,
            lecturesList: resUserSession.session.user.lecturesList,
            packagesList: resUserSession.session.user.packagesList,
            schoolYear: resUserSession.session.user.schoolYear,
            educationalLevel: resUserSession.session.user.educationalLevel,
            address: resUserSession.session.user.address,
          };
          
        }
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
    });
  }


 
}
