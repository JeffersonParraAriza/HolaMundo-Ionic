import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonToast
} from '@ionic/angular/standalone';
import { NotesService, Note } from '../services/notes.service';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonToast,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel,
    IonFab, IonFabButton, IonIcon
  ]
})
export class HomePage implements OnInit {

  notes: Note[] = [];

  constructor(
    private notesService: NotesService,
    private router: Router
  ) {
    addIcons({ add });
  }

  async ngOnInit() {
    await this.loadNotes();
  }

  ionViewWillEnter() {
    this.loadNotes();
  }

  async loadNotes() {
    this.notes = await this.notesService.getNotes();

    if (this.notes.length === 0) {
      this.router.navigate(['/empty-state']);
    }
  }

  goToCreate() {
    this.router.navigate(['/create-edit']);
  }

  goToDetail(note: Note) {
    this.router.navigate(['/detail'], {
      queryParams: { id: note.id }
    });
  }

}
