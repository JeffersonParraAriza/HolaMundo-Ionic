import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';

import { NotesService, Note } from '../services/notes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonIcon, 
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton,
    IonFab, IonFabButton,
    CommonModule
  ]
})
export class HomePage implements OnInit {

  notes: Note[] = [];

  constructor(
    private notesService: NotesService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadNotes();
  }

  async ionViewWillEnter() {
    await this.loadNotes();
  }

  async loadNotes() {
    this.notes = await this.notesService.getNotes();

    console.log("NOTES FOUND:", this.notes);

    if (this.notes.length === 0) {
      this.router.navigate(['/empty-state']);
    }
  }

  goToDetail(note: Note) {
    this.router.navigate(['/detail', note.id]);
  }

  createNote() {
    this.router.navigate(['/create-edit']);
  }

}
