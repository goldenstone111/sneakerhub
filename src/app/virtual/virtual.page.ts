import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from '../api/user.service';
import { ActivatedRoute, Route } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-virtual',
  templateUrl: './virtual.page.html',
  styleUrls: ['./virtual.page.scss'],
})
export class VirtualPage implements OnInit {
  productId;
  picture:any;
  modelsrc:any;
  safeurl:any=this.sanitizer.bypassSecurityTrustResourceUrl('');
  subscription:any;
  constructor(public platform:Platform, public sanitizer: DomSanitizer,public route:ActivatedRoute, public modalCtrl:ModalController,private status:StatusBar, public cameraPreview:CameraPreview,public router :Router,public authservice: UserService) { 
    
    this.productId = this.route.snapshot.params.productId;
    
    console.log("Product ID in Virtual Page",this.productId);

    this.getModel();
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'rear',
      tapPhoto: true,
      previewDrag: true,
      toBack: true,
      alpha: 1
    }
 
    // start camera
    this.cameraPreview.startCamera(cameraPreviewOpts).then(
    (res) => {
      
      this.authservice.presentToast('Loading shoes');
      console.log(res)
    },
    (err) => {
     
      this.authservice.presentToast(err);
      console.log(err)
    });

  }
  ngOnInit() {
   
  }  

  closemodal(){
    this.cameraPreview.stopCamera().then(
      (res) => {
        console.log("camera stopped ... :", res);
        
      })
    let userId = localStorage.getItem("obj");
    userId = JSON.parse(userId);
      if (userId === null || userId === undefined) {
        this.router.navigate(["/demo"]);
      } else {
        this.router.navigate(["/home"]);
      }
          
  }
  ionViewWillEnter(){
    this.status.hide();
    }
    ionViewWillLeave(){
      this.status.show();
      this.subscription.unsubscribe();
    }

    ionViewDidEnter(){
      this.subscription = this.platform.backButton.subscribe(()=>{
        this.closemodal();
      });
  }
  

    getModel(){
      console.log("GetModel method Called");
      this.authservice.getModel(this.productId).subscribe((data:any)=>{

        console.log("Model Response",data.success);
        this.modelsrc =data.success;
        console.log(this.modelsrc);
        
        this.getSrc();

      })
    }
    
    getSrc(){
      this.safeurl =this.sanitizer.bypassSecurityTrustResourceUrl(this.modelsrc);
    }
 
}
