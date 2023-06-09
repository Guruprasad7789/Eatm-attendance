import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponentComponent } from './auth-component/auth-component.component';
import { environment } from 'src/environments/environment';
// Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AuthGuardService } from './guards/auth.guard';
import { AttendanceService } from './services/attendance.service';
import { AppService } from './services/app.service';
import { AuthLoggedGuardService } from './guards/auth-logged.guard';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [AppComponent,AuthComponentComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  providers: [CommonModule,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthGuardService, AuthLoggedGuardService, AttendanceService, AppService, File],
  bootstrap: [AppComponent],
})
export class AppModule {}
