package ch.zhaw.skibidicoders.fittrack.service;

import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseSetRequestDto;
import ch.zhaw.skibidicoders.fittrack.exception.ExerciseNotFoundException;
import ch.zhaw.skibidicoders.fittrack.exception.ExerciseSetNotFoundException;
import ch.zhaw.skibidicoders.fittrack.model.Exercise;
import ch.zhaw.skibidicoders.fittrack.model.ExerciseSet;
import ch.zhaw.skibidicoders.fittrack.repository.ExerciseRepository;
import ch.zhaw.skibidicoders.fittrack.repository.ExerciseSetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service class for managing exercise sets.
 */
@Service
public class ExerciseSetService {
    private final ExerciseSetRepository exerciseSetRepository;
    private final ExerciseRepository exerciseRepository;

    /**
     * Constructor for ExerciseSetService.
     *
     * @param exerciseSetRepository the exercise set repository
     * @param exerciseRepository    the exercise repository
     */
    public ExerciseSetService(ExerciseSetRepository exerciseSetRepository, ExerciseRepository exerciseRepository) {
        this.exerciseSetRepository = exerciseSetRepository;
        this.exerciseRepository = exerciseRepository;
    }

    /**
     * Creates a new exercise set.
     *
     * @param exerciseId     the ID of the exercise to which the set belongs
     * @param exerciseSetDto the exercise set data
     * @return the created exercise set
     */
    public ExerciseSet createExerciseSet(long exerciseId, ExerciseSetRequestDto exerciseSetDto) {
        Exercise exercise = exerciseRepository.findById(exerciseId).orElseThrow(ExerciseNotFoundException::new);

        return exerciseSetRepository.save(exerciseSetDto.toEntity(exercise, LocalDateTime.now()));
    }

    /**
     * Retrieves all exercise sets for a given exercise.
     *
     * @param exerciseId the ID of the exercise
     * @return a list of exercise sets
     */
    public ExerciseSet getExerciseSet(long exerciseId) {
        return exerciseSetRepository.findById(exerciseId).orElseThrow(ExerciseNotFoundException::new);
    }

    /**
     * Updates an existing exercise set.
     *
     * @param exerciseSetId  the ID of the exercise set to update
     * @param exerciseSetDto the new exercise set data
     * @return the updated exercise set
     */
    public ExerciseSet updateExerciseSet(long exerciseSetId, ExerciseSetRequestDto exerciseSetDto) {
        ExerciseSet existingSet = exerciseSetRepository.findById(exerciseSetId)
                .orElseThrow(ExerciseSetNotFoundException::new);

        existingSet.setRepetitions(exerciseSetDto.repetitions());
        existingSet.setWeight(exerciseSetDto.weight());
        existingSet.setNotes(exerciseSetDto.notes());

        return exerciseSetRepository.save(existingSet);
    }

    /**
     * Deletes an exercise set given its ID.
     *
     * @param exerciseSetId the ID of the exercise setw
     */
    public void deleteExerciseSet(long exerciseSetId) {
        if (!exerciseSetRepository.existsById(exerciseSetId)) {
            throw new ExerciseSetNotFoundException();
        }

        exerciseSetRepository.deleteById(exerciseSetId);
    }
}
