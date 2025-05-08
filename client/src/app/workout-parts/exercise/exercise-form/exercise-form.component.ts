import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exercise } from '../../../models/exercise.model';
import { WorkoutService } from '../../../services/workout.service';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss'
})
export class ExerciseFormComponent {
  @Input() workoutId!: number;
  @Output() exerciseAdded = new EventEmitter<Exercise>();

  exercise: Partial<Exercise> = {
    name: '',
    notes: ''
  };

  isSubmitting = false;

  constructor(private workoutService: WorkoutService) {}

  onSubmit(): void {
    this.isSubmitting = true;
    this.workoutService.addExerciseToWorkout(this.workoutId, this.exercise as Exercise).subscribe({
      next: (newExercise: Exercise | undefined) => {
        this.exerciseAdded.emit(newExercise);
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error: any) => {
        console.error('Error adding exercise:', error);
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.exercise = {
      name: '',
      notes: ''
    };
  }
}
