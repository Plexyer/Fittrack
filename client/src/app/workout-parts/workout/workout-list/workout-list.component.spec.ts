import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutListComponent } from './workout-list.component';
import { WorkoutService } from '../../../services/workout.service';
import { of, throwError } from 'rxjs';
import { Workout } from '../../../models/workout.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {ActivatedRoute} from '@angular/router';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;

  const mockWorkouts: Workout[] = [
    { id: 1, name: 'Back Day', date: new Date('2024-04-25'), notes: 'Pull focus' },
    { id: 2, name: 'Leg Day', date: new Date('2024-04-28'), notes: 'Heavy squats' },
    { id: 3, name: 'Push Day', date: new Date('2024-04-20'), notes: 'Chest & triceps' }
  ];

  beforeEach(async () => {
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', ['getAllWorkouts']);

    await TestBed.configureTestingModule({
      imports: [WorkoutListComponent, HttpClientTestingModule],
      providers: [
        { provide: WorkoutService, useValue: workoutServiceSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load and sort workouts on init', () => {
    workoutService.getAllWorkouts.and.returnValue(of(mockWorkouts));
    fixture.detectChanges();

    expect(component.workouts.length).toBe(3);
    expect(component.isLoading).toBeFalse();
    expect(component.workouts[0].name).toBe('Leg Day');
  });

  it('should handle error during loadWorkouts', () => {
    spyOn(console, 'error');
    workoutService.getAllWorkouts.and.returnValue(throwError(() => new Error('Load failed')));

    component.loadWorkouts();

    expect(console.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should toggle form visibility', () => {
    expect(component.showForm).toBeFalse();
    component.toggleForm();
    expect(component.showForm).toBeTrue();
  });

  it('should add a workout to the beginning of the list on creation', () => {
    const newWorkout: Workout = {
      id: 4,
      name: 'Core Blast',
      date: new Date('2024-04-30'),
      notes: 'Abs & stability'
    };

    component.workouts = [...mockWorkouts];
    component.handleWorkoutCreated(newWorkout);

    expect(component.workouts[0]).toEqual(newWorkout);
    expect(component.showForm).toBeFalse();
  });

  it('should remove a workout on deletion', () => {
    component.workouts = [...mockWorkouts];
    component.handleWorkoutDeleted(2);

    expect(component.workouts.length).toBe(2);
    expect(component.workouts.find(w => w.id === 2)).toBeUndefined();
  });

  it('should return all workouts if no search term is provided', () => {
    component.workouts = [...mockWorkouts];
    component.searchTerm = '';
    expect(component.filteredWorkouts.length).toBe(3);
  });

  it('should filter workouts by name or notes', () => {
    component.workouts = [...mockWorkouts];
    component.searchTerm = 'chest';

    const filtered = component.filteredWorkouts;
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Push Day');
  });

  it('should return an empty list if search term matches nothing', () => {
    component.workouts = [...mockWorkouts];
    component.searchTerm = 'nonexistent';
    expect(component.filteredWorkouts.length).toBe(0);
  });
});
