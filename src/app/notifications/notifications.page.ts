import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import {
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonCard,
  IonCol,
  IonRow,
  IonButton,
  IonInput,
  IonImg,
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
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonCard,
    IonCol,
    IonButton,
    IonRow,
    IonInput,
    IonImg,
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
    FormsModule,
  ],
})
export class NotificationsPage implements OnInit {
  search: String | undefined;
  user!: any;
  type: string | undefined;
  constructor(public isite: IsiteService, private route: ActivatedRoute) {
    addIcons({ ...icons });
    this.user = {
      notificationsList: [],
    };
  }

  ngOnInit() {
    this.search = '';
    this.type = '';
    this.route.queryParams.forEach((p) => {
      this.type = 'toStudent';
      if (p && p['id']) {
        this.type = 'myStudent';
      }

      this.getNotifications();
      this.updateStudentNotifications('showAll', null);
    });
  }
  async getNotifications() {
    if (this.isite.userSession && this.isite.userSession.id) {
      this.isite
        .api({
          url: '/api/user/view',
          body: {
            type: 'notifications',
            id: this.isite.userSession.id,
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.doc.notificationsList = res.doc.notificationsList || [];
            res.doc.notificationsList.forEach(
              (element: { imageUrl: string; image: { url: string } }) => {
                element.imageUrl = element.image
                  ? this.isite.baseURL + element.image.url
                  : '';
              }
            );
            this.user = res.doc;
          }
        });
    }
  }

  async updateStudentNotifications(type: string, id: any) {
    if (this.isite.userSession && this.isite.userSession.id) {
      this.isite
        .api({
          url: '/api/manageUsers/updateStudentNotifications',
          body: {
            type: type,
            id: id,
          },
        })
        .subscribe((res: any) => {
          if (res.done) {
            res.result.notificationsList = res.result.notificationsList || [];
            res.result.notificationsList.forEach(
              (element: { imageUrl: string; image: { url: string } }) => {
                element.imageUrl = element.image
                  ? this.isite.baseURL + element.image.url
                  : '';
              }
            );
            this.user = res.result;
          }
        });
    }
  }
}
