import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';
import {
  FirebaseMessaging,
  GetTokenOptions,
} from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Firebase Cloud Messaging</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>About</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          ⚡️ Capacitor plugin for Firebase Cloud Messaging (FCM).
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Demo</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="fixed">Token</ion-label>
            <ion-input type="text" readonly [value]="token"></ion-input>
          </ion-item>
          <ion-button (click)="requestPermissions()"
            >Request Permissions</ion-button
          >
          <ion-button (click)="getToken()">Get Token</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: `
    #container {
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    #container strong {
      font-size: 20px;
      line-height: 26px;
    }

    #container p {
      font-size: 16px;
      line-height: 22px;

      color: #8c8c8c;

      margin: 0;
    }

    #container a {
      text-decoration: none;
    }
  `,
})
export class HomePage {
  public token = '';

  constructor() {
    FirebaseMessaging.addListener('notificationReceived', (event) => {
      console.log('notificationReceived: ', { event });
    });
    FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
      console.log('notificationActionPerformed: ', { event });
    });
    if (Capacitor.getPlatform() === 'web') {
      navigator.serviceWorker.addEventListener('message', (event: any) => {
        console.log('serviceWorker message: ', { event });
        const notification = new Notification(event.data.notification.title, {
          body: event.data.notification.body,
        });
        notification.onclick = (event) => {
          console.log('notification clicked: ', { event });
        };
      });
    }
  }

  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }

  public async getToken(): Promise<void> {
    const options: GetTokenOptions = {
      vapidKey: environment.firebaseConfig.apiKey,
    };
    if (Capacitor.getPlatform() === 'web') {
      options.serviceWorkerRegistration =
        await navigator.serviceWorker.register('firebase-messaging-sw.js');
    }
    const { token } = await FirebaseMessaging.getToken(options);
    this.token = token;
  }
}
