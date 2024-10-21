import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
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
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
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
export class SubscriptionsPage implements OnInit {
  search: String | undefined;
  subscriptionList: [any] | undefined;
  type: string | undefined;
  where: any;
  constructor(public isite: IsiteService, private route: ActivatedRoute) {
    addIcons({ ...icons });
  }

  ngOnInit() {
    this.search = '';
    this.type = '';

    this.getSubscriptions();
  }

  async getSubscriptions() {
    this.route.queryParams.forEach((p) => {
      this.where = { active: true };
      if (p) {
        if (p['type'] == 'mySubscriptions') {
          this.where['mySubscriptions'] = true;
        }
      }

      this.subscriptionList = undefined;
      this.isite
        .api({
          url: '/api/subscriptions/all',
          body: {
            type: 'toStudent',
            select: {
              id: 1,
              _id: 1,
              name: 1,
              price: 1,
              description: 1,
              image: 1,
            },
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
            this.subscriptionList = res.list;
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
