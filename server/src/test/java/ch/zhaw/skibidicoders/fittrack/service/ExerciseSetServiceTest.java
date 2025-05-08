package ch.zhaw.skibidicoders.fittrack.service;

import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseSetRequestDto;
import ch.zhaw.skibidicoders.fittrack.exception.ExerciseNotFoundException;
import ch.zhaw.skibidicoders.fittrack.exception.ExerciseSetNotFoundException;
import ch.zhaw.skibidicoders.fittrack.model.Exercise;
import ch.zhaw.skibidicoders.fittrack.model.ExerciseSet;
import ch.zhaw.skibidicoders.fittrack.repository.ExerciseRepository;
import ch.zhaw.skibidicoders.fittrack.repository.ExerciseSetRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ExerciseSetServiceTest {

    private final ExerciseSetRepository exerciseSetRepository = mock(ExerciseSetRepository.class);
    private final ExerciseRepository exerciseRepository = mock(ExerciseRepository.class);

    private final ExerciseSetService exerciseSetService = new ExerciseSetService(exerciseSetRepository, exerciseRepository);

    @Test
    void shouldCreateExerciseSet() {
        Exercise exercise = new Exercise();
        exercise.setId(1L);

        ExerciseSet exerciseSet = new ExerciseSet();
        exerciseSet.setId(1L);

        ExerciseSetRequestDto requestDto = new ExerciseSetRequestDto(12, 80.0, "notes");

        when(exerciseRepository.findById(1L)).thenReturn(Optional.of(exercise));
        when(exerciseSetRepository.save(any(ExerciseSet.class))).thenReturn(exerciseSet);

        ExerciseSet result = exerciseSetService.createExerciseSet(1L, requestDto);

        assertNotNull(result);
        assertEquals(1L, result.getId());

        verify(exerciseRepository).findById(1L);
        verify(exerciseSetRepository).save(any(ExerciseSet.class));
    }

    @Test
    void shouldThrowExerciseNotFoundWhenCreatingExerciseSet() {
        when(exerciseRepository.findById(2L)).thenReturn(Optional.empty());

        ExerciseSetRequestDto requestDto = new ExerciseSetRequestDto(10, 60.0, "notes");

        assertThrows(ExerciseNotFoundException.class, () -> exerciseSetService.createExerciseSet(2L, requestDto));

        verify(exerciseRepository).findById(2L);
        verifyNoInteractions(exerciseSetRepository);
    }

    @Test
    void shouldGetExerciseSet() {
        ExerciseSet exerciseSet = new ExerciseSet();
        exerciseSet.setId(1L);

        when(exerciseSetRepository.findById(1L)).thenReturn(Optional.of(exerciseSet));

        ExerciseSet result = exerciseSetService.getExerciseSet(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());

        verify(exerciseSetRepository).findById(1L);
    }

    @Test
    void shouldThrowExerciseNotFoundWhenGettingExerciseSet() {
        when(exerciseSetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ExerciseNotFoundException.class, () -> {
            exerciseSetService.getExerciseSet(99L);
        });

        verify(exerciseSetRepository).findById(99L);
    }

    @Test
    void shouldUpdateExerciseSet() {
        ExerciseSet existingSet = new ExerciseSet();
        existingSet.setId(1L);
        existingSet.setRepetitions(10);
        existingSet.setWeight(60.0);

        ExerciseSetRequestDto updateDto = new ExerciseSetRequestDto(12, 80.0, "notes");

        when(exerciseSetRepository.findById(1L)).thenReturn(Optional.of(existingSet));
        when(exerciseSetRepository.save(existingSet)).thenReturn(existingSet);

        ExerciseSet result = exerciseSetService.updateExerciseSet(1L, updateDto);

        assertEquals(12, result.getRepetitions());
        assertEquals(80.0, result.getWeight());

        verify(exerciseSetRepository).findById(1L);
        verify(exerciseSetRepository).save(existingSet);
    }

    @Test
    void shouldThrowExerciseSetNotFoundWhenUpdatingExerciseSet() {
        when(exerciseSetRepository.findById(5L)).thenReturn(Optional.empty());

        ExerciseSetRequestDto updateDto = new ExerciseSetRequestDto(8, 70.0, "notes");

        assertThrows(ExerciseSetNotFoundException.class, () -> exerciseSetService.updateExerciseSet(5L, updateDto));

        verify(exerciseSetRepository).findById(5L);
    }

    @Test
    void shouldDeleteExerciseSet() {
        when(exerciseSetRepository.existsById(1L)).thenReturn(true);

        exerciseSetService.deleteExerciseSet(1L);

        verify(exerciseSetRepository).existsById(1L);
        verify(exerciseSetRepository).deleteById(1L);
    }

    @Test
    void shouldThrowExerciseSetNotFoundWhenDeletingExerciseSet() {
        when(exerciseSetRepository.existsById(2L)).thenReturn(false);

        assertThrows(ExerciseSetNotFoundException.class, () -> exerciseSetService.deleteExerciseSet(2L));

        verify(exerciseSetRepository).existsById(2L);
        verify(exerciseSetRepository, never()).deleteById(any());
    }
}