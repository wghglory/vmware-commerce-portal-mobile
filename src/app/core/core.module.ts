import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AuthService } from './services/auth.service';

@NgModule({
  imports: [CommonModule, HttpClientModule, IonicModule, IonicStorageModule.forRoot()],
  declarations: [],
  providers: [AuthService],
})
export class CoreModule {}
