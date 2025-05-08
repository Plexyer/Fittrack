import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exercise } from '../../../models/exercise.model';
import { ExerciseSet } from '../../../models/exercise-set.model';
import { ExerciseService } from '../../../services/exercise.service';
import { SetService } from '../../../services/set.service';
import { SetFormComponent } from '../../set/set-form/set-form.component';
import { SetListComponent } from '../../set/set-list/set-list.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [CommonModule, FormsModule, SetFormComponent, SetListComponent],
  templateUrl: './exercise-card.component.html',
  styleUrl: './exercise-card.component.scss'
})
export class ExerciseCardComponent {
  @Input() exercise!: Exercise;
  @Output() deleted = new EventEmitter<number>();

  sets: ExerciseSet[] = [];
  isExpanded = false;
  isEditing = false;
  showSetForm = false;

  editedExercise: Partial<Exercise> = {};

  constructor(
    private exerciseService: ExerciseService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.editedExercise = { ...this.exercise };
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.loadSets();
    }
  }

  loadSets(): void {
    this.exerciseService.getExerciseSets(this.exercise.id).subscribe({
      next: (sets) => {
        this.sets = sets;
      },
      error: (error) => console.error('Error loading sets:', error)
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.editedExercise = { ...this.exercise };
    }
  }

  saveExercise(): void {
    if (this.editedExercise.name) {
      const updatedExercise = {
        ...this.exercise,
        ...this.editedExercise
      };
      
      this.exerciseService.updateExercise(updatedExercise).subscribe({
        next: (exercise) => {
          this.exercise = exercise;
          this.isEditing = false;
        },
        error: (error) => console.error('Error updating exercise:', error)
      });
    }
  }

  deleteExercise(): void {
    if (confirm('Are you sure you want to delete this exercise?')) {
      this.exerciseService.deleteExercise(this.exercise.id).subscribe({
        next: () => {
          this.deleted.emit(this.exercise.id);
        },
        error: (error) => console.error('Error deleting exercise:', error)
      });
    }
  }

  toggleSetForm(): void {
    this.showSetForm = !this.showSetForm;
  }

  onSetAdded(set: ExerciseSet): void {
    this.sets.push(set);
    this.showSetForm = false;
  }

  onSetDeleted(setId: number): void {
    this.sets = this.sets.filter(set => set.id !== setId);
  }

  onSetUpdated(updatedSet: ExerciseSet): void {
    const index = this.sets.findIndex(set => set.id === updatedSet.id);
    if (index !== -1) {
      this.sets[index] = updatedSet;
    }
  }

  navigateToExerciseDetail(): void {
    if (this.exercise && this.exercise.id) {
      const url = this.router.url; 
      const segments = url.split('/');
      const workoutId = segments[2];
      
      if (workoutId) {
        console.log('Gefundene workoutId:', workoutId);
        this.router.navigate(['/workouts', workoutId, 'exercises', this.exercise.id]);
      } else {
        console.error('Keine workoutId in der aktuellen URL gefunden');
      }
    }
  }
}
