import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { LoginPage } from '../login/login.page';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import {
  IonThumbnail,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonCardContent,
  IonCard,
  IonModal,
  IonRefresher,
  IonRefresherContent,
  IonImg,
  IonCol,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonRow,
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
  IonGrid,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { IsiteService } from '../isite.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [
  IonGrid,
  IonCol,
  IonRefresher,
    IonRefresherContent,
    IonThumbnail,
    IonCardTitle,
    IonModal,
    IonCardSubtitle,
    IonCardHeader,
    IonCardContent,
    IonCard,
    IonImg,
    IonRow,
    IonButton,
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
export class WelcomePage implements OnInit {
  studentList: [any] | undefined;
  setting: any = {};
  lectureList: [any] = [{}];
  packageList: [any] = [{}];
  miniBookList: [any] = [{}];
  teacherList: [any] = [{}];
  bookList: [any] = [{}];
  newsList: [any] = [{}];
  liveBroadcastList: [any] = [{}];
  session: any;
  liveId: any;
  userSession: any;
  liveModal: Boolean | undefined;

  constructor(
    public isite: IsiteService,
    private _ngzone: NgZone,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    this.liveModal = false;
    addIcons({ ...icons });
  }
  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      initialBreakpoint: 0.5,
    });

    modal.onDidDismiss().then(() => {
      this.isite.getSession().subscribe((data: any) => {
        this.session = data.session;
        this.userSession = data.userSession;

        this.router.navigateByUrl('/loading', { replaceUrl: true });
      });
    });

    await modal.present();
  }
  async selectTeacher(id: any) {
    this.isite.api({
      url: '/api/selectTeacher',
      body: id,
    }).subscribe((res: any) => {
      if (res.done) {
        this.isite.getSession().subscribe((data: any) => {
          this.session = data.session;
          this.userSession = data.userSession;
          
          this.router.navigateByUrl('/loading');
        });
      }
    });
  }

  async getLiveLectures(id: any) {
    this.isite.api({
      url: '/api/lectures/',
      body: id,
    }).subscribe((res: any) => {
      if (res.done) {
        this.isite.getSession().subscribe((data: any) => {
          this.session = data.session;
          this.userSession = data.userSession;
          
          this.router.navigateByUrl('/loading');
        });
      }
    });
  }
  handleRefresh(event: { target: { complete: () => void } }) {
    setTimeout(() => {
      this.start();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  start() {
    this.isite.getSetting().subscribe((data: any) => {
      this.setting = data.setting;
      this.session = data.session;
      this.userSession = data.userSession;

      if (
        this.setting.showLectures &&
        (!this.session.user || this.session.user.placeType == 'offline')
      ) {
        this.isite.getLectures().subscribe((lecturers: any) => {
          this.lectureList = lecturers;
        });
      } else {
        this.lectureList = [{}];
      }

      if (this.setting.showPackages) {
        this.isite.getPackages().subscribe((packages: any) => {
          this.packageList = packages;
        });
      }

      if (this.setting.showMiniBooks) {
        this.isite.getMiniBooks().subscribe((miniBooks: any) => {
          this.miniBookList = miniBooks;
        });
      }

      if (this.setting.showBooks) {
        this.isite.getBooks().subscribe((books: any) => {
          this.bookList = books;
        });
      }

      if (this.setting.showNews) {
        this.isite.getNews().subscribe((news: any) => {
          this.newsList = news;
        });
      }

      if (this.setting.isShared) {
        this.isite.getTeachersList().subscribe((teachers: any) => {
          this.teacherList = teachers;
        });
      }
      this.isite.getLiveBroadcast().subscribe((liveBroadcast: any) => {
        this.liveBroadcastList = liveBroadcast;
      });
    });
  }
  async openLive(id: any) {
    this.liveModal = true;
    this.liveId = id;

    setTimeout(() => {
      let iframe = document.querySelector('#video_' + id);

      if (iframe) {
        iframe.setAttribute(
          'src',
          `${this.isite.baseURL}/view-live?id=${id}`
        );
      }
    }, 1000);
  }
  ngOnInit() {
    this.start();
  }
  ionViewWillEnter() {}
}
