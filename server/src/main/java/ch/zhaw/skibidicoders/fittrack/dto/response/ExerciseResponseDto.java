package ch.zhaw.skibidicoders.fittrack.dto.response;

import ch.zhaw.skibidicoders.fittrack.model.Exercise;

/**
 * DTO for returning an exercise.
 *
 * @param id   the id of the exercise
 * @param name the name of the exercise
 */
public record ExerciseResponseDto(
        Long id,
        String name,
        String notes) {
    /**
     * Converts an Exercise entity to an ExerciseResponseDto.
     *
     * @param exercise the exercise entity
     * @return an ExerciseResponseDto
     */
    public static ExerciseResponseDto fromEntity(Exercise exercise) {
        return new ExerciseResponseDto(
                exercise.getId(),
                exercise.getName(),
                exercise.getNotes());
    }
}