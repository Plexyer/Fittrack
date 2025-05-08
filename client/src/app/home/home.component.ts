import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { WorkoutService } from '../services/workout.service';
import { Workout } from '../models/workout.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  recentWorkouts: Workout[] = [];
  upcomingWorkoutSuggestion: Workout | null = null;
  isLoading = false;
  error = '';

  constructor(private workoutService: WorkoutService, private router: Router) {}

  ngOnInit(): void {
    this.loadRecentWorkouts();
  }

  loadRecentWorkouts(): void {
    this.isLoading = true;
    this.workoutService.getAllWorkouts().subscribe({
      next: (workouts) => {
        const sortedWorkouts = [...workouts].sort((a, b) => {
          const dateA = a.lastWorkoutAt ? new Date(a.lastWorkoutAt).getTime() : 0;
          const dateB = b.lastWorkoutAt ? new Date(b.lastWorkoutAt).getTime() : 0;
          return dateB - dateA;
        });

        this.recentWorkouts = sortedWorkouts.slice(0, 3);

        this.findWorkoutSuggestion(sortedWorkouts);

        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load workouts';
        this.isLoading = false;
        console.error('Error loading workouts:', error);
      }
    });
  }

  findWorkoutSuggestion(workouts: Workout[]): void {
    if (workouts.length === 0) return;

    this.upcomingWorkoutSuggestion = [...workouts]
      .sort((a, b) => {
        const dateA = a.lastWorkoutAt ? new Date(a.lastWorkoutAt).getTime() : 0;
        const dateB = b.lastWorkoutAt ? new Date(b.lastWorkoutAt).getTime() : 0;
        return dateA - dateB;
      })[0];
  }

  startWorkout(workoutId: number | undefined): void {
    this.router.navigate(['/workouts', workoutId]);
  }

  getDaysSinceLastTraining(dateStr: Date | undefined): string {
    if (!dateStr) return 'Never trained';

    const date = new Date(dateStr.toString().split(".")[0])
    date.setHours(date.getHours() + 2);

    const now = new Date(Date.now());
    const diffTime = Math.abs((now.getTime()/1000) - (date.getTime()/1000));

    try {
      return this.calculateTimeDifference(diffTime);
    } catch (error) {
      console.error('Invalid date provided:', date);
      return 'Unknown';
    }
  }

  calculateTimeDifference(diffTime: number): string {
    if (diffTime < 60) {
      return "Just now";
    }

    const intervals = [
      { limit: 3600, divisor: 60, unit: "minute" },
      { limit: 86400, divisor: 3600, unit: "hour" },
      { limit: 604800, divisor: 86400, unit: "day" },
      { limit: 2419200, divisor: 604800, unit: "week" }
    ];

    for (const { limit, divisor, unit } of intervals) {
      if (diffTime < limit) {
        const count = Math.floor(diffTime / divisor);
        return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "months ago";
  }
}
