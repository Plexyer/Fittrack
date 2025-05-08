package ch.zhaw.skibidicoders.fittrack.service;

import ch.zhaw.skibidicoders.fittrack.dto.request.WorkoutRequestDto;
import ch.zhaw.skibidicoders.fittrack.exception.WorkoutNotFoundException;
import ch.zhaw.skibidicoders.fittrack.model.Exercise;
import ch.zhaw.skibidicoders.fittrack.model.Workout;
import ch.zhaw.skibidicoders.fittrack.repository.ExerciseRepository;
import ch.zhaw.skibidicoders.fittrack.repository.WorkoutRepository;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WorkoutServiceTest {

    private final WorkoutRepository workoutRepository = mock(WorkoutRepository.class);
    private final ExerciseRepository exerciseRepository = mock(ExerciseRepository.class);

    private final WorkoutService workoutService = new WorkoutService(workoutRepository, exerciseRepository);

    @Test
    void shouldGetAllWorkouts() {
        Workout workout = new Workout();
        workout.setId(1L);

        when(workoutRepository.findAll()).thenReturn(Collections.singletonList(workout));

        List<Workout> result = workoutService.getAllWorkouts();

        assertEquals(1, result.size());
        assertEquals(1L, result.getFirst().getId());

        verify(workoutRepository).findAll();
    }

    @Test
    void shouldGetWorkoutById() {
        Workout workout = new Workout();
        workout.setId(1L);

        when(workoutRepository.findById(1L)).thenReturn(Optional.of(workout));

        Workout result = workoutService.getWorkoutById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());

        verify(workoutRepository).findById(1L);
    }

    @Test
    void shouldThrowWorkoutNotFoundExceptionWhenGettingNonexistentWorkout() {
        when(workoutRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(WorkoutNotFoundException.class, () -> {
            workoutService.getWorkoutById(2L);
        });

        verify(workoutRepository).findById(2L);
    }

    @Test
    void shouldCreateWorkout() {
        Workout workout = new Workout();
        workout.setId(1L);

        WorkoutRequestDto requestDto = new WorkoutRequestDto("Leg Day", Collections.emptySet(), "notes");

        when(workoutRepository.save(any(Workout.class))).thenReturn(workout);

        Workout result = workoutService.createWorkout(requestDto);

        assertNotNull(result);
        assertEquals(1L, result.getId());

        verify(workoutRepository).save(any(Workout.class));
    }

    @Test
    void shouldUpdateWorkout() {
        Workout updatedWorkout = new Workout();
        updatedWorkout.setId(1L);

        WorkoutRequestDto requestDto = new WorkoutRequestDto("Chest Day Updated", Collections.emptySet(), "notes");

        when(workoutRepository.existsById(1L)).thenReturn(true);
        when(workoutRepository.save(any(Workout.class))).thenReturn(updatedWorkout);

        Workout result = workoutService.updateWorkout(1L, requestDto);

        assertNotNull(result);
        assertEquals(1L, result.getId());

        verify(workoutRepository).existsById(1L);
        verify(workoutRepository).save(any(Workout.class));
    }

    @Test
    void shouldThrowWorkoutNotFoundExceptionWhenUpdatingNonexistentWorkout() {
        WorkoutRequestDto requestDto = new WorkoutRequestDto("Back Day", Collections.emptySet(), "notes");

        when(workoutRepository.existsById(99L)).thenReturn(false);

        assertThrows(WorkoutNotFoundException.class, () -> workoutService.updateWorkout(99L, requestDto));

        verify(workoutRepository).existsById(99L);
    }

    @Test
    void shouldDeleteWorkout() {
        when(workoutRepository.existsById(1L)).thenReturn(true);

        workoutService.deleteWorkout(1L);

        verify(workoutRepository).existsById(1L);
        verify(workoutRepository).deleteById(1L);
    }

    @Test
    void shouldThrowWorkoutNotFoundExceptionWhenDeletingNonexistentWorkout() {
        when(workoutRepository.existsById(88L)).thenReturn(false);

        assertThrows(WorkoutNotFoundException.class, () -> workoutService.deleteWorkout(88L));

        verify(workoutRepository).existsById(88L);
    }

    @Test
    void shouldGetExercisesByWorkoutId() {
        Exercise exercise = new Exercise();
        exercise.setId(1L);

        when(exerciseRepository.findByWorkoutId(1L))
                .thenReturn(Collections.singletonList(exercise));

        List<Exercise> result = workoutService.getExercisesByWorkoutId(1L);

        assertEquals(1, result.size());
        assertEquals(1L, result.getFirst().getId());

        verify(exerciseRepository).findByWorkoutId(1L);
    }

    @Test
    void shouldUpdateLastWorkoutAt() {
        Workout workout = new Workout();
        workout.setId(1L);

        when(workoutRepository.findById(1L)).thenReturn(Optional.of(workout));
        when(workoutRepository.save(any(Workout.class))).thenReturn(workout);

        workoutService.updateLastWorkoutAt(1L);

        assertNotNull(workout.getLastWorkoutAt()); // Check that lastWorkoutAt is set

        verify(workoutRepository).findById(1L);
        verify(workoutRepository).save(workout);
    }
}