import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Workout } from '../../../models/workout.model';
import { Exercise } from '../../../models/exercise.model';
import { WorkoutService } from '../../../services/workout.service';
import { ExerciseService } from '../../../services/exercise.service';
import { ExerciseFormComponent } from '../../exercise/exercise-form/exercise-form.component';
import { ExerciseCardComponent } from '../../exercise/exercise-card/exercise-card.component';

@Component({
  selector: 'app-workout-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ExerciseFormComponent,
    ExerciseCardComponent
  ],
  templateUrl: './workout-detail.component.html',
  styleUrl: './workout-detail.component.scss'
})
export class WorkoutDetailComponent implements OnInit {
  workout: Workout | undefined;
  exercises: Exercise[] = [];
  showExerciseForm = false;

  now() {
    return new Date();
  }


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService,
  ) {}

  ngOnInit(): void {
    this.loadWorkout();
  }

  loadWorkout(): void {
    console.log('test');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.workoutService.getWorkout(+id).subscribe({
        next: (workout: any) => {
          this.workout = workout;
          this.loadExercises(+id);
        },
        error: (error: any) => console.error('Error loading workout:', error)
      });
    }
  }

  loadExercises(workoutId: number | undefined): void {
    this.workoutService.getWorkoutExercises(workoutId).subscribe({
      next: (exercises: Exercise[]) => {
        this.exercises = exercises;
      },
      error: (error: any) => console.error('Error loading exercises:', error)
    });
  }

  toggleExerciseForm(): void {
    this.showExerciseForm = !this.showExerciseForm;
  }

  onExerciseAdded(exercise: Exercise): void {
    if (this.workout) {
      this.exercises.push(exercise);
      this.showExerciseForm = false;
    }
  }

  onExerciseDeleted(exerciseId: number): void {
    this.exercises = this.exercises.filter(ex => ex.id !== exerciseId);
  }

  deleteWorkout(): void {
    if (this.workout && confirm('Are you sure you want to delete this workout?')) {
      this.workoutService.deleteWorkout(this.workout.id).subscribe({
        next: () => {
          this.router.navigate(['/workouts']);
        },
        error: (error: any) => console.error('Error deleting workout:', error)
      });
    }
  }

  updateWorkoutDate(): void {
    if (this.workout) {
      const workoutId = this.workout.id;
      console.log('Updating workout date for workout ID:', workoutId);
      this.workoutService.updateLastPerformed(workoutId).subscribe({
        next: (updatedWorkout: any) => {
          console.log('Received updated workout:', updatedWorkout);
          this.workoutService.getWorkout(workoutId).subscribe({
            next: (refreshedWorkout: any) => {
              console.log('Refreshed workout after update:', refreshedWorkout);
              if (refreshedWorkout) {
                this.workout = refreshedWorkout;
                this.loadExercises(workoutId);
              } else {
                console.error('Could not refresh workout data');
                this.router.navigate(['/workouts']);
              }
            },
            error: (error) => {
              console.error('Error reloading workout:', error);
              this.router.navigate(['/workouts']);
            }
          });
        },
        error: (error: any) => {
          console.error('Error updating workout date:', error);
          this.loadWorkout();
        }
      });
    }
  }

  getDaysSinceLastTraining(dateStr: Date | undefined): string {
    if (!dateStr) return 'Never trained';

    const date = new Date(dateStr.toString().split(".")[0])

    if (isNaN(date.getTime())) {
      console.error('Invalid date provided:', date);
      return 'Unknown';
    }

    const today = new Date();
    const datePart = today.toLocaleDateString("de-CH");
    const timePart = today.toLocaleTimeString("de-CH");

    return datePart + " " + timePart.toString();
  }
}
