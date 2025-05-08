import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExerciseSet } from '../../../models/exercise-set.model';
import { ExerciseService } from '../../../services/exercise.service';

@Component({
  selector: 'app-set-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './set-form.component.html',
  styleUrl: './set-form.component.scss'
})
export class SetFormComponent {
  @Input() exerciseId!: number;
  @Output() setAdded = new EventEmitter<ExerciseSet>();

  setData: Partial<ExerciseSet> = {
    repetitions: 0,
    weight: 0,
    notes: ''
  };

  isSubmitting = false;

  constructor(private exerciseService: ExerciseService) {}

  onSubmit(): void {
    this.isSubmitting = true;

    this.exerciseService.addSetToExercise(this.exerciseId, this.setData as ExerciseSet).subscribe({
      next: (newSet) => {
        this.setAdded.emit(newSet);
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.setData = {
      repetitions: 0,
      weight: 0,
      notes: ''
    };
  }
}
