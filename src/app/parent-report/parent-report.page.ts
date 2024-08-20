import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import {
  IonRefresher,
  IonRefresherContent,
  IonGrid,
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
  selector: 'app-parent-report',
  templateUrl: './parent-report.page.html',
  styleUrls: ['./parent-report.page.scss'],
  standalone: true,
  imports: [
    IonRefresher,
    IonRefresherContent,
    IonGrid,
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
export class ParentReportPage implements OnInit {
  search: String | undefined;
  lecturesList: [any] | undefined;
  type: string | undefined;
  constructor(public isite: IsiteService, private route: ActivatedRoute) {
    addIcons({ ...icons });
  }

  ngOnInit() {
    this.search = '';
    this.type = '';
    this.route.queryParams.forEach((p) => {
      if (p && p['id']) {
        this.getAll(p['id']);
      }
    });
  }
  async getAll(id: any) {
    if (this.isite.userSession && this.isite.userSession.id) {
      this.lecturesList = undefined;
      this.isite
        .api({
          url: '/api/parentsReports/lecturesStudent',
          body: { studentId: id },
        })
        .subscribe((res: any) => {
          if (res.done) {
            this.lecturesList = res.list;
          }
        });
    }
  }

  handleRefresh(event: { target: { complete: () => void; }; }) {
    setTimeout(() => {
      this.ngOnInit();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }
}
