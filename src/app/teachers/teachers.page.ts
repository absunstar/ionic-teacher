import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
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
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
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
export class TeachersPage implements OnInit {
  search: String | undefined;
  teacherList: [any] | undefined;
  type: string | undefined;
  constructor(public isite: IsiteService, private route: ActivatedRoute) {
    addIcons({ ...icons });
  }

  ngOnInit() {
    this.search = '';
    this.type = '';

    this.getTeachers();
  }
  async getTeachers() {
    this.teacherList = undefined;
    this.isite
      .api({
        url: '/api/manageUsers/all',
        body: {
          select: {
            id: 1,
            _id: 1,
            firstName: 1,
            title: 1,
            bio: 1,
            image: 1,
          },
          search: this.search,
          where: { type: 'teacher' },
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
          this.teacherList = res.list;
        }
      });
  }
}
