import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Preferences } from '@capacitor/preferences';

import * as icons from 'ionicons/icons';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  IonCol,
  IonInputPasswordToggle,
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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonInputPasswordToggle,
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
export class LoginPage implements OnInit {
  user;
  error: string | undefined;
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    public isite: IsiteService
  ) {
    addIcons({ ...icons });
    this.user = {
      email: '',
      password: '',
      $error: '',
    };
  }

  ngOnInit() {}
  loginUser(user: { $error: string; email: any; password: any }) {
    user.$error = '';
    if (!user.email || !user.password) {
      user.$error = 'يجب كتابة إسم المستخدم و كلمة السر';
    }
    this.isite
      .api({
        url: '/api/user/login',
        body: {
          email: user.email,
          password: user.password,
        },
      })
      .subscribe((resUser: any) => {
        if (resUser.accessToken) {
          this.isite.accessToken = resUser.accessToken;
          this.isite.set('accessToken', this.isite.accessToken);
        }
        if (resUser.done) {
          this.isite.getSession().subscribe((session) => {
            if (
              this.isite.userSession &&
              this.isite.userSession.type == 'parent'
            ) {
              this.isite.getParentsList();
            }
            this.close();
           // this.router.navigateByUrl('/', { replaceUrl: true });
          });
        } else {
          this.error = resUser.error;
        }
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
