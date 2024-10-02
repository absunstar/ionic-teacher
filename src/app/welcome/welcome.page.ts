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
  IonRefresher,
  IonRefresherContent,
  IonImg,
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
  IonRouterLink,
} from '@ionic/angular/standalone';
import { IsiteService } from '../isite.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [
    IonRefresher,
    IonRefresherContent,
    IonThumbnail,
    IonCardTitle,
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
  teacherList: [any] = [{}];
  bookList: [any] = [{}];
  session: any;
  userSession: any;

  constructor(
    public isite: IsiteService,
    private _ngzone: NgZone,
    private modalCtrl: ModalController,
    private router: Router
  ) {
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

      if (this.setting.showBooks) {
        this.isite.getBooks().subscribe((books: any) => {
          this.bookList = books;
        });
      }

      if (this.setting.isShared) {
        this.isite.getTeachersList().subscribe((teachers: any) => {
          this.teacherList = teachers;
        });
      }
    });
  }

  ngOnInit() {
    this.start();
  }
  ionViewWillEnter() {}
}
