import { Component, OnInit } from '@angular/core';
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
  session: any;
  userSession: any;

  constructor(public isite: IsiteService) {
    addIcons({ ...icons });
    this.isite.getSetting().subscribe((setting) => {
      this.setting = setting;
      this.session = this.isite.session;
      this.userSession = this.isite.userSession;
      if (
        this.setting.showLectures &&
        (!this.session.user ||
          this.session.user.placeType == 'offline')
      ) {
        this.isite.getLectures().subscribe((lecturers: any) => {
          this.lectureList = lecturers;
        });
      }else{
        this.lectureList= [{}];
      }

      if (this.setting.showPackages) {
        this.isite.getPackages();
      }

      if (this.setting.showBooks) {
        this.isite.getBooks();
      }

      if (this.setting.isShared) {
        this.isite.getTeachersList();
      }
    });
  }

  ngOnInit() {}
}
