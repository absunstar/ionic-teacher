import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import {
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
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
  standalone: true,
  imports: [
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

export class PackagesPage implements OnInit {
  search : String | undefined ;
  packagesList: [any] | undefined;
   constructor(public isite: IsiteService) { }

  ngOnInit() {
    this.search = '';
    this.getPackages();
  }
  async getPackages() {
    this.packagesList = undefined;
    this.isite.api({
      url: '/api/packages/all',
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
        where: {},
      },
    }).subscribe((res: any) => {
      if (res.done) {
        res.list.forEach(
          (element: { imageURL: string; image: { url: string } }) => {
            element.imageURL = this.isite.baseURL + element.image.url;
          }
        );
        this.packagesList = res.list;
      }
    });
  }
}
