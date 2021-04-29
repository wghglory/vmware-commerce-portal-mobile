import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NavController, ToastController } from '@ionic/angular';

import { Task, TaskService, TaskPayload } from '../task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit, OnDestroy {
  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private toastController: ToastController,
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

  goBack() {
    this.navCtrl.navigateBack(['/tabs/tasks']).then();
  }

  async successToast(message: string) {
    const toast = await this.toastController.create({
      color: 'success',
      message,
      duration: 2000,
    });
    await toast.present();
  }

  async errorToast(err: HttpErrorResponse) {
    const toast = await this.toastController.create({
      color: 'danger',
      message: err.error.message || err.message,
      duration: 5000,
    });
    await toast.present();
  }

  submit() {
    if (this.detailForm.invalid) {
      return;
    }
    this.submitting = true;
    const { purchaseOrder, comments } = this.detailForm.value;

    this.taskService
      .submitOrSave(
        {
          serviceProviderPurchaseOrder: purchaseOrder,
          usages: [],
          comment: comments,
          submit: true,
          zeroUsage: false,
        } as TaskPayload,
        this.task.resourceId,
      )
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.submitting = false)),
      )
      .subscribe(
        () => {
          this.goBack();
          this.successToast('Task submitted successfully').then(() => {
            window.location.reload();
          });
        },
        (err: HttpErrorResponse) => {
          this.errorToast(err).then();
        },
      );
  }

  save() {
    if (this.detailForm.invalid) {
      return;
    }
    this.saving = true;
    const { purchaseOrder, comments } = this.detailForm.value;

    this.taskService
      .submitOrSave(
        {
          serviceProviderPurchaseOrder: purchaseOrder,
          usages: [],
          comment: comments,
          submit: false,
          zeroUsage: false,
        } as TaskPayload,
        this.task.resourceId,
      )
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.saving = false)),
      )
      .subscribe(
        () => {
          this.goBack();
          this.successToast('Task saved successfully').then(() => {
            // TODO: call task list API
            window.location.reload();
          });
        },
        (err: HttpErrorResponse) => {
          this.errorToast(err).then();
        },
      );
  }

  getTaskState() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.task = this.router.getCurrentNavigation().extras.state.task;
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
