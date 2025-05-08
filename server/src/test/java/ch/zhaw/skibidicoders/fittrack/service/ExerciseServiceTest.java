package ch.zhaw.skibidicoders.fittrack.service;

import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseRequestDto;
import ch.zhaw.skibidicoders.fittrack.exception.ExerciseNotFoundException;
import ch.zhaw.skibidicoders.fittrack.exception.WorkoutNotFoundException;
import ch.zhaw.skibidicoders.fittrack.model.Exercise;
import ch.zhaw.skibidicoders.fittrack.model.ExerciseSet;
import ch.zhaw.skibidicoders.fittrack.model.Workout;
import ch.zhaw.skibidicoders.fittrack.repository.ExerciseRepository;
import ch.zhaw.skibidicoders.fittrack.repository.ExerciseSetRepository;
import ch.zhaw.skibidicoders.fittrack.repository.WorkoutRepository;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ExerciseServiceTest {

    private final ExerciseRepository exerciseRepository = mock(ExerciseRepository.class);
    private final WorkoutRepository workoutRepository = mock(WorkoutRepository.class);
    private final ExerciseSetRepository exerciseSetRepository = mock(ExerciseSetRepository.class);

    private final ExerciseService exerciseService = new ExerciseService(exerciseRepository, workoutRepository, exerciseSetRepository);

    @Test
    void shouldCreateExercise() {
        Workout workout = new Workout();
        workout.setId(1L);

        ExerciseRequestDto requestDto = new ExerciseRequestDto("Bench Press", "notes");

        Exercise savedExercise = new Exercise();
        savedExercise.setId(1L);

        when(workoutRepository.findById(1L)).thenReturn(Optional.of(workout));
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(savedExercise);

        Exercise result = exerciseService.createExercise(1L, requestDto);

        assertNotNull(result);
        assertEquals(1L, result.getId());

        verify(workoutRepository).findById(1L);
        verify(exerciseRepository).save(any(Exercise.class));
    }

    @Test
    void shouldThrowWorkoutNotFoundExceptionWhenCreatingExerciseWithInvalidWorkoutId() {
        when(workoutRepository.findById(99L)).thenReturn(Optional.empty());

        ExerciseRequestDto requestDto = new ExerciseRequestDto("Squat", "notes");

        assertThrows(WorkoutNotFoundException.class, () -> {
            exerciseService.createExercise(99L, requestDto);
        });

        verify(workoutRepository).findById(99L);
        verifyNoInteractions(exerciseRepository);
    }

    @Test
    void shouldUpdateExercise() {
        Exercise existingExercise = new Exercise();
        existingExercise.setId(1L);
        existingExercise.setName("Old Name");

        ExerciseRequestDto requestDto = new ExerciseRequestDto("New Name", "notes");

        when(exerciseRepository.findById(1L)).thenReturn(Optional.of(existingExercise));
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(existingExercise);

        Exercise result = exerciseService.updateExercise(1L, requestDto);

        assertNotNull(result);
        assertEquals("New Name", result.getName());

        verify(exerciseRepository).findById(1L);
        verify(exerciseRepository).save(existingExercise);
    }

    @Test
    void shouldThrowExerciseNotFoundExceptionWhenUpdatingInvalidExercise() {
        when(exerciseRepository.findById(2L)).thenReturn(Optional.empty());

        ExerciseRequestDto requestDto = new ExerciseRequestDto("Deadlift", "notes");

        assertThrows(ExerciseNotFoundException.class, () -> exerciseService.updateExercise(2L, requestDto));

        verify(exerciseRepository).findById(2L);
        verify(exerciseRepository, never()).save(any());
    }

    @Test
    void shouldDeleteExercise() {
        when(exerciseRepository.existsById(1L)).thenReturn(true);

        exerciseService.deleteExercise(1L);

        verify(exerciseRepository).existsById(1L);
        verify(exerciseRepository).deleteById(1L);
    }

    @Test
    void shouldThrowExerciseNotFoundExceptionWhenDeletingInvalidExercise() {
        when(exerciseRepository.existsById(3L)).thenReturn(false);

        assertThrows(ExerciseNotFoundException.class, () -> {
            exerciseService.deleteExercise(3L);
        });

        verify(exerciseRepository).existsById(3L);
        verify(exerciseRepository, never()).deleteById(any());
    }

    @Test
    void shouldGetExerciseSetsByExerciseId() {
        ExerciseSet set = new ExerciseSet();
        set.setId(1L);

        when(exerciseSetRepository.findByExerciseId(1L))
                .thenReturn(Collections.singletonList(set));

        List<ExerciseSet> result = exerciseService.getExerciseSetsByExerciseId(1L);

        assertEquals(1, result.size());
        assertEquals(1L, result.getFirst().getId());

        verify(exerciseSetRepository).findByExerciseId(1L);
    }
}