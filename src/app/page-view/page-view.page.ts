import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
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
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.page.html',
  styleUrls: ['./page-view.page.scss'],
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
export class PageViewPage implements OnInit {
  pageContent: any | undefined;
  constructor(
    public isite: IsiteService,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
  ) {
    addIcons({ ...icons });
    this.getPageImplement();
  }

  ngOnInit() {}

  getPageImplement() {
    this.route.queryParams.subscribe(async (params) => {
      console.log(params);

      if (params && params['type']) {
        this.isite
          .api({
            url: '/api/pages/view',
            body: {
              url: params['type'],
            },
          })
          .subscribe((res: any) => {
            if (res.done) {
              this.pageContent = res.doc;
              this.pageContent.content = this.sanitized.bypassSecurityTrustHtml(
                this.pageContent.content
              );
            }
          });
      }
    });
  }
}
