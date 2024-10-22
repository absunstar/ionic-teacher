import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import {
  IonModal,
  IonSelect,
  IonSelectOption,
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
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonSelect,
    IonSelectOption,
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
export class PackagesPage implements OnInit {
  search: String | undefined;
  packageList: [any] | undefined;
  type: string | undefined;
  educationalLevelsList: [any] | undefined;
  schoolYearsList: [any] | undefined;
  subjectsList: [any] | undefined;
  where: any;
  searchModal: any;
  constructor(public isite: IsiteService, private route: ActivatedRoute) {
    this.getEducationalLevelsList();
    this.getSubjectsList();
    addIcons({ ...icons });
  }

  ngOnInit() {
    this.search = '';
    this.type = '';
    this.searchModal = false;
    this.where = {};
    this.getPackages();
  }

  async getPackages() {
    this.where['active'] = true;
    this.route.queryParams.forEach((p) => {
      if (p) {
        if (p['type'] == 'myPackages') {
          this.where['myPackages'] = true;
        }
      }

      if (
        this.educationalLevelsList &&
        this.educationalLevelsList.length > 0 &&
        this.where.$educationalLevel
      ) {
        this.where.educationalLevel = this.educationalLevelsList.find(
          (a: { id: number }) => a.id == Number(this.where.$educationalLevel)
        );
        delete this.where.$educationalLevel;
      }
      if (
        this.schoolYearsList &&
        this.schoolYearsList.length > 0 &&
        this.where.$schoolYear
      ) {
        this.where.schoolYear = this.schoolYearsList.find(
          (a: { id: number }) => a.id == Number(this.where.$schoolYear)
        );
        delete this.where.$educationalLevel;
      }
      if (
        this.subjectsList &&
        this.subjectsList.length > 0 &&
        this.where.$subject
      ) {
        this.where.subject = this.subjectsList.find(
          (a: { id: number }) => a.id == Number(this.where.$subject)
        );
        delete this.where.$subject;
      }
      this.packageList = undefined;
      this.isite
        .api({
          url: '/api/packages/all',
          body: {
            type: this.type,
            select: {
              id: 1,
              _id: 1,
              name: 1,
              price: 1,
              totalLecturesPrice: 1,
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
            this.packageList = res.list;
          }
        });
    });
  }
  setOpen(type: any, id: string) {
    if (id == 'searchModal') {
      this.searchModal = type;
    }

    // this[id] = type;
  }
  getEducationalLevelsList() {
    this.isite
      .api({
        url: '/api/educationalLevels/all',
        body: {
          where: {
            active: true,
          },
          select: {
            id: 1,
            name: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.educationalLevelsList = res.list;
        }
      });
  }
  getSchoolYearsList(educationalLevel: any) {
    this.isite
      .api({
        url: '/api/schoolYears/all',
        body: {
          where: {
            active: true,
            'educationalLevel.id': Number(educationalLevel),
          },
          select: {
            id: 1,
            name: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.schoolYearsList = res.list;
        }
      });
  }

  getSubjectsList() {
    this.isite
      .api({
        url: '/api/subjects/all',
        body: {
          where: {
            active: true,
          },
          select: {
            id: 1,
            name: 1,
          },
        },
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.subjectsList = res.list;
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
