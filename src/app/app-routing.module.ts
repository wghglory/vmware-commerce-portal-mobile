import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@vcp-core/services/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./views/tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login', //change back to tabs if redirect doesnt work
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'tabs',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
