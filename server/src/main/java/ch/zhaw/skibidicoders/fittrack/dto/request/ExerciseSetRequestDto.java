package ch.zhaw.skibidicoders.fittrack.dto.request;

import ch.zhaw.skibidicoders.fittrack.model.Exercise;
import ch.zhaw.skibidicoders.fittrack.model.ExerciseSet;

import java.time.LocalDateTime;

/**
 * Data Transfer Object (DTO) for creating or updating an exercise set.
 *
 * @param repetitions the number of repetitions in the set
 * @param weight      the weight used in the set
 */
public record ExerciseSetRequestDto(int repetitions, double weight, String notes) {
    /**
     * Converts this DTO to an ExerciseSet entity.
     *
     * @param exercise  the exercise associated with the set
     * @param createdAt the creation timestamp
     * @return the ExerciseSet entity
     */
    public ExerciseSet toEntity(Exercise exercise, LocalDateTime createdAt) {
        ExerciseSet exerciseSet = this.toEntity(exercise);
        exerciseSet.setCreatedAt(createdAt);
        return exerciseSet;
    }

    /**
     * Converts this DTO to an ExerciseSet entity with the given exercise.
     *
     * @param exercise the exercise associated with the set
     * @return the ExerciseSet entity
     */
    public ExerciseSet toEntity(Exercise exercise) {
        ExerciseSet exerciseSet = this.toEntity();
        exerciseSet.setExercise(exercise);
        return exerciseSet;
    }

    /**
     * Converts this DTO to an ExerciseSet entity.
     *
     * @return the ExerciseSet entity
     */
    public ExerciseSet toEntity() {
        ExerciseSet exerciseSet = new ExerciseSet();
        exerciseSet.setRepetitions(repetitions);
        exerciseSet.setWeight(weight);
        exerciseSet.setNotes(notes);
        return exerciseSet;
    }
}
