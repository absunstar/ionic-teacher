import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonRefresher,
  IonRefresherContent,
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
  selector: 'app-lectures',
  templateUrl: './lectures.page.html',
  styleUrls: ['./lectures.page.scss'],
  standalone: true,
  imports: [
    IonRefresher,
    IonRefresherContent,
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
export class LecturesPage implements OnInit {
  search: String | undefined;
  lecturesList: [any] | undefined;
  type: string | undefined;
  constructor(public isite: IsiteService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.search = '';

    this.type = '';
    this.route.queryParams.forEach((p) => {
      this.type = 'toStudent';
      if (p && p['id']) {
        this.type = 'myStudent';
      }
      this.getLectures();
    });
  }
  async getLectures() {
    this.lecturesList = undefined;
    this.isite
      .api({
        url: '/api/lectures/allToStudent',
        body: {
          type: this.type,
          search: this.search,
          where: {},
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
          this.lecturesList = res.list;
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
