import { Component, OnInit, NgZone } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import {
  IonThumbnail,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonCardContent,
  IonCard,
  IonImg,
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
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [
    IonThumbnail,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonCardContent,
    IonCard,
    IonImg,
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

  constructor(public isite: IsiteService, private _ngzone: NgZone) {
    addIcons({ ...icons });
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
