import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NavController } from '@ionic/angular';

import { TaskService, Content } from './task-service.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
  constructor(private taskService: TaskService, private navCtrl: NavController) {}

  unsubscribe = new Subject();
  loading = false;

  taskList: Content[];

  error: any;

  getMyTasks() {
    this.loading = true;

    this.taskService
      .getTasks()
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(
        (res) => {
          this.taskList = res.content;
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        },
      );
  }

  itemSelected(task: Content) {
    this.navCtrl.navigateForward([`/tabs/tasks/${task.id}`], { state: { task } });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit() {
    this.getMyTasks();
  }
}
