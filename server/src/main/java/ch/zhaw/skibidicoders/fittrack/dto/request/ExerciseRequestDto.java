package ch.zhaw.skibidicoders.fittrack.dto.request;

import ch.zhaw.skibidicoders.fittrack.model.Exercise;
import ch.zhaw.skibidicoders.fittrack.model.Workout;

/**
 * Data Transfer Object (DTO) for creating or updating an exercise.
 *
 * @param name the name of the exercise
 */
public record ExerciseRequestDto(String name, String notes) {
    /**
     * Converts this DTO to an Exercise entity.
     *
     * @param workout the workout associated with the exercise
     * @return the Exercise entity
     */
    public Exercise toEntity(Workout workout) {
        Exercise exercise = new Exercise();
        exercise.setName(name);
        exercise.setNotes(notes);
        exercise.setWorkout(workout);
        return exercise;
    }
}
