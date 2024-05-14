import { Injectable, NgZone } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Subscription, interval } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PushService {


  constructor( private swPush: SwPush ) {
  
    console.log('PushService initialized');
    
    this.swPush.requestSubscription({
      serverPublicKey: 'BJTVbeluLDKkV12Oyd-LTf8Bxcq3iKKAz7rkUMFIqKyu-5uxt8_-PpK3DvuI1eDk_Dm-WC8I7IsYMHVeVJTWReY'
    })
   .then(async (subscription) => {
     console.log(subscription);
     await fetch("http://localhost:3000/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json",
        },
      });
    });
    this.swPush.messages.subscribe(msg => {
      console.log(msg);
    });
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      window.open(notification.data.url);
    });
  }


}