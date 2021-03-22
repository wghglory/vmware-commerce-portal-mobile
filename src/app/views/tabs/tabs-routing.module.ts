import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard', // tab1
        loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardPageModule),
      },
      {
        path: 'me', // tab2
        loadChildren: () => import('../me/me.module').then((m) => m.MePageModule),
      },
      {
        path: '',
        redirectTo: 'dashboard', // redirect to tab1
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
