import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CookieService } from 'ngx-cookie-service';

import { CoreModule } from '@vcp-core/core.module';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, CoreModule, RouterModule.forChild(routes)],
  providers: [CookieService],
  declarations: [LoginPage],
})
export class LoginPageModule {}
