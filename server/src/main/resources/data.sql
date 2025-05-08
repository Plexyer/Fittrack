-- Workouts
INSERT INTO workout (name, last_workout_at)
VALUES ('Leg Day', '2025-03-28 00:00:00');

INSERT INTO workout (name, last_workout_at)
VALUES ('Chest Day', '2025-03-27 00:00:00');

INSERT INTO workout (name, last_workout_at)
VALUES ('Back Day', '2025-03-26 00:00:00');

INSERT INTO workout (name, last_workout_at)
VALUES ('Arms & Shoulders', '2025-03-25 00:00:00');

-- Workout Days
INSERT INTO workout_workout_days (workout_id, workout_days)
VALUES (1, 0),
       (1, 2),
       (1, 4);

INSERT INTO workout_workout_days (workout_id, workout_days)
VALUES (2, 1),
       (2, 3);

INSERT INTO workout_workout_days (workout_id, workout_days)
VALUES (3, 2),
       (3, 5);

INSERT INTO workout_workout_days (workout_id, workout_days)
VALUES (4, 1),
       (4, 4);

-- Exercises
INSERT INTO exercise (name, workout_id)
VALUES ('Squat', 1),
       ('Leg Press', 1),
       ('Deadlift', 1),
       ('Bench Press', 2),
       ('Incline Press', 2),
       ('Dips', 2),
       ('Pull-ups', 3),
       ('Barbell Row', 3),
       ('Lateral Raise', 4),
       ('Bicep Curl', 4);

-- Exercise Sets
INSERT INTO exercise_set (repetitions, weight, created_at, exercise_id)
VALUES (8, 100.0, '2025-03-30 00:00:00', 1),
       (10, 90.0, '2025-03-30 00:00:00', 1),
       (12, 150.0, '2025-03-30 00:00:00', 2),
       (10, 80.0, '2025-03-30 00:00:00', 4),
       (12, 70.0, '2025-03-30 00:00:00', 4),
       (8, 120.0, '2025-03-30 00:00:00', 3),
       (15, 15.0, '2025-03-30 00:00:00', 9),
       (12, 20.0, '2025-03-30 00:00:00', 10);