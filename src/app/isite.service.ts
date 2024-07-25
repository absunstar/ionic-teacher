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
  lecturesList: [any] | undefined;
  baseURL: string = 'http://shared.localhost';
  constructor(public http: HttpClient) {}

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
            image: resUserSession.session.user.image.url,
            type: resUserSession.session.user.type,
            notificationsCount: resUserSession.session.user.notificationsCount,
            notificationsList: resUserSession.session.user.notificationsList,
            booksList: resUserSession.session.user.booksList,
            lecturesList: resUserSession.session.user.lecturesList,
            packagesList: resUserSession.session.user.packagesList,
            schoolYear: resUserSession.session.user.schoolYear,
            educationalLevel: resUserSession.session.user.educationalLevel,
          };
          this.userSession.image = this.baseURL + this.userSession.image;
          /*           this.updateVisit();
           */
        }
      }
    });
  }

  async getSetting() {
    this.api('/api/get-site-setting').subscribe((res: any) => {
      if (res.done) {
        this.setting = res.doc;
        // this.db.setting.teacher = res.doc.teacher || {};
        // this.db.setting.email = res.doc.email || '';
        // this.db.setting.host = 'shared.localhost';
        // this.db.setting.whatsapp = res.doc.whatsapp || '';
        // this.db.setting.supportEmail = res.doc.supportEmail || '';
        // this.db.setting.phone = res.doc.phone || '';
        // this.db.setting.facebookAccount = res.doc.facebookAccount || '';
        // this.db.setting.instagramAccouunt = res.doc.instagramAccouunt || '';
        // this.db.setting.youTubeAccouunt = res.doc.youTubeAccouunt || '';
        // this.db.setting.twitterAccouunt = res.doc.twitterAccouunt || '';
        // this.db.setting.snapAccouunt = res.doc.snapAccouunt || '';
        // this.db.setting.linkedinAccouunt = res.doc.linkedinAccouunt || '';
        // this.db.setting.telegramAccouunt = res.doc.telegramAccouunt || '';
        // this.db.setting.skypeAccouunt = res.doc.skypeAccouunt || '';
        // this.db.setting.siteName = res.doc.siteName || '';
        // this.db.setting.titleSeparator = res.doc.titleSeparator || '';
        // this.db.setting.siteSlogan = res.doc.siteSlogan || '';
        // this.db.setting.description = res.doc.description || '';
        // this.db.setting.textPurchaseByBook = res.doc.textPurchaseByBook || '';
        // this.db.setting.textPurchaseByCode = res.doc.textPurchaseByCode || '';
        // this.db.setting.logo = res.doc.logo ? this.baseURL +  res.doc.logo.url : '';
        // this.db.setting.footerLogo = res.doc.footerLogo ? this.baseURL +  res.doc.footerLogo.url : '';
        // this.db.setting.banner = res.doc.banner ? this.baseURL +  res.doc.banner.url : '';
        // this.db.setting.codeCard = res.doc.codeCard || '';
        // this.db.setting.isShared = res.doc.isShared || false;
        // this.db.setting.citiesAndAreasShow = res.doc.citiesAndAreasShow || false;
        // this.db.setting.nationalitiesShow = res.doc.nationalitiesShow || false;
        // this.db.setting.nameBesidLogoShow = res.doc.nameBesidLogoShow || false;
        // this.db.setting.showParent = res.doc.showParent || false;
        // this.db.setting.showPackages = res.doc.showPackages || false;
        // this.db.setting.showLectures = res.doc.showLectures || false;
        // this.db.setting.showBooks = res.doc.showBooks || false;
        // this.db.setting.showBanner = res.doc.showBanner || false;
      }
    });
  }

  async getLectures() {
    this.api({
      url: '/api/lectures/all',
      body: {
        type: 'toStudent',
        select: {
          id: 1,
          _id: 1,
          name: 1,
          price: 1,
          description: 1,
          image: 1,
        },
        where: {},
      },
    }).subscribe((res: any) => {
      if (res.done) {
        this.lecturesList = res.list;
        console.log(this.lecturesList);
        
      }
    });
  }
}
