import { Component, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonBadge,
  IonInput,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonChip
} from '@ionic/angular/standalone';
import { NotesService, Note } from '../services/notes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonFab,
    IonFabButton,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonBadge,
    IonInput,
    IonTextarea,
    IonSegment,
    IonSegmentButton,
    IonChip,
    CommonModule,
    FormsModule
  ]
})
export class HomePage implements OnInit {

 constructor() {
    addIcons({ add });
  }

  notes: Note[] = [];
  filteredNotes: Note[] = [];
  categories: string[] = [];
  availableTags: string[] = [];

  searchTerm = '';
  selectedCategory = '';
  selectedTags: string[] = [];

  showForm = false;
  editingNote: Note | null = null;
  formTitle = '';
  formContent = '';
  formCategory = '';
  formTagsInput = '';

  private readonly notesService = inject(NotesService);
  private readonly toast = inject(ToastService);
  // private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);

  async ngOnInit() {
    await this.loadNotes();
  }

  async ionViewWillEnter() {
    await this.loadNotes();
  }

  async loadNotes() {
    this.notes = await this.notesService.getAll();
    this.categories = await this.notesService.getCategories();
    this.availableTags = await this.notesService.getTags();
    await this.applyFilters();
  }

  // RF005 – Buscar notas por texto (dinámico)
  async onSearchChange(event: CustomEvent) {
    this.searchTerm = (event.detail?.value || '').toString();
    await this.applyFilters();
  }

  // RF006/RF008 – Filtrar notas por categoría
  async onCategoryChange(event: CustomEvent) {
    this.selectedCategory = (event.detail?.value || '').toString();
    await this.applyFilters();
  }

  // RF007 – Crear categorías/etiquetas (selección de etiquetas existentes)
  async toggleTagSelection(tag: string) {
    if (this.selectedTags.length === 1 && this.selectedTags[0] === tag) {
      this.selectedTags = [];
    } else {
      this.selectedTags = [tag];
    }
    await this.applyFilters();
  }

  async clearTagFilters() {
    this.selectedTags = [];
    await this.applyFilters();
  }

  // RF005/RF006/RF008 – Aplicar filtros sobre la lista
  private async applyFilters() {
    this.filteredNotes = await this.notesService.search(
      this.searchTerm,
      this.selectedCategory,
      this.selectedTags
    );
  }

  // RF001 – Crear nueva nota
  startCreate() {
    this.editingNote = null;
    this.formTitle = '';
    this.formContent = '';
    this.formCategory = '';
    this.formTagsInput = '';
    this.showForm = true;
  }

  // RF002 – Editar nota existente
  startEdit(note: Note) {
    this.editingNote = note;
    this.formTitle = note.title;
    this.formContent = note.content;
    this.formCategory = note.category ?? '';
    this.formTagsInput = (note.tags ?? []).join(', ');
    this.showForm = true;
  }

  // RF010 – Navegación: Lista → Detalle/Edición
  cancelEdit() {
    this.showForm = false;
    this.editingNote = null;
    this.formTitle = '';
    this.formContent = '';
    this.formCategory = '';
    this.formTagsInput = '';
  }

  // RF001/RF002/RF007/RF012/RF013 – Guardar nota con validación y mensajes
  async saveNote() {
    const trimmedTitle = this.formTitle.trim();

    if (!trimmedTitle) {
      // const toast = await this.toastController.create({
      //   message: 'El título es obligatorio.',
      //   duration: 2000,
      //   color: 'warning'
      // });
      // await toast.present();
      this.toast.show('El título es obligatorio', 'warning');
      return;
    }

    await this.notesService.upsert({
      id: this.editingNote?.id,
      title: trimmedTitle,
      content: this.formContent,
      category: this.formCategory.trim(),
      tags: this.parseTags(this.formTagsInput)
    });

    await this.loadNotes();
    this.cancelEdit();

    // const toast = await this.toastController.create({
    //   message: 'Nota guardada correctamente.',
    //   duration: 2000,
    //   color: 'success'
    // });
    // await toast.present();

    this.toast.show('Nota guardada correctamente.', 'success');
  }

  // RF003/RF011 – Confirmación antes de eliminar
  async confirmDelete() {
    if (!this.editingNote) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Eliminar nota',
      message: '¿Deseas eliminar esta nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteNote(this.editingNote!.id);
          }
        }
      ]
    });

    await alert.present();
  }

  // RF003/RF013 – Eliminar nota y mostrar notificación
  private async deleteNote(id: number) {
    await this.notesService.deleteNote(id);
    await this.loadNotes();
    this.cancelEdit();

    // const toast = await this.toastController.create({
    //   message: 'Nota eliminada.',
    //   duration: 2000,
    //   color: 'medium'
    // });
    // await toast.present();

    this.toast.show('Nota eliminada', 'medium');

  }

  private parseTags(value: string): string[] {
    return value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }
}
