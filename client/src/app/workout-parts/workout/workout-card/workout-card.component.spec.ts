import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WorkoutCardComponent} from './workout-card.component';
import {WorkoutService} from '../../../services/workout.service';
import {of, throwError} from 'rxjs';
import {Workout} from '../../../models/workout.model';
import {ActivatedRoute} from '@angular/router';

describe('WorkoutCardComponent', () => {
  let component: WorkoutCardComponent;
  let fixture: ComponentFixture<WorkoutCardComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;

  const mockWorkout: Workout = {
    id: 1,
    name: 'Leg Day',
    date: new Date('2024-05-01T10:00:00Z'),
    notes: 'Focus on quads and calves'
  };

  beforeEach(async () => {
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', ['deleteWorkout']);

    await TestBed.configureTestingModule({
      imports: [WorkoutCardComponent],
      providers: [
        {provide: WorkoutService, useValue: workoutServiceSpy},
        {provide: ActivatedRoute, useValue: {}}
      ]
    }).compileComponents();

    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
    fixture = TestBed.createComponent(WorkoutCardComponent);
    component = fixture.componentInstance;
    component.workout = mockWorkout;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should format date correctly', () => {
    const formatted = component.formatDate(new Date('2024-05-01T00:00:00'));
    expect(typeof formatted).toBe('string');
    expect(formatted).toMatch(/^\w{2,3}\., \d{2}\. \w{2,} \d{4}$/);
  });

  it('should toggle delete confirmation state', () => {
    expect(component.showDeleteConfirm).toBeFalse();
    component.toggleDeleteConfirm();
    expect(component.showDeleteConfirm).toBeTrue();
    component.toggleDeleteConfirm();
    expect(component.showDeleteConfirm).toBeFalse();
  });

  it('should emit deleted event after successful deletion', () => {
    workoutService.deleteWorkout.and.returnValue(of(undefined));
    spyOn(component.deleted, 'emit');

    component.deleteWorkout();

    expect(workoutService.deleteWorkout).toHaveBeenCalledWith(mockWorkout.id);
    expect(component.deleted.emit).toHaveBeenCalledWith(mockWorkout.id);
    expect(component.isDeleting).toBeFalse();
  });

  it('should handle deletion error and not emit', () => {
    spyOn(console, 'error');
    component.workout = {
      id: 1,
      name: 'Test',
      date: new Date(),
      notes: 'Test workout'
    };

    workoutService.deleteWorkout.and.returnValue(throwError(() => new Error('Delete failed')));
    spyOn(component.deleted, 'emit');

    component.deleteWorkout();

    expect(console.error).toHaveBeenCalled();
    expect(component.deleted.emit).not.toHaveBeenCalled();
    expect(component.isDeleting).toBeFalse();
  });

  it('should not delete if workout has no id', () => {
    component.workout.id = 0;
    component.deleteWorkout();
    expect(workoutService.deleteWorkout).not.toHaveBeenCalled();
  });

  describe('getDaysSinceLastTraining()', () => {
    it('should return "Never trained" if date is undefined', () => {
      expect(component.getDaysSinceLastTraining(undefined)).toBe('Never trained');
    });

    it('should return "Just now" for less than 60 seconds', () => {
      const now = new Date(Date.now() - 120 * 60 * 1000);
      expect(component.getDaysSinceLastTraining(now)).toBe('Just now');
    });

    it('should return "X minutes ago" for recent time', () => {
      const past = new Date(Date.now() - 90 * 60 * 1000); // 5 minutes ago
      const result = component.getDaysSinceLastTraining(past);
      expect(result).toContain('minute');
    });

    it('should return "X hours ago"', () => {
      const past = new Date(Date.now() - 4 * 60 * 60 * 1000); // 2 hours ago
      const result = component.getDaysSinceLastTraining(past);
      expect(result).toContain('hour');
    });

    it('should return "X days ago"', () => {
      const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      const result = component.getDaysSinceLastTraining(past);
      expect(result).toContain('day');
    });

    it('should return "X weeks ago"', () => {
      const past = new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000); // 3 weeks ago
      const result = component.getDaysSinceLastTraining(past);
      expect(result).toContain('week');
    });

    it('should return "months ago" for older dates', () => {
      const past = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000); // 3 months ago
      const result = component.getDaysSinceLastTraining(past);
      expect(result).toBe('months ago');
    });

    it('should return "Unknown" for invalid date input', () => {
      spyOn(console, 'error');
      const result = component.getDaysSinceLastTraining('invalid-date' as any);
      expect(console.error).toHaveBeenCalled();
      expect(result).toBe('Unknown');
    });
  });
});
