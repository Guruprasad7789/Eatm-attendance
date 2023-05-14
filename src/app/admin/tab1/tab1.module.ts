import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminTab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from 'src/app/explore-container/explore-container.module';
import { Tab1PageRoutingModule } from 'src/app/tab1/tab1-routing.module';
import { AdminTab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AdminTab1PageRoutingModule
  ],
  declarations: [AdminTab1Page]
})
export class AdminTab1PageModule {}
