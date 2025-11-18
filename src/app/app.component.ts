import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonToast } from '@ionic/angular/standalone';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonToast,
    IonApp,
    IonRouterOutlet
  ],
})
export class AppComponent {
  constructor() {}
  toastState = inject(ToastService).toastState;
}
