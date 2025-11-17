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
    await this.initStorage();
    const notes = await this._storage?.get(this.NOTES_KEY);
    return notes || [];
  }

  async saveNotes(notes: Note[]) {
    await this.initStorage();
    await this._storage?.set(this.NOTES_KEY, notes);
  }


  async addNote(note: Note) {
    await this.initStorage();
    const notes = await this.getNotes();
    notes.push(note);
    await this._storage?.set(this.NOTES_KEY, notes);
  }


  async getNote(id: number): Promise<Note | undefined> {
    await this.initStorage();
    const notes = await this.getNotes();
    return notes.find(note => note.id === id);
  }


  async deleteNote(id: number) {
    await this.initStorage();

    const notes = await this.getNotes();
    const filtered = notes.filter(n => n.id !== id);

    await this._storage?.set(this.NOTES_KEY, filtered);
  }


  private async initStorage() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }


}
