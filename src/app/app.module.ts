import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SuccessDialogueComponent } from './shared/ui/dialogues/success-dialogue/success-dialogue.component';
import { ErrorDialogueComponent } from './shared/ui/dialogues/error-dialogue/error-dialogue.component';
import { WarningDialogueComponent } from './shared/ui/dialogues/warning-dialogue/warning-dialogue.component';
import {TitleCasePipe} from './shared/pipes/title-case.pipe';
import {ShortNumberPipe} from './shared/pipes/short-number.pipe';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpErrorInterceptor} from './services/http-error-interceptor';
import {ReactiveFormsModule} from '@angular/forms';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import {PageLayoutModule} from './page-layout/page-layout.module';
import {PagesModule} from './pages/pages.module';
import {AuthModule} from './auth/auth-module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PaymentComponent } from './payment/payment.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { LogoutPopupComponent } from './shared/ui/dialogues/logout-popup/logout-popup.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    SuccessDialogueComponent,
    ErrorDialogueComponent,
    WarningDialogueComponent,
    TitleCasePipe,
    ShortNumberPipe,
    PaymentComponent,
    PageLayoutComponent,
    LogoutPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PageLayoutModule,
    PagesModule,
    HttpClientModule,
    AuthModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatTooltipModule

  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
