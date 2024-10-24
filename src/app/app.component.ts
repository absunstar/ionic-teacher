import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { LoginPage } from './login/login.page';
import { ActivatedRoute } from '@angular/router';
import { PrivacyScreen } from '@capacitor-community/privacy-screen';
import { MenuController } from '@ionic/angular';
import {
  NavController,
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
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

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
  setting: any = {};
  session: any = {};
  userSession: any = {};
  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    public isite: IsiteService,
    private router: Router,
    private menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private alertController: AlertController,
    private _ngzone: NgZone
  ) {
    addIcons({ ...icons });
    this.enablePrivacyScreen();
    PrivacyScreen.addListener('screenRecordingStarted', () => {
      this.doLogout();
    });
    PrivacyScreen.addListener('screenshotTaken', () => {
      this.doLogout();
    });
    this.start();
    App.addListener('backButton', ({ canGoBack }) => {
      console.log(canGoBack);
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  }

  async start() {
    this.isite.getSession().subscribe((data: any) => {
      this.isite.getSetting().subscribe((data: any) => {
        this.setting = data.setting;
        this.session = data.session;
        this.userSession = data.userSession;
      });
    });
  }

  async enablePrivacyScreen() {
    if (this.platform.is('android')) {
      await PrivacyScreen.enable();
    }
  }
  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      initialBreakpoint: 0.5,
    });

    modal.onDidDismiss().then(() => {
      this.isite.getSession().subscribe((data: any) => {
        this.session = data.session;
        this.userSession = data.userSession;

        this.router.navigateByUrl('/loading', { replaceUrl: true });
      });
    });

    await modal.present();
  }

  async exitTeacher() {
    this.isite
      .api({
        url: '/api/exitTeacher',
        body: {},
      })
      .subscribe((res: any) => {
        if (res.done) {
          this.isite.getSession().subscribe((data: any) => {
            this.session = data.session;
            this.userSession = data.userSession;
            this.router.navigateByUrl('/loading');
          });
        }
      });
  }
  async doLogout() {
    this.isite
      .api({
        url: '/api/user/logout',
      })
      .subscribe((resUser: any) => {
        if (resUser.done) {
          this.session = null;
          this.isite.getSession().subscribe((data: any) => {
            this.session = data.session;
            this.userSession = data.userSession;

            this.router.navigateByUrl('/loading');
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
          handler: () => {
            this.doLogout();
          },
        },
      ],
    });

    await alert.present();
  }

  hideMenu() {
    this.menuCtrl.toggle('main-content');
    this.menuCtrl.toggle('main-menu');
    this.menuCtrl.close('main-menu');
    this.menuCtrl.close('main-content');
    this.menuCtrl.close();
    this.menuCtrl.enable(false);
  }
}
