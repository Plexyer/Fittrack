package ch.zhaw.skibidicoders.fittrack.repository;

import ch.zhaw.skibidicoders.fittrack.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing workouts.
 */
@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
}
