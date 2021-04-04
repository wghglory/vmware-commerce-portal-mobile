import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksPageRoutingModule } from './tasks-routing.module';

import { TasksPage } from './tasks.page';
import { TaskDetailPage } from './task-detail/task-detail.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TasksPageRoutingModule],
  declarations: [TasksPage, TaskDetailPage],
})
export class TasksPageModule {}
