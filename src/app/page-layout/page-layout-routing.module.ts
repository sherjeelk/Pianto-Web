import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../pages/home/home.component';
import {ReviewComponent} from '../pages/review/review.component';
import {PrivacyPolicyComponent} from '../pages/privacy-policy/privacy-policy.component';
import {TermsComponent} from '../pages/terms/terms.component';
import {TermsAndConditionComponent} from '../pages/terms-and-condition/terms-and-condition.component';
import {AboutUsComponent} from '../pages/about-us/about-us.component';
import {ReviewSuccessComponent} from '../pages/review-success/review-success.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'post-review/:id',
    component: ReviewComponent
  },
  {
    path: 'review-success',
    component: ReviewSuccessComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageLayoutRoutingModule { }
