import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NavController } from '@ionic/angular';

import { Tasks, TaskService } from './task-service.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
  constructor(private taskService: TaskService, private navCtrl: NavController) {}

  unsubscribe = new Subject();
  loading = false;

  task: Tasks;
  taskList: string[] = [];
  selectedTask: string;

  error: any;

  get currentTask() {
    return this.task?.content.find((t) => t.id === this.selectedTask).data;
  }

  // to-do: print inbox task-title, stylize list, add display-detail button
  list: Array<Object> = [];

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
          // map task info here
          this.task = res;
          console.log(res);
          this.taskList = res.content.map((t) => t.id);
          this.list = res.content.map((t) => t);
          console.log(this.list);
          //this.selectedTask = this.selectedTask[0];
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        },
      );
  }

  // to-do: on click, display task detail, think about how the page changes
  itemSelected(item: string) {
    console.log('Selected Item', item);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit() {
    this.getMyTasks();
  }
}
