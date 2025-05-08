import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Exercise } from '../../../models/exercise.model';
import { ExerciseSet } from '../../../models/exercise-set.model';
import { ExerciseService } from '../../../services/exercise.service';
import { SetService } from '../../../services/set.service';

interface DateGroup {
  date: string;
  sets: ExerciseSet[];
  expanded: boolean;
}

interface ComparisonMetrics {
  sets: { value: number; change: number; percentage: number };
  repetitions: { value: number; change: number; percentage: number };
  volume: { value: number; change: number; percentage: number };
  intensity: { value: number; change: number; percentage: number };
}

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './exercise-detail.component.html',
  styleUrl: './exercise-detail.component.scss'
})
export class ExerciseDetailComponent implements OnInit {
  exerciseId: number = 0;
  workoutId: number = 0;
  exercise: Exercise | undefined;
  allSets: ExerciseSet[] = [];
  setsByDate: DateGroup[] = [];
  expandedDates: Set<string> = new Set();
  inputFlashedWeight = false;
  inputFlashedRepetitions = false;
  weightEdited = false;
  repsEdited = false;
  protected readonly Math = Math;

  dateMetrics: Map<string, ComparisonMetrics> = new Map();

  showSetForm: boolean = false;
  isSubmitting: boolean = false;
  newSet: ExerciseSet = {
    repetitions: this.getLastSetNumbers()[0] || 0,
    weight: this.getLastSetNumbers()[1] || 0,
    setNumber: 0
  };

  displayWeight: string = '';
  private weightTemp: string = '';
  displayReps: string = '';
  private repsTemp: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService,
    private setService: SetService
  ) {}

  ngOnInit(): void {
    this.exerciseId = Number(this.route.snapshot.paramMap.get('id') || 0);
    this.workoutId = Number(this.route.snapshot.paramMap.get('workoutId') || 0);

    this.loadExerciseDetails();
    this.loadExerciseSets();
  }

  loadExerciseDetails(): void {
   this.exerciseService.getExercise(this.exerciseId).subscribe(
    (exercise) => {
    this.exercise = exercise
    })
  }

  loadExerciseSets(): void {
    if (!this.exerciseId) return;
    this.exerciseService.getExerciseSets(this.exerciseId).subscribe({
      next: (sets: ExerciseSet[]) => {
        this.allSets = sets;
        
        this.allSets.forEach((set) => {
          if (!set.createdAt) {
            set.createdAt = new Date();
          } else if (typeof set.createdAt === 'string') {
            set.createdAt = new Date(set.createdAt);
          }
        });

        this.groupSetsByDate();
        this.calculateAllComparisons();
      },
      error: (error) => console.error('Error loading exercise sets:', error)
    });
  }
  
  groupSetsByDate(): void {
    const groups = new Map<string, ExerciseSet[]>();

    this.allSets.forEach(set => {
      if (!set.createdAt) return;
      
      const date = set.createdAt instanceof Date ? set.createdAt : new Date(set.createdAt);
      const dateStr = this.formatDateKey(date);
      
      if (!groups.has(dateStr)) {
        groups.set(dateStr, []);
      }
      groups.get(dateStr)?.push(set);
    });

    this.setsByDate = Array.from(groups.entries())
      .map(([date, sets]) => ({
        date,
        sets: sets.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
          
          return dateB.getTime() - dateA.getTime();
        }),
        expanded: false
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
    if (this.setsByDate.length > 0) {
      this.expandedDates.add(this.setsByDate[0].date);
    }
  }

  calculateAllComparisons(): void {
    this.dateMetrics.clear();
    
    for (let i = 0; i < this.setsByDate.length; i++) {
      const currentDateGroup = this.setsByDate[i];
      const previousDateGroup = i < this.setsByDate.length - 1 ? this.setsByDate[i + 1] : null;
      
      this.dateMetrics.set(
        currentDateGroup.date, 
        this.calculateComparisonMetrics(currentDateGroup.sets, previousDateGroup?.sets || [])
      );
    }
  }

  calculateComparisonMetrics(currentSets: ExerciseSet[], previousSets: ExerciseSet[]): ComparisonMetrics {
    // Current metrics
    const currentSetCount = currentSets.length;
    const currentTotalReps = this.getTotalReps(currentSets);
    const currentTotalVolume = this.getTotalVolume(currentSets);
    const currentAvgIntensity = this.getAvgWeightPerRep(currentSets);
    
    // Previous metrics
    const previousSetCount = previousSets.length;
    const previousTotalReps = this.getTotalReps(previousSets);
    const previousTotalVolume = this.getTotalVolume(previousSets);
    const previousAvgIntensity = this.getAvgWeightPerRep(previousSets);
    
    // Calculate changes
    const setChange = currentSetCount - previousSetCount;
    const repChange = currentTotalReps - previousTotalReps;
    const volumeChange = currentTotalVolume - previousTotalVolume;
    const intensityChange = currentAvgIntensity - previousAvgIntensity;
    
    // Calculate percentages (handle division by zero)
    const setPercentage = previousSetCount ? Math.round((setChange / previousSetCount) * 100) : 0;
    const repPercentage = previousTotalReps ? Math.round((repChange / previousTotalReps) * 100) : 0;
    const volumePercentage = previousTotalVolume ? Math.round((volumeChange / previousTotalVolume) * 100) : 0;
    const intensityPercentage = previousAvgIntensity ? Math.round((intensityChange / previousAvgIntensity) * 100) : 0;
    
    return {
      sets: { value: currentSetCount, change: setChange, percentage: setPercentage },
      repetitions: { value: currentTotalReps, change: repChange, percentage: repPercentage },
      volume: { value: currentTotalVolume, change: volumeChange, percentage: volumePercentage },
      intensity: { value: currentAvgIntensity, change: intensityChange, percentage: intensityPercentage }
    };
  }

  getMetricsForDate(dateStr: string): ComparisonMetrics {
    return this.dateMetrics.get(dateStr) || {
      sets: { value: 0, change: 0, percentage: 0 },
      repetitions: { value: 0, change: 0, percentage: 0 },
      volume: { value: 0, change: 0, percentage: 0 },
      intensity: { value: 0, change: 0, percentage: 0 }
    };
  }

  getChangeDirection(change: number): string {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'equal';
  }

  formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDateHeader(dateStr: string): string {
    const date = new Date(dateStr);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };

    return date.toLocaleDateString('en-US', options).toUpperCase();
  }

  isToday(dateStr: string): boolean {
    const today = new Date();
    return this.formatDateKey(today) === dateStr;
  }

  isYesterday(dateStr: string): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.formatDateKey(yesterday) === dateStr;
  }

  formatTime(date: Date | undefined): string {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) || '';
  }

  toggleDateExpanded(dateStr: string): void {
    if (this.expandedDates.has(dateStr)) {
      this.expandedDates.delete(dateStr);
    } else {
      this.expandedDates.add(dateStr);
    }
  }

  isDateExpanded(dateStr: string): boolean {
    return this.expandedDates.has(dateStr);
  }

  getTotalReps(sets: ExerciseSet[]): number {
    return sets.reduce((sum, set) => sum + set.repetitions, 0);
  }

  getTotalVolume(sets: ExerciseSet[]): number {
    return sets.reduce((sum, set) => sum + (set.repetitions * set.weight), 0);
  }

  getAvgWeightPerRep(sets: ExerciseSet[]): number {
    const totalReps = this.getTotalReps(sets);
    if (totalReps === 0) return 0;

    const totalWeight = sets.reduce((sum, set) => sum + (set.weight * set.repetitions), 0);
    return Math.round(totalWeight / totalReps);
  }

  getCurrentDay(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  showAddSetForm(): void {
    this.showSetForm = true;
    this.resetNewSet();
  }

  hideAddSetForm(): void {
    this.showSetForm = false;
    this.weightEdited = false;
    this.repsEdited = false;
  }

  resetNewSet(): void {
    this.newSet = {
      exerciseId: this.exerciseId,
      repetitions: this.getLastSetNumbers()[0] || 0,
      weight: this.getLastSetNumbers()[1] || 0,
      setNumber: this.allSets.length + 1
    };
  }

  getLastSetNumbers(): number[] {
    const lastSet = this.allSets[this.allSets.length - 1];
    if (!lastSet) return [0, 0];
    const lastSetRepetitions = lastSet.repetitions;
    const lastSetWeight = lastSet.weight;
    this.displayWeight = lastSetWeight.toString();
    this.displayReps = lastSetRepetitions.toString();

    return [lastSetRepetitions, lastSetWeight];
  }

  addSet(): void {
    if (this.isSubmitting || !this.exerciseId) return;

    this.isSubmitting = true;

    this.exerciseService.addSetToExercise(this.exerciseId, this.newSet).subscribe({
      next: (set: ExerciseSet) => {
        (set as any).createdAt = new Date();


        this.allSets.push(set);
        this.groupSetsByDate();
        this.calculateAllComparisons();
        this.hideAddSetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error adding set:', error);
        this.isSubmitting = false;
      }
    });
  }

  deleteSet(setId: number): void {
    if (confirm('Are you sure you want to delete this set?')) {
      this.setService.deleteSet(setId).subscribe({
        next: () => {
          this.allSets = this.allSets.filter(s => s.id !== setId);
          this.groupSetsByDate();
          this.calculateAllComparisons(); 
        },
        error: (error) => console.error('Error deleting set:', error)
      });
    }
  }

  openSetDetails(set: ExerciseSet): void {
    this.router.navigate(
      ['/workouts', this.workoutId, 'exercises', this.exerciseId, 'sets', set.id],
      { queryParams: { exerciseName: this.exercise?.name || '' } }
    );
  }

  flashInputWeight() {
    this.inputFlashedWeight = true;
    setTimeout(() => this.inputFlashedWeight = false, 200);
  }

  flashInputRepetitions() {
    this.inputFlashedRepetitions = true;
    setTimeout(() => {
      this.inputFlashedRepetitions = false;
    }, 200); 
  }

  decreaseWeight() {
    this.newSet.weight = Math.max(0, (this.newSet.weight || 0) - 0.5);
    this.displayWeight = this.newSet.weight.toString();
    this.weightEdited = true;
    this.flashInputWeight();
  }

  increaseWeight() {
    this.newSet.weight = (this.newSet.weight || 0) + 0.5;
    this.displayWeight = this.newSet.weight.toString();
    this.weightEdited = true;
    this.flashInputWeight();
  }

  decreaseReps() {
    this.newSet.repetitions = Math.max(0, (this.newSet.repetitions || 0) - 1);
    this.displayReps = this.newSet.repetitions.toString();
    this.repsEdited = true;
    this.flashInputRepetitions();
  }

  increaseReps() {
    this.newSet.repetitions = (this.newSet.repetitions || 0) + 1;
    this.displayReps = this.newSet.repetitions.toString();
    this.repsEdited = true;
    this.flashInputRepetitions();
  }

  handleWeightFocus() {
    this.weightTemp = this.displayWeight;
    this.displayWeight = '';
  }

  handleWeightBlur() {
    if (this.displayWeight === '') {
      this.displayWeight = this.weightTemp;
    }
  }

  handleWeightInput(value: string) {
    this.displayWeight = value;
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      this.newSet.weight = parsed;
      this.weightEdited = true;
    }
  }

  handleRepsFocus() {
    this.repsTemp = this.displayReps;
    this.displayReps = '';
  }

  handleRepsBlur() {
    if (this.displayReps === '') {
      this.displayReps = this.repsTemp;
    }
  }

  handleRepsInput(value: string) {
    this.displayReps = value;
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      this.newSet.repetitions = parsed;
      this.repsEdited = true;
    }
  }
}