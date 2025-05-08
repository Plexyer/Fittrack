import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Workout } from '../../../models/workout.model';
import { WorkoutService } from '../../../services/workout.service';

@Component({
  selector: 'app-workout-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './workout-card.component.html',
  styleUrl: './workout-card.component.scss'
})
export class WorkoutCardComponent {
  @Input() workout!: Workout;
  @Output() deleted = new EventEmitter<number>();
  isDeleting = false;
  showDeleteConfirm = false;
  constructor(private workoutService: WorkoutService) {}
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('de-CH', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  toggleDeleteConfirm(): void {
    this.showDeleteConfirm = !this.showDeleteConfirm;
  }

  deleteWorkout(): void {
    if (!this.workout.id) return;

    this.isDeleting = true;

    this.workoutService.deleteWorkout(this.workout.id).subscribe({
      next: () => {
        this.deleted.emit(this.workout.id);
        this.isDeleting = false;
      },
      error: (error: any) => {
        console.error('Error deleting workout', error);
        this.isDeleting = false;
      }
    });
  }

  getDaysSinceLastTraining(dateStr: Date | undefined): string {
    if (!dateStr) return 'Never trained';

    const date = new Date(dateStr.toString().split(".")[0])
    date.setHours(date.getHours() + 2);

    const now = new Date(Date.now());
    const diffTime = Math.abs((now.getTime()/1000) - (date.getTime()/1000));

    if (isNaN(date.getTime())) {
      console.error('Invalid date provided:', date);
      return 'Unknown';
    }

    return this.calculateTimeDifference(diffTime);
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
