import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import {
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
  studentsList: [any] | undefined;
  constructor(public isite: IsiteService) {
    addIcons({ ...icons });
  }

  ngOnInit() {
    console.log(
      'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk'
    );
    console.log(this.isite.userSession);
    if (this.isite.userSession && this.isite.userSession.type == 'parent') {
      this.getParentsList();
    }
  }

  getParentsList() {
    this.isite
      .api({
        url: '/api/manageUsers/all',
        body: {
          where: {
            'parent.id': this.isite.userSession.id,
          },
          select: {
            id: 1,
            firstName: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          res.list.forEach(
            (element: { imageUrl: string; image: { url: string } }) => {
              element.imageUrl = element.image
                ? this.isite.baseURL + element.image.url
                : '';
            }
          );
          this.studentsList = res.list;
        }
      });
  }
}
