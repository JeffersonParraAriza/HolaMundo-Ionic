import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private _storage: Storage | null = null;
  private NOTES_KEY = 'notes';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async getNotes(): Promise<Note[]> {
    return (await this._storage?.get(this.NOTES_KEY)) || [];
  }

  async saveNotes(notes: Note[]) {
    await this._storage?.set(this.NOTES_KEY, notes);
  }

  async addNote(note: Note) {
    const notes = await this.getNotes();
    notes.push(note);
    await this.saveNotes(notes);
  }

  async getNote(id: number): Promise<Note | undefined> {
    const notes = await this.getNotes();
    return notes.find(n => n.id === id);
  }

  async deleteNote(id: number) {
    let notes = await this.getNotes();
    notes = notes.filter(n => n.id !== id);
    await this.saveNotes(notes);
  }

}
