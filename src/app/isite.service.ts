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
  lecture: any;
  baseURL: string = 'https://me.teacher.egytag.com';
  constructor(public http: HttpClient) {
    this.setting = { siteName: '' };
    this.lecture = {};
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
        console.log(this.setting);
      }
    });
  }

  async getLectures() {
    this.lecturesList = undefined;
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
        res.list.forEach(
          (element: { imageURL: string; image: { url: string } }) => {
            element.imageURL = this.baseURL + element.image.url;
          }
        );
        this.lecturesList = res.list;
        console.log(this.lecturesList);
      }
    });
  }
  async getLecture(_id: string) {
    this.lecture = {};
    this.api({
      url: '/api/lectures/view',
      body: {
        _id: _id,
      },
    }).subscribe((res: any) => {
      if (res.done) {
        res.doc.imageURL = this.baseURL + res.doc.image.url;
        this.lecture = res.doc;
        console.log(this.lecture);
      }
    });
  }
}
