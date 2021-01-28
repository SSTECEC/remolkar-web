import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './view/ecommerce/index/index.component';
import { ProductsComponent } from './view/ecommerce/products/products.component';
import { ProductDetailComponent } from './view/ecommerce/product-detail/product-detail.component';
import { CartComponent } from './view/ecommerce/cart/cart.component';

import { BrandsComponent } from './view/ecommerce/brands/brands.component';
import { AboutComponent } from './view/ecommerce/about/about.component';
import { ContactComponent } from './view/ecommerce/contact/contact.component';
import { WishlistComponent } from './view/ecommerce/wishlist/wishlist.component';
import { CheckoutComponent } from './view/ecommerce/checkout/checkout.component';
import { CheckoutVerifyComponent } from './view/ecommerce/checkout-verify/checkout-verify.component';
import { AssistanceComponent } from './view/ecommerce/assistance/assistance.component';


const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'productos', component: ProductsComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },

  { path: 'marcas', component: BrandsComponent },
  { path: 'acerca', component: AboutComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'favoritos', component: WishlistComponent },
  { path: 'compra/:data', component: CheckoutComponent },
  { path: 'compras/verificacion', component: CheckoutVerifyComponent },
  { path: 'servicios', component: AssistanceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
