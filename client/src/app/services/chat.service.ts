import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Workout } from '../models/workout.model';
import { WorkoutService } from './workout.service';
import { ChartData } from '../models/chart-data.model';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor(
    private workoutService: WorkoutService
  ) { }

  getWorkoutFrequencyData(weeks: number = 4): Observable<ChartData[]> {
    return this.workoutService.getAllWorkouts().pipe(
      map(workouts => {
        if (workouts.length === 0) {
          return this.getSampleWorkoutFrequencyData(weeks);
        }
        // Create date range for the past X weeks
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - (weeks * 7));
        
        // Initialize data structure with all dates in range
        const chartData: ChartData[] = [];
        
        // Group workouts by week
        const weekMap = new Map<string, number>();
        
        // Fill weekMap with all weeks in range
        for (let i = 0; i < weeks; i++) {
          const weekStart = new Date(startDate);
          weekStart.setDate(startDate.getDate() + (i * 7));
          const weekLabel = this.getWeekLabel(weekStart);
          weekMap.set(weekLabel, 0);
        }
        
        // Count workouts per week
        workouts.forEach(workout => {
          const workoutDate = new Date(workout.lastWorkoutAt || workout.date);
          if (workoutDate >= startDate && workoutDate <= today) {
            const weekLabel = this.getWeekLabel(workoutDate);
            const currentCount = weekMap.get(weekLabel) || 0;
            weekMap.set(weekLabel, currentCount + 1);
          }
        });
        
        // Convert map to array for chart data
        weekMap.forEach((count, weekLabel) => {
          chartData.push({
            label: weekLabel,
            value: count
          });
        });
        
        return chartData;
      })
    );
  }

  getExerciseProgressData(exerciseNames: string[] = [], weeks: number = 8): Observable<any> {
    return this.workoutService.getAllWorkouts().pipe(
      map(workouts => {
        // Sort workouts by date
        workouts.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        });

        // Track max weight lifted per exercise over time
        const exerciseProgress: any = {};
        const allExerciseNames = new Set<string>();

        // Get all unique exercise names if none provided
        if (!exerciseNames.length) {
          workouts.forEach(workout => {
            workout.exercises?.forEach(exercise => {
              allExerciseNames.add(exercise.name);
            });
          });
          exerciseNames = Array.from(allExerciseNames).slice(0, 5); // Limit to top 5 exercises
        }

        // Initialize progress tracking for each exercise
        exerciseNames.forEach(name => {
          exerciseProgress[name] = [];
        });

        // Process each workout
        workouts.forEach(workout => {
          const workoutDate = new Date(workout.date);
          const dateLabel = workoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          workout.exercises?.forEach(exercise => {
            if (exerciseNames.includes(exercise.name) && exercise.sets && exercise.sets.length > 0) {
              const maxWeightSet = exercise.sets
                .reduce((max, set) => (set.weight > max.weight) ? set : max, { weight: 0, reps: 0 } as any);
              
              if (maxWeightSet && maxWeightSet.weight > 0) {
                exerciseProgress[exercise.name].push({
                  date: workoutDate,
                  dateLabel: dateLabel,
                  weight: maxWeightSet.weight,
                  reps: maxWeightSet.reps
                });
              }
            }
          });
        });

        // Format data for chart output
        const chartData = {
          labels: [] as string[],
          datasets: [] as any[]
        };

        const allDates = new Set<string>();
        Object.values(exerciseProgress).forEach((progressArray: any) => {
          if (Array.isArray(progressArray)) {
            progressArray.forEach(item => allDates.add(item.dateLabel));
          }
        });
        
        // Sort dates chronologically
        chartData.labels = Array.from(allDates).sort((a, b) => {
          return new Date(a).getTime() - new Date(b).getTime();
        });

        // Create datasets for each exercise
        exerciseNames.forEach((name, index) => {
          const dataPoints: any = {};
          exerciseProgress[name].forEach((point: any) => {
            dataPoints[point.dateLabel] = point.weight;
          });

          // Map to full timeline
          const data = chartData.labels.map(label => dataPoints[label] || null);
          
          chartData.datasets.push({
            label: name,
            data: data,
            fill: false,
            borderColor: this.getChartColor(index),
            tension: 0.1
          });
        });

        return chartData;
      })
    );
  }

  getTotalVolumeData(weeks: number = 4): Observable<ChartData[]> {
    return this.workoutService.getAllWorkouts().pipe(
      map(workouts => {
        // Create date bins for the weeks
        const chartData: ChartData[] = [];
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - (weeks * 7));
        
        // Initialize week-based data bins
        const weeklyVolume = new Map<string, number>();
        
        for (let i = 0; i < weeks; i++) {
          const weekStart = new Date(startDate);
          weekStart.setDate(startDate.getDate() + (i * 7));
          const weekLabel = this.getWeekLabel(weekStart);
          weeklyVolume.set(weekLabel, 0);
        }
        
        // Calculate volume (weight × reps) for each workout and add to appropriate week
        workouts.forEach(workout => {
          const workoutDate = new Date(workout.date);
          if (workoutDate >= startDate && workoutDate <= today) {
            const weekLabel = this.getWeekLabel(workoutDate);
            let workoutVolume = 0;
            
            workout.exercises?.forEach(exercise => {
              exercise.sets?.forEach(set => {
                  workoutVolume += set.weight * set.repetitions;
              });
            });
            
            const currentVolume = weeklyVolume.get(weekLabel) || 0;
            weeklyVolume.set(weekLabel, currentVolume + workoutVolume);
          }
        });
        
        // Convert map to array for chart
        weeklyVolume.forEach((volume, weekLabel) => {
          chartData.push({
            label: weekLabel,
            value: volume
          });
        });
        
        return chartData;
      })
    );
  }

  private getWeekLabel(date: Date): string {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
    
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  private getChartColor(index: number): string {
    const colors = [
      '#FF6384', // Red
      '#36A2EB', // Blue
      '#FFCE56', // Yellow
      '#4BC0C0', // Teal
      '#9966FF', // Purple
      '#FF9F40', // Orange
      '#8CBA80', // Green
      '#EA526F'  // Pink
    ];
    return colors[index % colors.length];
  }

  private getSampleWorkoutFrequencyData(weeks: number): ChartData[] {
    const chartData: ChartData[] = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - (weeks * 7));
    
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (i * 7));
      const weekLabel = this.getWeekLabel(weekStart);
      // Generate random workout count between 2-5
      chartData.push({
        label: weekLabel,
        value: Math.floor(Math.random() * 4) + 2
      });
    }
    
    return chartData;
  }
}