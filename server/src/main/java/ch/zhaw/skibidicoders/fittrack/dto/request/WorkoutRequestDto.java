package ch.zhaw.skibidicoders.fittrack.dto.request;

import ch.zhaw.skibidicoders.fittrack.model.Workout;

import java.time.DayOfWeek;
import java.util.Set;

/**
 * DTO for creating a new workout.
 *
 * @param name        the name of the workout
 * @param workoutDays the days of the week the workout is scheduled
 */
public record WorkoutRequestDto(String name, Set<DayOfWeek> workoutDays, String notes) {
    /**
     * Converts this DTO to a Workout entity.
     *
     * @param id the id of the workout
     * @return a Workout entity
     */
    public Workout toEntity(long id) {
        Workout workout = this.toEntity();
        workout.setId(id);
        return workout;
    }

    /**
     * Converts this DTO to a Workout entity.
     *
     * @return a Workout entity
     */
    public Workout toEntity() {
        Workout workout = new Workout();
        workout.setName(name);
        workout.setWorkoutDays(workoutDays);
        workout.setNotes(notes);
        return workout;
    }
}
