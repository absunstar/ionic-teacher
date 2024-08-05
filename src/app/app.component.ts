import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { LoginPage } from './login/login.page';
import { ActivatedRoute } from '@angular/router';
import { menuController } from '@ionic/core';
import { PrivacyScreen } from '@capacitor-community/privacy-screen';

import {
  NavController,
  MenuController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import {
  IonText,
  IonRow,
  IonHeader,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonImg,
  IonTitle,
  IonToolbar,
  IonTabs,
  IonTabBar,
  IonTabButton,
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
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

import { IsiteService } from './isite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonRow,
    IonHeader,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonImg,
    IonTitle,
    IonToolbar,
    IonTabs,
    IonTabBar,
    IonTabButton,
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
export class AppComponent {
  constructor(
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    public isite: IsiteService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ ...icons });
    this.enablePrivacyScreen();
    this.isite.getSetting();
    PrivacyScreen.addListener('screenRecordingStarted', () => {
      this.doLogout();
    });
    PrivacyScreen.addListener('screenshotTaken', () => {
      this.doLogout();
    });
  }
  async enablePrivacyScreen() {
    await PrivacyScreen.enable();
  }
  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      initialBreakpoint: 0.5,
    });
    await modal.present();
  }
  async doLogout() {
    this.isite
      .api({
        url: '/api/user/logout',
      })
      .subscribe((resUser: any) => {
        if (resUser.accessToken) {
          this.isite.accessToken = '';
        }
        if (resUser.done) {
          this.isite.userSession = null;
          this.isite.getUserSession(() => {
            this.router.navigateByUrl('/', { replaceUrl: true });
          });
        } else {
        }
      });
  }
  async logout() {
    const alert = await this.alertController.create({
      header: 'تأكيد تسجيل الخروج',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: this.doLogout,
        },
      ],
    });

    await alert.present();
  }

  async hideMenu() {
    this.menuCtrl.enable(false);
  }
}
