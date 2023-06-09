import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'admin/tab1',
        loadChildren: () => import('../admin/tab1/tab1.module').then(m => m.AdminTab1PageModule)
      },
      {
        path: 'admin/tab2',
        loadChildren: () => import('../admin/tab2/tab2.module').then(m => m.AdminTab2PageModule)
      },
      {
        path: 'admin/tab3',
        loadChildren: () => import('../admin/tab3/tab3.module').then(m => m.AdminTab3PageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
