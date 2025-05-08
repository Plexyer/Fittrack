import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetListComponent } from './set-list.component';
import { SetService } from '../../../services/set.service';
import { ExerciseSet } from '../../../models/exercise-set.model';
import { of, throwError } from 'rxjs';

describe('SetListComponent', () => {
  let component: SetListComponent;
  let fixture: ComponentFixture<SetListComponent>;
  let setService: jasmine.SpyObj<SetService>;

  const mockSet: ExerciseSet = {
    id: 1,
    exerciseId: 10,
    repetitions: 10,
    weight: 100,
    setNumber: 1,
    notes: 'Initial'
  };

  beforeEach(async () => {
    const setServiceSpy = jasmine.createSpyObj('SetService', ['updateSet', 'deleteSet']);

    await TestBed.configureTestingModule({
      imports: [SetListComponent],
      providers: [{ provide: SetService, useValue: setServiceSpy }]
    }).compileComponents();

    setService = TestBed.inject(SetService) as jasmine.SpyObj<SetService>;
    fixture = TestBed.createComponent(SetListComponent);
    component = fixture.componentInstance;
    component.sets = [mockSet];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start editing a set', () => {
    component.startEdit(mockSet);

    expect(component.editingSetId).toBe(mockSet.id);
    expect(component.editingSet).toEqual(mockSet);
  });

  it('should cancel edit', () => {
    component.editingSetId = 1;
    component.editingSet = { repetitions: 5 };

    component.cancelEdit();

    expect(component.editingSetId).toBeUndefined();
    expect(component.editingSet).toEqual({});
  });

  it('should save a set and emit update event', () => {
    const updatedSet: ExerciseSet = { ...mockSet, repetitions: 12 };
    component.editingSetId = updatedSet.id;
    component.editingSet = { repetitions: 12, weight: 100, setNumber: 1, notes: 'Updated', exerciseId: 10 };

    setService.updateSet.and.returnValue(of(updatedSet));
    spyOn(component.setUpdated, 'emit');

    component.saveSet();

    expect(setService.updateSet).toHaveBeenCalledWith(jasmine.objectContaining({ id: 1, repetitions: 12 }));
    expect(component.setUpdated.emit).toHaveBeenCalledWith(updatedSet);
    expect(component.editingSetId).toBeUndefined();
    expect(component.editingSet).toEqual({});
  });

  it('should handle error when saving a set', () => {
    component.editingSetId = 1;
    component.editingSet = { ...mockSet, repetitions: 15 };

    spyOn(console, 'error');
    setService.updateSet.and.returnValue(throwError(() => new Error('Save failed')));

    component.saveSet();

    expect(console.error).toHaveBeenCalledWith('Error updating set:', jasmine.any(Error));
  });

  it('should delete a set and emit delete event', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    setService.deleteSet.and.returnValue(of(undefined));
    spyOn(component.setDeleted, 'emit');

    component.deleteSet(1);

    expect(setService.deleteSet).toHaveBeenCalledWith(1);
    expect(component.setDeleted.emit).toHaveBeenCalledWith(1);
  });

  it('should not delete set if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteSet(1);

    expect(setService.deleteSet).not.toHaveBeenCalled();
  });

  it('should handle error when deleting a set', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'error');
    setService.deleteSet.and.returnValue(throwError(() => new Error('Delete failed')));

    component.deleteSet(1);

    expect(console.error).toHaveBeenCalledWith('Error deleting set:', jasmine.any(Error));
  });
});
