import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoreModule } from '@vcp-core/core.module';

import { MePage } from './me.page';

const routes: Routes = [
  {
    path: '',

    component: MePage,
  },
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, CoreModule, RouterModule.forChild(routes)],
  declarations: [MePage],
})
export class MePageModule {}
