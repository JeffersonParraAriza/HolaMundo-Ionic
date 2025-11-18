import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastState = {
    isOpen: false,
    message: '',
    color: 'primary'
  };

  show(message: string, color: string = 'primary') {
    this.toastState.message = message;
    this.toastState.color = color;
    this.toastState.isOpen = true;
  }
}
