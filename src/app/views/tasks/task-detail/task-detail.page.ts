import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Task, TaskService } from '../task-service.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {
  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.detailForm = this.formBuilder.group({
      purchaseOrder: ['', [Validators.required, Validators.min(0), Validators.pattern(/\d+/)]],
      comments: [''],
    });
  }

  detailForm: FormGroup;
  unsubscribe = new Subject();

  loading = false;
  submitting = false;
  saving = false;

  task: Task;

  error: any;

  submit() {
    if (this.detailForm.invalid) {
      return;
    }
    this.submitting = true;
    const { purchaseOrder, comments } = this.detailForm.value;

    // TODO: call API
  }

  save() {
    if (this.detailForm.invalid) {
      return;
    }
    this.saving = true;
    const { purchaseOrder, comments } = this.detailForm.value;
    // TODO: call API
  }

  getTaskState() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.task = this.router.getCurrentNavigation().extras.state.task;
    } else {
      (err: HttpErrorResponse) => {
        this.error = err.error;
      };
    }
  }

  getTaskById() {
    const taskId = this.route.snapshot.paramMap.get('id');

    this.loading = true;

    this.taskService
      .getTaskById(taskId)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.loading = false)),
      )
      .subscribe(
        (res) => {
          this.task = res;
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        },
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit() {
    this.getTaskState();
    this.getTaskById();
  }
}
