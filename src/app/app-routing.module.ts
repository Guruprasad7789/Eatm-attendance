import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthComponentComponent } from './auth-component/auth-component.component';
import { AuthGuardService } from './guards/auth.guard';
import { AuthLoggedGuardService } from './guards/auth-logged.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuardService]

  },
  {
    path: '',
    component: AuthComponentComponent,
    canActivate: [AuthLoggedGuardService]
  },

  { path: '**', redirectTo: '' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
