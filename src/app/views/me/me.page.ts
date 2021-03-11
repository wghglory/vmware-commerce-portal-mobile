import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage';

import { CURRENT_USER } from '@vcp-share/const';
import { User } from '@vcp-core/models/user';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  constructor(private storage: Storage) {}

  user: User = {} as User;

  get name() {
    return `${this.user.firstName}, ${this.user.lastName}`;
  }

  badgeColor(i: number) {
    switch (i % 3) {
      case 0:
        return 'success';
      case 1:
        return 'tertiary';
      case 2:
        return 'secondary';
      default:
        return '';
    }
  }

  async ngOnInit() {
    const { user } = await this.storage.get(CURRENT_USER);
    this.user = user;
  }
}
