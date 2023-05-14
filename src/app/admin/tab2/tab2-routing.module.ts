import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: '',
    component: AdminTab2Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTab2PageRoutingModule {}
