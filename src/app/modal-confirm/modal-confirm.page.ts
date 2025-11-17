import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonText
} from '@ionic/angular/standalone';

import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.page.html',
  styleUrls: ['./modal-confirm.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonText
  ]
})
export class ModalConfirmPage implements OnInit {

  noteId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.noteId = Number(params['id']);
      console.log("ModalConfirm - Note ID:", this.noteId);
    });
  }

  async confirmDelete() {
    await this.notesService.deleteNote(this.noteId);

    this.router.navigate(['/home']);
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
