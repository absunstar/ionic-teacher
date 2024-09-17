import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

import {
  IonRefresher,
  IonRefresherContent,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonCardContent,
  IonCard,
  IonCheckbox,
  IonInput,
  IonModal,
  IonThumbnail,
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
  selector: 'app-lecture-view',
  templateUrl: './lecture-view.page.html',
  styleUrls: ['./lecture-view.page.scss'],
  standalone: true,
  imports: [
    IonRefresher,
    IonRefresherContent,
    FormsModule,
    IonInput,
    IonCheckbox,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonCard,
    IonModal,
    IonButton,
    IonThumbnail,
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
export class LectureViewPage implements OnInit {
  lecture: any;
  quiz: any;
  videoId: any;
  videoCode: any;
  code: string | undefined;
  error: string | undefined;
  quizModal: Boolean | undefined;
  buyModal: Boolean;
  videoModal: Boolean | undefined;
  minute!: number;
  secound!: number;
  constructor(public isite: IsiteService, private route: ActivatedRoute) {
    this.lecture = {
      lecturesList: [],
    };
    this.buyModal = false;
    this.quizModal = false;
    this.videoModal = false;
    this.minute = 0;
    this.secound = 0;
    this.route.queryParams.forEach((p) => {
      this.getLecture(p['id']);
    });
    // this.onWindowLoaded().then(() => {
    //   this.addScript('https://social-browser.com/x-js/video.min.js').then(
    //     () => {
    //       this.addScript('https://social-browser.com/x-js/youtube.min.js');
    //     }
    //   );
    // });
  }

  ngOnInit() {
    this.error = '';
    // this.route.queryParams.forEach((p) => {
    //   if (p['id']) {
    //     this.isite.getLecture(p['id']);
    //   }
    // });
  }
  async getLecture(_id: string) {
    this.error = '';
    this.lecture = {};
    this.isite
      .api({
        url: '/api/lectures/viewToStudent',
        body: {
          _id: _id,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.doc.imageUrl = res.doc.image
            ? this.isite.baseURL + res.doc.image.url
            : '';
          res.doc.filesList = res.doc.filesList || [];
          res.doc.filesList.forEach(
            (_file: { file: any; $url: string; url: any }) => {
              if (_file.file) {
                _file.$url = this.isite.baseURL + _file.file.url;
              }
            }
          );

          this.lecture = res.doc;
          this.quizView(this.lecture.id);
        }
      });
  }

  async quizView(id: number) {
    this.error = '';
    if (this.isite.userSession && this.isite.userSession.id) {
      this.quiz = {};
      this.isite
        .api({
          url: '/api/quizzes/viewByUserLecture',
          body: {
            'lecture.id': id,
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.quiz = res.doc;
          }
        });
    }
  }
  async startQuiz() {
    this.error = '';
    if (this.isite.userSession && this.isite.userSession.id) {
      this.quiz = {};
      this.isite
        .api({
          url: '/api/quizzes/startQuiz',
          body: {
            where: {
              'lecture.id': this.lecture.id,
            },
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.doc.questionsList = res.doc.questionsList || [];
            res.doc.questionsList.forEach(
              (_q: {
                questionType: { name: string };
                imageUrl: string;
                image: { url: string };
              }) => {
                if (_q.questionType.name == 'photo') {
                  _q.imageUrl = _q.image
                    ? this.isite.baseURL + _q.image.url
                    : '';
                }
              }
            );
            this.quiz = res.doc;
            this.startQuizTime('start');
          } else {
            this.error = res.error;
          }
        });
    }
  }
  async finishQuiz(quiz: any) {
    this.error = '';
    if (this.isite.userSession && this.isite.userSession.id) {
      this.quiz = {};
      this.isite
        .api({
          url: '/api/quizzes/finishQuiz',
          body: quiz,
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.doc.questionsList = res.doc.questionsList || [];
            this.startQuizTime('finish');

            this.quiz = res.doc;
            this.quizModal = false;
          } else {
            this.error = res.error;
          }
        });
    }
  }

  startQuizTime(type: any) {
    this.minute = this.lecture.quizDuration - 1 || 0;
    this.secound = 59;
    if (type == 'start') {
      this.quizModal = true;
    }
    const timeQuizInterval = setInterval(() => {
      if (type == 'finish') {
        clearInterval(timeQuizInterval);
      }

      this.secound--;
      if (this.secound == 0) {
        if (this.secound <= 1 && this.minute < 1) {
          this.finishQuiz(this.quiz);
        }
        this.minute--;
        this.secound = 60;
      }
    }, 1000);
  }

  setOpen(type: any, id: string) {
    if (id == 'buyModal') {
      this.buyModal = type;
    } else if (id == 'quizModal') {
      this.quizModal = type;
    } else if (id == 'videoModal') {
      this.videoModal = type;
    }
  }

  checkCorrect(answersList: any, index: any) {
    answersList.forEach((_a: { userAnswer: boolean }, i: any) => {
      if (i != index) {
        _a.userAnswer = false;
      }
    });
  }

  async buyLecture() {
    this.error = '';
    if (!this.code) {
      this.error = 'يجب إدخال كود الشراء';
      return;
    }
    this.isite
      .api({
        url: '/api/lectures/buyCode',
        body: {
          code: this.code,
          lectureId: this.lecture.id,
          lecturePrice: this.lecture.price,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.route.queryParams.forEach((p) => {
            this.getLecture(p['id']);
          });
          this.buyModal = false;
        } else {
          this.error = res.error;
        }
      });
  }

  async openVideo(link: any) {
    this.error = '';
    this.videoId = '';
    this.videoCode = link.code;
    this.isite
      .api({
        url: '/api/lectures/changeViewMobile',
        body: {
          code: link.code,
          _id: this.lecture._id,
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.viewVideo();
        } else {
          this.error = res.error;
        }
      });
  }
  async viewVideo() {
    this.videoModal = true;
    setTimeout(() => {
      let iframe = document.querySelector('#video_' + this.videoCode);

      if (iframe) {
        iframe.setAttribute(
          'src',
          `${this.isite.baseURL}/view-video?code=${this.videoCode}&id=${this.lecture._id}`
        );
      }
    }, 1000);
  }
  addScript(src: string) {
    return new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.addEventListener('load', resolve);
      el.addEventListener('error', reject);
      document.body.append(el);
    });
  }

  onWindowLoaded() {
    return new Promise((resolve, reject) => {
      if (document.readyState !== 'loading') {
        resolve(true);
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          resolve(true);
        });
      }
    });
  }

  handleRefresh(event: { target: { complete: () => void } }) {
    setTimeout(() => {
      this.ngOnInit();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }
}
