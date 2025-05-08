import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../../services/workout.service';
import { ExerciseService } from '../../../services/exercise.service';
import { Workout } from '../../../models/workout.model';
import { forkJoin } from 'rxjs';
import { WorkoutCardComponent } from '../workout-card/workout-card.component';
import { WorkoutFormComponent } from '../workout-form/workout-form.component';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkoutCardComponent, WorkoutFormComponent],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.scss'
})
export class WorkoutListComponent implements OnInit {
  workouts: Workout[] = [];
  isLoading = true;
  showForm = false;
  searchTerm = '';
  openCreateWorkout = false;

  constructor(private workoutService: WorkoutService, private exerciseService: ExerciseService) {
  }

  ngOnInit(): void {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.isLoading = true;
    this.workoutService.getAllWorkouts().subscribe({
      next: (workouts) => {
        this.workouts = workouts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading workouts', error);
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.openCreateWorkout = false;
    }
  }

  handleWorkoutCreated(workout: Workout): void {
    this.workouts.unshift(workout);
    this.showForm = false;
  }

  handleWorkoutDeleted(id: number): void {
    this.workouts = this.workouts.filter(w => w.id !== id);
  }

  get filteredWorkouts(): Workout[] {
    if (!this.searchTerm.trim()) return this.workouts;

    const term = this.searchTerm.toLowerCase();
    return this.workouts.filter(w =>
      w.name.toLowerCase().includes(term) ||
      (w.notes && w.notes.toLowerCase().includes(term))
    );
  }

  createTemplateWorkouts(): void {
    const workouts = [
      {
        id: 1,
        name: 'Push',
        date: new Date(),
        exercises: [
          {name: 'Bench Press'},
          {name: 'Overhead Press'},
          {name: 'Triceps Pushdown'},
          {name: 'Lateral Raise'},
          {name: 'Incline Dumbbell Press'}
        ]
      },
      {
        id: 2,
        name: 'Pull',
        date: new Date(),
        exercises: [
          {name: 'Pull Up'},
          {name: 'Barbell Row'},
          {name: 'Biceps Curl'},
          {name: 'Lat Pulldown'},
          {name: 'Row Machine'}
        ]
      },
      {
        id: 3,
        name: 'Leg',
        date: new Date(),
        exercises: [
          {name: 'Squat'},
          {name: 'Leg Press'},
          {name: 'Calf Raise'},
          {name: 'Leg Curl'},
          {name: 'Leg Extension'}
        ]
      }
    ];

    const createRequests = workouts.map(workout =>
      this.workoutService.createWorkout(workout)
    );

    forkJoin(createRequests).subscribe((createdWorkouts) => {
      this.createTemplateExercises(workouts, createdWorkouts);
      this.loadWorkouts();
      this.openCreateWorkout = false;
    });
  }

  createTemplateExercises(workouts: Workout[], createdWorkouts: Workout[]): void {
    for (let i = 0; i < createdWorkouts.length; i++) {
      const workout = createdWorkouts[i];
      const exercises = workouts[i].exercises;

      exercises?.forEach((exercise) => {
        this.workoutService.addExerciseToWorkout(workout.id!, exercise).subscribe({});
      })

    }
  }

  toggleCreateWorkout(): void {
    if (!this.showForm) {
      this.openCreateWorkout = !this.openCreateWorkout;
    }
    this.showForm = false;
  }
}
