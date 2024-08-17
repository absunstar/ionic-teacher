import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    private alertController: AlertController
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
  }

  async start() {
    const loader = await this.loadingCtrl.create({
      message: ' انتظر قليلا - جاري التحميل',
    });

    await loader.present();

    this.isite.start().subscribe((accessToken) => {
      this.isite.getSession().subscribe((session: any) => {
        this.session = session;
        this.userSession = this.session.user || {};
        this.isite.getSetting().subscribe((setting) => {
          this.setting = setting;
          loader.dismiss();
        });
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
      this.isite.getSession().subscribe((session) => {
        this.session = session;
        this.userSession = this.session.user || {};
        this.setting = this.isite.setting;
        this.router.navigateByUrl('/', { replaceUrl: true });
      });
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
          this.isite.set('accessToken', this.isite.accessToken);
        }
        if (resUser.done) {
          this.session = null;
          this.isite.getSession().subscribe((session) => {
            this.session = session;
            this.userSession = this.session.user || {};
            this.setting = this.isite.setting;
            this.router.navigateByUrl('/');
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
