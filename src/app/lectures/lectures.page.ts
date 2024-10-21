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
  where: any;
  constructor(public isite: IsiteService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.search = '';

    this.type = '';

    this.getLectures();
  }
  async getLectures() {
    this.lecturesList = undefined;
    this.route.queryParams.forEach((p) => {
      this.where = { active: true };
      if (p) {
        if (p['subscription']) {
          this.where['subscriptionList.subscription.id'] = Number(p['subscription']);
        } else if (p['type'] == 'myLectures') {
          this.where['myLectures'] = true;
        }
      }
      this.isite
        .api({
          url: '/api/lectures/allToStudent',
          body: {
            type: 'toStudent',
            search: this.search,
            where: this.where,
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
