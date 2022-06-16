import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {AuthRoutingModule} from './auth-routing-module';
import {MatCardModule} from '@angular/material/card';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
    ],
    declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, ResetPasswordComponent]
})
export class AuthModule {}

