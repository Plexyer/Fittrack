import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExerciseSet } from '../../../models/exercise-set.model';
import { SetService } from '../../../services/set.service';

@Component({
  selector: 'app-set-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './set-list.component.html',
  styleUrl: './set-list.component.scss'
})
export class SetListComponent {
  @Input() sets: ExerciseSet[] = [];
  @Output() setDeleted = new EventEmitter<number>();
  @Output() setUpdated = new EventEmitter<ExerciseSet>();

  editingSetId: number | undefined = undefined;
  editingSet: Partial<ExerciseSet> = {};

  constructor(private setService: SetService) {}

  startEdit(set: ExerciseSet): void {
    this.editingSetId = set.id;
    this.editingSet = { ...set };
  }

  cancelEdit(): void {
    this.editingSetId = undefined;
    this.editingSet = {};
  }

  saveSet(): void {
    if (this.editingSetId && this.editingSet) {
      const updatedSet = {
        ...this.editingSet,
        id: this.editingSetId
      } as ExerciseSet;

      this.setService.updateSet(updatedSet).subscribe({
        next: (result) => {
          console.log(result);
          this.setUpdated.emit(result);
          this.editingSetId = undefined;
          this.editingSet = {};
        },
        error: (error) => console.error('Error updating set:', error)
      });
    }
  }

  deleteSet(setId: number): void {
    if (confirm('Are you sure you want to delete this set?')) {
      this.setService.deleteSet(setId).subscribe({
        next: () => {
          this.setDeleted.emit(setId);
        },
        error: (error) => console.error('Error deleting set:', error)
      });
    }
  }
}
