import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminTab3Page } from './tab3.page';

import { AdminTab3PageRoutingModule } from './tab3-routing.module';
import { ExploreContainerComponentModule } from 'src/app/explore-container/explore-container.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: AdminTab3Page }]),
    AdminTab3PageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AdminTab3Page]
})
export class AdminTab3PageModule {}
