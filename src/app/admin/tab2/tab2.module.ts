import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminTab2Page } from './tab2.page';

import { AdminTab2PageRoutingModule } from './tab2-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AdminTab2PageRoutingModule
  ],
  declarations: [AdminTab2Page]
})
export class AdminTab2PageModule {}
