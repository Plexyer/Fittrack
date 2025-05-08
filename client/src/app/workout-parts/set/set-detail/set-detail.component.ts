import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseSet } from '../../../models/exercise-set.model';
import { SetService } from '../../../services/set.service';

@Component({
  selector: 'app-set-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './set-detail.component.html',
  styleUrl: './set-detail.component.scss'
})
export class SetDetailComponent implements OnInit {
  set: ExerciseSet = {
    id: 0,
    exerciseId: 0,
    repetitions: 0,
    weight: 0,
    setNumber: 0,
    notes: ''
  };
  
  exerciseId: number = 0;
  workoutId: number = 0;
  exerciseName: string = '';
  isSubmitting: boolean = false;
  originalDate: Date = new Date();
  displayDate: string = '';
  displayTime: string = '';
  exactTime: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private setService: SetService
  ) {}

  ngOnInit(): void {
    const setId = Number(this.route.snapshot.paramMap.get('setId') || 0);
    this.exerciseId = Number(this.route.snapshot.paramMap.get('exerciseId') || 0);
    this.workoutId = Number(this.route.snapshot.paramMap.get('workoutId') || 0);
    this.exerciseName = this.route.snapshot.queryParamMap.get('exerciseName') || '';
    
    if (setId) {
      this.loadSetDetails(setId);
    } else {
      this.navigateBack();
    }
  }

  loadSetDetails(setId: number): void {
    this.setService.getSet(setId).subscribe({
      next: (set: ExerciseSet) => {
        this.set = set;
        
        if ((set as any).createdAt) {
          this.originalDate = new Date((set as any).createdAt);
          
          this.displayDate = this.formatDate(this.originalDate);
          
          this.displayTime = this.formatTime(this.originalDate);
          
          this.exactTime = this.formatExactTime(this.originalDate);
        }
      },
      error: (error: any) => {
        console.error('Error loading set details:', error);
        this.navigateBack();
      }
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  formatExactTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  }

  updateDateTimeFromInputs(): void {
  }

  saveSet(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    this.setService.updateSet(this.set).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.navigateBack();
      },
      error: (error) => {
        console.error('Error updating set:', error);
        this.isSubmitting = false;
      }
    });
  }

  deleteSet(): void {
    if (!this.set.id) return;
    
    this.setService.deleteSet(this.set.id).subscribe({
      next: () => {
        this.navigateBack();
      },
      error: (error) => {
        console.error('Error deleting set:', error);
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/workouts', this.workoutId, 'exercises', this.exerciseId]);
  }
}