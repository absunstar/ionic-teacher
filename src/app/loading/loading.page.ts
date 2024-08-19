import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  NavController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { IsiteService } from '../isite.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class LoadingPage implements OnInit {
  constructor(
    public loadingCtrl: LoadingController,
    public isite: IsiteService,
    private router: Router
  ) {}

  async start() {
    const loader = await this.loadingCtrl.create({
      message: ' انتظر قليلا - جاري التحميل',
    });

    await loader.present();

    setTimeout(() => {
      loader.dismiss();
      this.router.navigate(['/welcome']);
    }, 1000 * 3);
  }

  ngOnInit() {
    this.start();
  }
  ionViewWillEnter() {
    this.start();
  }
}
