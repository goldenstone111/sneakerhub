import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-social',
  templateUrl: './social.page.html',
  styleUrls: ['./social.page.scss'],
})
export class SocialPage implements OnInit {
  CategoryData: any;
  category1: string;
  constructor(public loadingController: LoadingController,public router :Router) {
   }

  ngOnInit() {
  }
  segmentChanged(event) {
    this.presentLoading();
  }
  search(){
    console.log("icon method called");
    this.router.navigate(['/searchbar']);
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }
  ionViewWillEnter() {
    this.category1 = 'instagram';
  }
}
