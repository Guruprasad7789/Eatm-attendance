import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminTab2Page } from './tab2.page';

import { ExploreContainerComponentModule } from 'src/app/explore-container/explore-container.module';
import { AdminTab2PageRoutingModule } from './tab2-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AdminTab2PageRoutingModule
  ],
  declarations: [AdminTab2Page]
})
export class AdminTab2PageModule {}
