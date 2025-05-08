package ch.zhaw.skibidicoders.fittrack.dto.response;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.Set;

import ch.zhaw.skibidicoders.fittrack.model.Workout;

/**
 * DTO for returning a workout.
 *
 * @param id            the id of the workout
 * @param name          the name of the workout
 * @param workoutDays   the days of the week the workout is scheduled
 * @param lastWorkoutAt the date and time of the last workout
 */
public record WorkoutResponseDto(
        Long id,
        String name,
        String notes,
        Set<DayOfWeek> workoutDays,
        LocalDateTime lastWorkoutAt) {
    /**
     * Converts a Workout entity to a WorkoutResponseDto.
     *
     * @param workout the workout entity
     * @return a WorkoutResponseDto
     */
    public static WorkoutResponseDto fromEntity(Workout workout) {
        return new WorkoutResponseDto(
                workout.getId(),
                workout.getName(),
                workout.getNotes(),
                workout.getWorkoutDays(),
                workout.getLastWorkoutAt());
    }
}