import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  showLoader = new BehaviorSubject<boolean>(false);
  constructor(private alert: AlertController) {}
  changeLoader(show = false) {
    this.showLoader.next(show);
  }
  async showAlert(message: string) {
    const alert = await this.alert.create({
      header: 'Alert',
      subHeader: '',
      message,
      buttons: ['OK']
    });
    await alert.present();
    const result = await alert.onDidDismiss();
  }
}
