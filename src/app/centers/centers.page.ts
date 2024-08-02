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
  selector: 'app-centers',
  templateUrl: './centers.page.html',
  styleUrls: ['./centers.page.scss'],
  standalone: true,
  imports: [
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
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
export class CentersPage implements OnInit {
  centersList: [any] = [{}];
  constructor(public isite: IsiteService, private route: ActivatedRoute) {
    addIcons({ ...icons });
  }

  ngOnInit() {
    this.getCenters();
  }
  async getCenters() {
    this.centersList = [{}];
    this.isite
      .api({
        url: '/api/centers/all',
        body: {
          view: true,
          select: {
            id: 1,
            host: 1,
            name: 1,
            image: 1,
            daysList: 1,
            mobile: 1,
            educationalLevel: 1,
            schoolYear: 1,
            country: 1,
            gov: 1,
            city: 1,
            area: 1,
            address: 1,
            latitude: 1,
            longitude: 1,
          },
        },
      })
      .subscribe(async (res: any) => {
        if (res.done) {
          this.centersList = res.list;
          setTimeout(() => {
            res.list.forEach(
              (
                _item: {
                  id: Number;
                  locationSrc: string;
                  latitude: any;
                  longitude: any;
                },
                i: number
              ) => {
                this.centersList[
                  i
                ].locationSrc = `https://maps.google.com/maps?q=${_item.latitude},${_item.longitude}&hl=es;z=14&output=embed`;
                let iframe = document.querySelector(
                  '#location_' + _item.id.toString()
                );
                if (iframe) {
                  iframe.setAttribute(
                    'src',
                    `https://maps.google.com/maps?q=${_item.latitude},${_item.longitude}&hl=es;z=14&output=embed`
                  );
                }
              }
            );
          }, 1000);
        }
      });
  }
}
