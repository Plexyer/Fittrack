import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService } from '../services/chat.service';
import { ChartData } from '../models/chart-data.model';
import { WorkoutService } from '../services/workout.service';
import { ExerciseService } from '../services/exercise.service';
import { RouterModule } from '@angular/router';
import { WorkoutCardComponent } from '../workout-parts/workout/workout-card/workout-card.component';
import { Workout } from '../models/workout.model';
import { ProgressChartComponent } from '../progress-chart/progress-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, WorkoutCardComponent, ProgressChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @Input() previewMode = false;
  recentWorkouts: Workout[] = [];
  workoutStats = {
    totalWorkouts: 0,
    totalExercises: 0,
    totalSets: 0,
    averageWorkoutsPerWeek: 0
  };
  recentPerformance: ChartData[] = [];
  isLoading = true;
  error: string = '';
  
  constructor(
    private workoutService: WorkoutService,
    private exerciseService: ExerciseService
  ) {}
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    this.workoutService.getAllWorkouts().subscribe({
      next: (workouts: any[]) => {
        this.recentWorkouts = this.getRecentWorkouts(workouts);
        this.calculateWorkoutStats(workouts);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  
  private getRecentWorkouts(workouts: any[]): any[] {
    return workouts
      .sort((a, b) => {
        const dateA = a.lastTrainingDate ? new Date(a.lastTrainingDate).getTime() : 0;
        const dateB = b.lastTrainingDate ? new Date(b.lastTrainingDate).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }
  
  calculateWorkoutStats(workouts: any[]): void {
    this.workoutStats.totalWorkouts = workouts.length;
    
    this.calculateAverageWorkoutsPerWeek(workouts);
    
    if (workouts.length === 0) {
      this.isLoading = false;
      return;
    }
    
    this.fetchExercisesAndSets(workouts);
  }
  
  private calculateAverageWorkoutsPerWeek(workouts: any[]): void {
    if (workouts.length === 0) {
      this.workoutStats.averageWorkoutsPerWeek = 0;
      return;
    }
    
    const validDates = workouts
      .map(workout => workout.createdAt || workout.lastTrainingDate || workout.lastWorkoutAt)
      .filter(date => date && !isNaN(new Date(date).getTime()));
    
    if (validDates.length > 0) {
      const firstWorkoutDate = new Date(Math.min(...validDates.map(d => new Date(d).getTime())));
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - firstWorkoutDate.getTime());
      const diffWeeks = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)));
      
      this.workoutStats.averageWorkoutsPerWeek = +(workouts.length / diffWeeks).toFixed(1);
    } else {
      this.workoutStats.averageWorkoutsPerWeek = workouts.length;
    }
  }
  
  private fetchExercisesAndSets(workouts: any[]): void {
    let loadedWorkouts = 0;
    let totalExercises = 0;
    let totalSets = 0;
    
    workouts.forEach(workout => {
      this.fetchWorkoutExercises(workout, (exercises) => {
        totalExercises += exercises.length;
        
        this.fetchExerciseSets(exercises, (setsCount) => {
          totalSets += setsCount;
          
          loadedWorkouts++;
          
          if (loadedWorkouts === workouts.length) {
            this.updateFinalStats(totalExercises, totalSets);
          }
        });
      });
    });
  }
  
  private fetchWorkoutExercises(workout: any, callback: (exercises: any[]) => void): void {
    this.workoutService.getWorkoutExercises(workout.id).subscribe({
      next: (exercises: any[]) => {
        callback(exercises);
      },
      error: () => {
        callback([]);
      }
    });
  }
  
  private fetchExerciseSets(exercises: any[], callback: (totalSets: number) => void): void {
    if (exercises.length === 0) {
      callback(0);
      return;
    }
    
    let loadedExercises = 0;
    let setsCount = 0;
    
    exercises.forEach(exercise => {
      this.exerciseService.getExerciseSets(exercise.id).subscribe({
        next: (sets: any[]) => {
          if (sets && Array.isArray(sets)) {
            setsCount += sets.length;
          }
          checkComplete();
        },
        error: () => {
          checkComplete();
        }
      });
    });
    
    function checkComplete() {
      loadedExercises++;
      if (loadedExercises === exercises.length) {
        callback(setsCount);
      }
    }
  }
  
  private updateFinalStats(totalExercises: number, totalSets: number): void {
    this.workoutStats.totalExercises = totalExercises;
    this.workoutStats.totalSets = totalSets;
    this.isLoading = false;
  }
}