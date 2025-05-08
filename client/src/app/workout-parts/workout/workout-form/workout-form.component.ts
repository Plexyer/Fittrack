import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkoutService } from '../../../services/workout.service';
import { Workout } from '../../../models/workout.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss'
})
export class WorkoutFormComponent {
  @Output() workoutCreated = new EventEmitter<Workout>();
  @Output() cancelled = new EventEmitter<void>();

  workoutForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private workoutService: WorkoutService
  ) {
    this.workoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      duration: [null],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.workoutForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const formData = this.workoutForm.value;

    const workout: Workout = {
      name: formData.name,
      date: new Date(formData.date),
      duration: formData.duration || undefined,
      notes: formData.notes || undefined,
    };

    this.workoutService.createWorkout(workout).subscribe({
      next: (createdWorkout) => {
        this.workoutCreated.emit(createdWorkout);
        this.isSubmitting = false;
        window.location.href = `/workouts/${createdWorkout.id}`;
      },
      error: (error: any) => {
        console.error('Error creating workout', error);
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
