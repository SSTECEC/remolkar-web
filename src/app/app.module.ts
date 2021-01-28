import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './view/ecommerce/index/index.component';
import { TopBarComponent } from './view/ecommerce/complements/top-bar/top-bar.component';
import { GenericService } from './method/generic/generic.service';
import { FooterComponent } from './view/ecommerce/complements/footer/footer.component';
import { ProductsComponent } from './view/ecommerce/products/products.component';
import { ProductDetailComponent } from './view/ecommerce/product-detail/product-detail.component';
import { CartComponent } from './view/ecommerce/cart/cart.component';
import { LanguageComponent } from './view/ecommerce/complements/language/language.component'
import { CartService } from './services/cart/cart.service';
import { ApiService } from './services/api/api.service';
import { WishlistService } from './services/wishlist/wishlist.service';
import { BrandsComponent } from './view/ecommerce/brands/brands.component';
import { AboutComponent } from './view/ecommerce/about/about.component';
import { ContactComponent } from './view/ecommerce/contact/contact.component';
import { WishlistComponent } from './view/ecommerce/wishlist/wishlist.component';
import { SessionService } from './services/session/session.service';
import { CheckoutComponent } from './view/ecommerce/checkout/checkout.component';
import { ScriptService } from './services/script/script.service';
import { CheckoutVerifyComponent } from './view/ecommerce/checkout-verify/checkout-verify.component';
import { AssistanceComponent } from './view/ecommerce/assistance/assistance.component';
import { CheckoutResultComponent } from './view/ecommerce/checkout-result/checkout-result.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    TopBarComponent,
    FooterComponent,
    ProductsComponent,
    ProductDetailComponent,
    CartComponent,
    LanguageComponent,
    BrandsComponent,
    AboutComponent,
    ContactComponent,
    WishlistComponent,
    CheckoutComponent,
    CheckoutVerifyComponent,
    AssistanceComponent,
    CheckoutResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule
  ],
  providers: [GenericService, CartService, ApiService, WishlistService, SessionService, ScriptService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
