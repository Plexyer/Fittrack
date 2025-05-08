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
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for managing exercises.
 */
@Service
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;
    private final WorkoutRepository workoutRepository;
    private final ExerciseSetRepository exerciseSetRepository;

    /**
     * Constructor for ExerciseService.
     *
     * @param exerciseRepository    the exercise repository
     * @param workoutRepository     the workout repository
     * @param exerciseSetRepository the exercise set repository
     */
    public ExerciseService(ExerciseRepository exerciseRepository, WorkoutRepository workoutRepository, ExerciseSetRepository exerciseSetRepository) {
        this.exerciseRepository = exerciseRepository;
        this.workoutRepository = workoutRepository;
        this.exerciseSetRepository = exerciseSetRepository;
    }

    /**
     * Get a exercise.
     *
     * @param exerciseId the ID of the exercise to select
     * @return the exercise
     */
    public Exercise getExerciseById(long exerciseId) {
        return exerciseRepository.findById(exerciseId)
                .orElseThrow(ExerciseNotFoundException::new);
    }

    /**
     * Create a new exercise.
     *
     * @param workoutId the ID of the workout to which the exercise belongs
     * @param exercise  the exercise data
     * @return the created exercise
     */
    public Exercise createExercise(long workoutId, ExerciseRequestDto exercise) {
        Workout workout = workoutRepository.findById(workoutId).orElseThrow(WorkoutNotFoundException::new);
        return exerciseRepository.save(exercise.toEntity(workout));
    }

    /**
     * Update an existing exercise.
     *
     * @param exerciseId  the ID of the exercise to update
     * @param exerciseDto the new exercise data
     * @return the updated exercise
     */
    public Exercise updateExercise(long exerciseId, ExerciseRequestDto exerciseDto) {
        Exercise existingExercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(ExerciseNotFoundException::new);

        existingExercise.setName(exerciseDto.name());
        existingExercise.setNotes(exerciseDto.notes());

        return exerciseRepository.save(existingExercise);
    }

    /**
     * Delete an exercise given its ID.
     *
     * @param exerciseId the ID of the exercise
     */
    public void deleteExercise(long exerciseId) {
        if (!exerciseRepository.existsById(exerciseId)) {
            throw new ExerciseNotFoundException();
        }

        exerciseRepository.deleteById(exerciseId);
    }

    /**
     * Get an exercise given its ID.
     *
     * @param exerciseId the ID of the exercise
     * @return the exercise
     */
    public List<ExerciseSet> getExerciseSetsByExerciseId(long exerciseId) {
        return exerciseSetRepository.findByExerciseId(exerciseId);
    }
}
