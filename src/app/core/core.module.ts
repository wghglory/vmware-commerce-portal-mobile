import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { providers } from './services/interceptor';

@NgModule({
  imports: [CommonModule, HttpClientModule, IonicModule, IonicStorageModule.forRoot()],
  declarations: [],
  providers: [AuthGuard, AuthService, ...providers],
})
export class CoreModule {}
