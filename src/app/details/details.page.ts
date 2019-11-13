import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Location } from "@angular/common";
import { ReviewPage } from "../review/review.page";
import { UserService } from "../api/user.service";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { VirtualPage } from '../virtual/virtual.page';
//import { setTimeout } from 'timers';
@Component({
  selector: "app-details",
  templateUrl: "./details.page.html",
  styleUrls: ["./details.page.scss"]
})
export class DetailsPage implements OnInit {
  colorvalue = true;
  psize =true;
  phistory = true;
  prelesedate =true;
  base;
  productId;
  productprice;
  productname;
  sku;
  relesedate;
  description;
  history;
  postImage;
  mobileno;
  slideOpts = {
    initialSlide: 1,
    autoplay: true,
    loop: true,
    speed: 2000
  };
  slideData = [];
  colors: any = [];
  Size: any = [];
  productstatus = '';
  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    private location: Location,
    public authService: UserService,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private callNumber: CallNumber
  ) {
    this.productId = this.route.snapshot.params.id;
    console.log(this.productId);
    this.checkproductstatus();
    this.getmobilenumber();
  }

  ngOnInit() { }
  back() {
    this.location.back();
  }
  search() {
    console.log("icon method called");
    this.router.navigate(['/searchbar']);
  }
  async callPopUp() {
  


      console.log("Enter In if RewBlock");
      
      const alert = await this.alertController.create({
        header: "Call To The Store",
        mode: "md",
        message: "Tab on call button to make a call",
        cssClass: "primary",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: blah => {
              console.log("Confirm Cancel: blah");
            }
          },
          {
            text: "call",
            cssClass: "secondary",
            handler: () => {
              this.makecall();
            }
          }
        ]
      });
  
      await alert.present();

    
    
  }

  async reviewProduct() {

    if(this.slideData[0].imageurl !==""){

      console.log("Enter In If block of ReviewProduct");
      

    
    console.log("reviewProduct", this.slideData);

    const modal = await this.modalCtrl.create({
      component: ReviewPage,
      componentProps: {
        data: this.slideData
      }
    });

    return await modal.present();
  }
  }


  async virtual() {
    this.router.navigate(['/virtual', this.productId]);
  }

  checkproductstatus() {
    console.log("Check product status Called");
    console.log(this.productId);
    this.authService.checkproductstatus(this.productId).subscribe((result: any) => {
      this.productstatus = result.success;
      console.log("stauts of product", this.productstatus);
      this.getProductDetails(this.productId);
    })
  }
  getProductDetails(id) {
    if (this.productstatus !== 'Item Not Found') {
      this.authService.presentLoading()
      let id1 = id;
      this.base = this.authService
        .getProductDetial(id1)
        .subscribe((data: any) => {
          console.log(data);
          this.productprice = data.productdetails.tbl_product_price;
          this.productname = data.productdetails.tbl_product_name;
          this.Size = data.productdetails.tbl_product_sizes;

          console.log("Product Size", this.Size[0].size);
          
          if(this.Size[0].size == ""){
            console.log("size if block");
            
            this.psize =false;
          }
          this.colors = data.productdetails.tbl_product_colors;
          if (this.colors.color == "") {

            console.log("In Color If block");
            this.colorvalue = false;
          }
          
          
          
          this.slideData = data.productdetails.tbl_product_images;
          this.postImage = data.productdetails.tbl_product_picture;
          this.sku = data.productdetails.tbl_product_sku;
          this.relesedate = data.productdetails.release_date;

          if(this.relesedate == "0000-00-00"){
            this.prelesedate=false;
          }
          this.description = data.productdetails.tbl_product_desc;
          this.history = data.productdetails.tbl_product_history;
          console.log("History",this.history);
          
          if(this.history == ""){
            this.phistory = false;
          }
          this.authService.loadingDismiss();
        }), err => {
          this.authService.loadingDismiss();
          this.authService.presentToast(err);
        };
    } 
  }
  getmobilenumber() {
    this.authService.getnumber().subscribe((data: any = []) => {
      this.mobileno = data.admin_number.storenumbercall;
      console.log("admin number is", this.mobileno);
    });
  }
  makecall() {
    this.callNumber
      .callNumber(this.mobileno, true)
      .then(res => console.log("Launched dialer!", res))
      .catch(err =>
        console.log("try calling on", this.mobileno, " but ", err)
      );
  }

  getsize(size,i){
    var div1:any=[];
    for(let j=0;j<=this.Size.length;j++){
       div1[j] = document.getElementById( 'ionchip'+j );
       console.log("div ", div1[j]);
       
       div1[j].style.backgroundColor='#fff';
       div1[j].style.color='#000';
    }
    console.log("size data ", size,i);
    var div = document.getElementById( 'ionchip'+i );
    console.log(div.style.backgroundColor);
    
    if(div.style.backgroundColor=='rgb(0, 0, 0)'){
      div.style.backgroundColor='#fff';
      div.style.color='#000';
    }
    else{
      div.style.backgroundColor='#000';
      div.style.color='#fff';
    }
    

  }
  getcolor(color,i){
    for(let j=0;j<=this.colors.length;j++){
      var div1 = document.getElementById( 'color'+j );
      div1.style.zoom='1'
    }
    console.log("size data ", color,i);
    var div = document.getElementById( 'color'+i );
    if( div.style.zoom=='1.3'){
      div.style.zoom='1'    
    } else{
      div.style.zoom='1.3'
    }
  }
}
