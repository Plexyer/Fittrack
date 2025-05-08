package ch.zhaw.skibidicoders.fittrack.dto.response;

import ch.zhaw.skibidicoders.fittrack.model.ExerciseSet;

import java.time.LocalDateTime;

/**
 * DTO for returning an exercise set.
 *
 * @param id          the id of the exercise set
 * @param repetitions the number of repetitions
 * @param weight      the weight lifted
 * @param createdAt   the date and time the exercise set was created
 */
public record ExerciseSetResponseDto(
        Long id,
        Integer repetitions,
        Double weight,
        String notes,
        LocalDateTime createdAt) {
    /**
     * Converts an ExerciseSet entity to an ExerciseSetResponseDto.
     *
     * @param exerciseSet the exercise set entity
     * @return an ExerciseSetResponseDto
     */
    public static ExerciseSetResponseDto fromEntity(ExerciseSet exerciseSet) {
        return new ExerciseSetResponseDto(
                exerciseSet.getId(),
                exerciseSet.getRepetitions(),
                exerciseSet.getWeight(),
                exerciseSet.getNotes(),
                exerciseSet.getCreatedAt());
    }
}