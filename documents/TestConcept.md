# Testing Concept

Our team employs an automated testing strategy to ensure the quality, stability, and maintainability of both backend and frontend components.

### Backend Testing

The backend is developed using **Spring Boot** and **Java**. We use **JUnit** for writing unit and integration tests, 
allowing us to validate individual business logic components as well as the interactions between system layers. 
These tests are integrated into our CI pipeline to ensure continuous verification of functionality and early detection of regressions.

### Frontend Testing

The frontend is built with **Angular**, and we use **Jasmine** and **Karma** to create and run unit and component tests. 
This setup ensures that our UI behaves as expected across changes and supports rapid, test-driven development.

### Goal

By maintaining a consistent automated testing approach across the stack, we aim to deliver high-quality software, reduce bugs, and enable safe, continuous deployment.
The test concept is structured as follows:

- ID
    - So that each test has a unique identifier.
- Description
    - The description clarifies exactly what is being tested.
- Method
    - Appears usually twice.
    - Once the test should be executed with valid input and once with invalid input.
- Result Output(s)
    - Here, the expected outputs are defined.
- Works
    - An ✅ indicates that the test works.
    - An ❌ indicates that the test fails. 

## Info:

Note that each test is independent of the others.
If a test has "(False expected)" in the description, it means that the test should return correct values,
but we test it with incorrect values.
This ensures that the method truly functions correctly.


## Note

The unit tests that test with invalid values are written for all boundary values.
This means that several unit tests for invalid values are written in order to achieve high cohesion in testing.
In this testing concept, these tests are noted as a single unit test.

***

## Unit Tests

The main goal of the unit tests is to develop automated test cases for all functions
of our application. This ensures reliable assurance that our application is functioning correctly at every moment. Positive tests with
valid parameters ("Happy Cases") as well as at least one test case for invalid parameters have been implemented for
each method to ensure that even erroneous inputs are handled appropriately. Through this systematic approach, we
achieve a comprehensive verification of the functionalities within the project.<br>
The unit tests follow the Triple-A principle (Arrange, Act, Assert). First, the respective method is called with the
appropriate parameters, then the result is stored, and finally, the achieved result is compared to the expected outcome.<br>

# GlobalExceptionHandler

|  ID  | Group | Description                                                    | Method                                  | Result Output(s)                             | Works |
|:----:|:-----:|----------------------------------------------------------------|-----------------------------------------|----------------------------------------------|:-----:|
|  01  |  01   | Request triggers `WorkoutNotFoundException`, returns 404      | GET `/test/workout`                     | HTTP 404, JSON: "Workout not found"          |   ✅   |
|  02  |  01   | Request triggers `ExerciseNotFoundException`, returns 404     | GET `/test/exercise`                    | HTTP 404, JSON: "Exercise not found"         |   ✅   |
|  03  |  01   | Request triggers `ExerciseSetNotFoundException`, returns 404  | GET `/test/exercise-set`                | HTTP 404, JSON: "Exercise Set not found"     |   ✅   |                                                                    | move()  | (10, 10)                                                         |    ✅    |

# ExerciseController

|  ID  | Group | Description                                                              | Method                              | Result Output(s)                              | Works |
|:----:|:-----:|---------------------------------------------------------------------------|-------------------------------------|------------------------------------------------|:-----:|
|  01  |  01   | Update existing exercise with new name                                    | PUT `/api/exercises/1`              | HTTP 201, JSON: id=1, name="Chest Press"       |   ✅   |
|  02  |  01   | Update non-existing exercise                                              | PUT `/api/exercises/2`              | HTTP 404                                       |   ✅   |
|  03  |  02   | Delete existing exercise                                                  | DELETE `/api/exercises/1`           | HTTP 204 (No Content)                          |   ✅   |
|  04  |  02   | Delete non-existing exercise                                              | DELETE `/api/exercises/2`           | HTTP 404                                       |   ✅   |
|  05  |  03   | Retrieve exercise set list for existing exercise                          | GET `/api/exercises/1/sets`         | HTTP 200, JSON array with one set (id=1)       |   ✅   |
|  06  |  03   | Retrieve exercise set list for non-existing exercise                      | GET `/api/exercises/2/sets`         | HTTP 404                                       |   ✅   |
|  07  |  04   | Create a new exercise set for an existing exercise                        | POST `/api/exercises/1/sets`        | HTTP 201, JSON: id=1                           |   ✅   |
|  08  |  04   | Create a new exercise set for a non-existing exercise                     | POST `/api/exercises/99/sets`       | HTTP 404                                       |   ✅   |

# ExerciseSetController

|  ID  | Group | Description                                                             | Method                     | Result Output(s)                              | Works |
|:----:|:-----:|--------------------------------------------------------------------------|----------------------------|------------------------------------------------|:-----:|
|  01  |  01   | Retrieve existing exercise set by ID                                     | GET `/api/sets/1`          | HTTP 201, JSON: id=1                           |   ✅   |
|  02  |  01   | Retrieve non-existing exercise set by ID                                 | GET `/api/sets/2`          | HTTP 404                                       |   ✅   |
|  03  |  02   | Update existing exercise set                                             | PUT `/api/sets/1`          | HTTP 201, JSON: id=1, reps=12, weight=80       |   ✅   |
|  04  |  02   | Update non-existing exercise set                                         | PUT `/api/sets/2`          | HTTP 404                                       |   ✅   |
|  05  |  03   | Delete existing exercise set                                             | DELETE `/api/sets/1`       | HTTP 204 (No Content)                          |   ✅   |
|  06  |  03   | Delete non-existing exercise set                                         | DELETE `/api/sets/2`       | HTTP 404                                       |   ✅   |

# WorkoutController

|  ID  | Group | Description                                                          | Method                              | Result Output(s)                                           | Works |
|:----:|:-----:|-----------------------------------------------------------------------|-------------------------------------|------------------------------------------------------------|:-----:|
|  01  |  01   | Retrieve all workouts                                                | GET `/api/workouts`                | HTTP 200, JSON array with workout id=1                     |   ✅   |
|  02  |  01   | Retrieve workout by ID                                               | GET `/api/workouts/1`              | HTTP 200, JSON: id=1                                       |   ✅   |
|  03  |  02   | Create new workout                                                   | POST `/api/workouts`               | HTTP 201, JSON: id=1                                       |   ✅   |
|  04  |  02   | Update existing workout                                              | PUT `/api/workouts/1`              | HTTP 201, JSON: updated name and workoutDays               |   ✅   |
|  05  |  03   | Delete existing workout                                              | DELETE `/api/workouts/1`           | HTTP 204 (No Content)                                      |   ✅   |
|  06  |  03   | Delete non-existing workout                                          | DELETE `/api/workouts/2`           | HTTP 404                                                   |   ✅   |
|  07  |  04   | Update last workout timestamp                                        | PATCH `/api/workouts/1`            | HTTP 204 (No Content)                                      |   ✅   |
|  08  |  05   | Retrieve exercises associated with a workout                         | GET `/api/workouts/1/exercises`    | HTTP 200, JSON array with exercise id=1                    |   ✅   |
|  09  |  05   | Add new exercise to workout                                          | POST `/api/workouts/1/exercises`   | HTTP 201, JSON: id=1                                       |   ✅   |

# ExerciseService

|  ID  | Group | Description                                                                 | Method Call                                      | Result Output(s)                              | Works |
|:----:|:-----:|------------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------------|:-----:|
|  01  |  01   | Create a new exercise with valid workout ID                                  | `createExercise(1L, dto)`                        | Returns Exercise (id=1)                        |   ✅   |
|  02  |  01   | Fail to create exercise with invalid workout ID                              | `createExercise(99L, dto)`                       | Throws `WorkoutNotFoundException`              |   ✅   |
|  03  |  02   | Update existing exercise with new data                                       | `updateExercise(1L, dto)`                        | Exercise name updated                          |   ✅   |
|  04  |  02   | Fail to update non-existing exercise                                         | `updateExercise(2L, dto)`                        | Throws `ExerciseNotFoundException`             |   ✅   |
|  05  |  03   | Delete existing exercise by ID                                               | `deleteExercise(1L)`                             | Exercise deleted                               |   ✅   |
|  06  |  03   | Fail to delete non-existing exercise                                         | `deleteExercise(3L)`                             | Throws `ExerciseNotFoundException`             |   ✅   |
|  07  |  04   | Retrieve exercise sets by valid exercise ID                                  | `getExerciseSetsByExerciseId(1L)`               | Returns list with one ExerciseSet (id=1)       |   ✅   |

# ExerciseSetService

|  ID  | Group | Description                                                                     | Method Call                                         | Result Output(s)                                | Works |
|:----:|:-----:|----------------------------------------------------------------------------------|-----------------------------------------------------|--------------------------------------------------|:-----:|
|  01  |  01   | Create exercise set for valid exercise                                           | `createExerciseSet(1L, dto)`                        | Returns ExerciseSet (id=1)                       |   ✅   |
|  02  |  01   | Fail to create exercise set for non-existent exercise                           | `createExerciseSet(2L, dto)`                        | Throws `ExerciseNotFoundException`               |   ✅   |
|  03  |  02   | Retrieve existing exercise set by ID                                             | `getExerciseSet(1L)`                                | Returns ExerciseSet (id=1)                       |   ✅   |
|  04  |  02   | Fail to retrieve non-existent exercise set                                       | `getExerciseSet(99L)`                               | Throws `ExerciseNotFoundException`               |   ✅   |
|  05  |  03   | Update existing exercise set                                                     | `updateExerciseSet(1L, dto)`                        | Updates to repetitions=12, weight=80.0           |   ✅   |
|  06  |  03   | Fail to update non-existent exercise set                                         | `updateExerciseSet(5L, dto)`                        | Throws `ExerciseSetNotFoundException`            |   ✅   |
|  07  |  04   | Delete existing exercise set                                                     | `deleteExerciseSet(1L)`                             | ExerciseSet deleted                              |   ✅   |
|  08  |  04   | Fail to delete non-existent exercise set                                         | `deleteExerciseSet(2L)`                             | Throws `ExerciseSetNotFoundException`            |   ✅   |

# WorkoutService

|  ID  | Group | Description                                                                 | Method Call                                      | Result Output(s)                                | Works |
|:----:|:-----:|------------------------------------------------------------------------------|--------------------------------------------------|--------------------------------------------------|:-----:|
|  01  |  01   | Retrieve all workouts                                                        | `getAllWorkouts()`                               | Returns list with one Workout (id=1)             |   ✅   |
|  02  |  01   | Retrieve workout by ID                                                       | `getWorkoutById(1L)`                             | Returns Workout (id=1)                           |   ✅   |
|  03  |  01   | Fail to retrieve non-existing workout                                        | `getWorkoutById(2L)`                             | Throws `WorkoutNotFoundException`                |   ✅   |
|  04  |  02   | Create new workout                                                           | `createWorkout(dto)`                             | Returns Workout (id=1)                           |   ✅   |
|  05  |  02   | Update existing workout                                                      | `updateWorkout(1L, dto)`                         | Returns updated Workout (id=1)                   |   ✅   |
|  06  |  02   | Fail to update non-existing workout                                          | `updateWorkout(99L, dto)`                        | Throws `WorkoutNotFoundException`                |   ✅   |
|  07  |  03   | Delete existing workout                                                      | `deleteWorkout(1L)`                              | Workout deleted                                  |   ✅   |
|  08  |  03   | Fail to delete non-existing workout                                          | `deleteWorkout(88L)`                             | Throws `WorkoutNotFoundException`                |   ✅   |
|  09  |  04   | Retrieve exercises linked to a workout                                       | `getExercisesByWorkoutId(1L)`                    | Returns list with Exercise (id=1)                |   ✅   |
|  10  |  05   | Update timestamp of last workout                                             | `updateLastWorkoutAt(1L)`                        | Sets `lastWorkoutAt` and saves                   |   ✅   |

# FitTrackApplication

This test was generate automatically but still is needed.

|  ID  | Group | Description                           | Method Call        | Result Output(s)                  | Works |
|:----:|:-----:|----------------------------------------|--------------------|-----------------------------------|:-----:|
|  01  |  01   | Ensure Spring Boot application context loads | `contextLoads()`   | Application context initialized   |   ✅   |

## Frontend Unit Tests (Jasmine & Karma)

The primary goal of our frontend unit tests is to verify the correct behavior of Angular components, services, and other UI-related logic in isolation. 
We use **Jasmine** for writing test specifications and **Karma** as the test runner to execute them in a browser environment.

Each component or service is tested using both **positive scenarios** (valid inputs and expected behavior) and **negative scenarios** (invalid inputs or edge cases) 
to ensure robustness and resilience of the user interface. This helps us catch regressions early and ensures that each part of the frontend functions correctly as the application evolves.

Like the Unit Test in the backend, our tests also follow the Triple-A pattern in the frontend. 

# DashboardComponent

|  ID  | Group | Description                                                                     | Test Case                                      | Result Output(s)                                             | Works |
|:----:|:-----:|----------------------------------------------------------------------------------|------------------------------------------------|--------------------------------------------------------------|:-----:|
|  01  |  01   | Component initializes correctly                                                  | `should create the DashboardComponent`         | Component instance is truthy                                 |   ✅   |
|  02  |  01   | Calls `loadDashboardData()` on initialization                                    | `should call loadDashboardData on ngOnInit`    | Method `loadDashboardData()` is called                       |   ✅   |
|  03  |  02   | Loads workouts and calculates stats correctly                                    | `should load recent workouts and calculate stats on successful load` | Stats: 2 workouts, 4 exercises, 8 sets         |   ✅   |
|  04  |  02   | Sets error state on failed workout loading                                       | `should set error on failed load of workouts`  | `error` set, `isLoading` is false                            |   ✅   |
|  05  |  03   | Calculates average workouts per week                                             | `should calculate average workouts per week correctly` | Average: 2 workouts/week                              |   ✅   |
|  06  |  03   | Handles empty workout list in stats calculation                                  | `should handle empty workout list correctly in stats calculation` | Stats: 0 workouts, 0 average/week            |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Component initialization                                       |
|  02   | Data loading and error handling                                |
|  03   | Statistics and calculations                                    |


# HomeComponent

|  ID  | Group | Description                                                                | Test Case                                           | Result Output(s)                                        | Works |
|:----:|:-----:|-----------------------------------------------------------------------------|-----------------------------------------------------|----------------------------------------------------------|:-----:|
|  01  |  01   | Component is created successfully                                           | `should create`                                     | Component instance is truthy                            |   ✅   |
|  02  |  01   | Calls `loadRecentWorkouts` on initialization                               | `should call loadRecentWorkouts on ngOnInit`        | Method is called                                         |   ✅   |
|  03  |  02   | Loads recent workouts and sets suggestion                                   | `should set recentWorkouts and upcomingWorkoutSuggestion on successful load` | Workouts loaded, suggestion set, isLoading = false |   ✅   |
|  04  |  02   | Sets error message on load failure                                          | `should set error on failed workout load`           | Error message and `isLoading` = false                    |   ✅   |
|  05  |  03   | Navigates to workout detail on startWorkout                                 | `should navigate to workout on startWorkout`        | Router `navigate()` called with correct params           |   ✅   |
|  06  |  04   | Returns "Never trained" if no date is provided                              | `should return "Never trained" if date is undefined`| Output: "Never trained"                                  |   ✅   |
|  07  |  04   | Returns "Just now" for very recent workout                                  | `should return "Just now" if difference is less than 1 minute` | Output contains "Just now"                    |   ✅   |
|  08  |  04   | Calculates "minutes ago" correctly                                          | `should calculate minutes ago correctly`            | Output contains "minute"                                 |   ✅   |
|  09  |  04   | Calculates "hours ago" correctly                                            | `should calculate hours ago correctly`              | Output contains "hour"                                   |   ✅   |
|  10  |  04   | Calculates "days ago" correctly                                             | `should calculate days ago correctly`               | Output contains "day"                                    |   ✅   |
|  11  |  04   | Calculates "weeks ago" correctly                                            | `should calculate weeks ago correctly`              | Output contains "week"                                   |   ✅   |
|  12  |  04   | Returns "months ago" for very old workouts                                  | `should return "months ago" if date is very old`    | Output: "months ago"                                     |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Component initialization                                       |
|  02   | Data loading and error handling                                |
|  03   | Navigation behavior                                            |
|  04   | Time formatting logic                                          |

# NavbarComponent

|  ID  | Group | Description                                                              | Test Case                                            | Result Output(s)                      | Works |
|:----:|:-----:|---------------------------------------------------------------------------|------------------------------------------------------|----------------------------------------|:-----:|
|  01  |  01   | Component initializes correctly                                           | `should create the NavbarComponent`                 | Component instance is truthy          |   ✅   |
|  02  |  02   | Toggles menu open and close                                               | `should toggle menu open/close`                     | `isMenuOpen` toggles true → false     |   ✅   |
|  03  |  02   | Closes menu explicitly                                                    | `should close menu`                                 | `isMenuOpen` set to false             |   ✅   |
|  04  |  03   | Sets `isScrolled` to true when scrolled down                              | `should update isScrolled to true when scrolled down` | `isScrolled` becomes true           |   ✅   |
|  05  |  03   | Sets `isScrolled` to false when scrolled up                               | `should update isScrolled to false when scrolled back up` | `isScrolled` becomes false     |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Component initialization                                       |
|  02   | Menu toggle logic                                              |
|  03   | Scroll behavior handling                                       |

# ProgressChartComponent

|  ID  | Group | Description                                                              | Test Case                                                   | Result Output(s)                                 | Works |
|:----:|:-----:|---------------------------------------------------------------------------|-------------------------------------------------------------|--------------------------------------------------|:-----:|
|  01  |  01   | Component is created successfully                                         | `should create`                                             | Component instance is truthy                     |   ✅   |
|  02  |  02   | Loads workout frequency chart data on init                                | `should load workout frequency chart on init`               | Chart data loaded, `noDataAvailable` = false     |   ✅   |
|  03  |  02   | Handles case where all chart values are zero                              | `should show no data if all values are zero`                | `noDataAvailable` = true                         |   ✅   |
|  04  |  03   | Handles chart type change and loads correct data                          | `should handle chart type change`                           | Chart type updated, correct service method called|   ✅   |
|  05  |  04   | Handles service error during data loading gracefully                      | `should handle service error gracefully`                    | `noDataAvailable` = true, error logged           |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Component initialization                                       |
|  02   | Data loading and chart rendering                               |
|  03   | Chart interaction (type change)                                |
|  04   | Error handling                                                 |


# ChartService

|  ID  | Group | Description                                                                  | Test Case                                                        | Result Output(s)                                      | Works |
|:----:|:-----:|-------------------------------------------------------------------------------|------------------------------------------------------------------|--------------------------------------------------------|:-----:|
|  01  |  01   | Service is instantiated correctly                                             | `should be created`                                              | Service instance is truthy                             |   ✅   |
|  02  |  02   | Returns correct chart data when workouts are available                        | `should return actual chart data when workouts are present`      | Chart data length > 0, values defined                  |   ✅   |
|  03  |  02   | Returns fallback chart data when no workouts exist                            | `should return sample chart data when no workouts exist`         | Default values returned (length = 2)                   |   ✅   |
|  04  |  03   | Builds exercise progress chart for specified exercise                         | `should build progress chart for specified exercises`            | One dataset, correct label                             |   ✅   |
|  05  |  03   | Falls back to top exercises if none are provided                              | `should fallback to top exercises if none are specified`         | At least one dataset in result                         |   ✅   |
|  06  |  04   | Calculates total volume data weekly                                            | `should calculate weekly volume correctly`                       | Chart data with non-negative volume values             |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Service initialization                                         |
|  02   | Workout frequency data logic                                   |
|  03   | Exercise progress tracking                                     |
|  04   | Volume tracking                                                |

# ExerciseService (Frontend)

|  ID  | Group | Description                                                             | Test Case                                        | Result Output(s)                              | Works |
|:----:|:-----:|--------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------------|:-----:|
|  01  |  01   | Updates an exercise successfully                                         | `should update an exercise`                      | HTTP PUT to `/api/exercises/1`, returns object |   ✅   |
|  02  |  01   | Deletes an exercise                                                      | `should delete an exercise`                      | HTTP DELETE to `/api/exercises/1`, returns null|   ✅   |
|  03  |  02   | Fetches sets for a specific exercise                                     | `should fetch exercise sets for a specific exercise` | HTTP GET to `/api/exercises/1/sets`, returns list | ✅ |
|  04  |  02   | Adds a new set to an exercise                                            | `should add a new set to an exercise`            | HTTP POST to `/api/exercises/1/sets`, returns set | ✅  |
|  05  |  03   | Handles error on exercise update                                         | `should handle error when updating exercise`     | HTTP 500 error handled correctly               |   ✅   |
|  06  |  03   | Handles error on exercise delete                                         | `should handle error when deleting exercise`     | HTTP 500 error handled correctly               |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Exercise update and delete                                     |
|  02   | Exercise set management                                        |
|  03   | Error handling for API failure                                 |

# SetService (Frontend)

|  ID  | Group | Description                                                                | Test Case                                           | Result Output(s)                                 | Works |
|:----:|:-----:|-----------------------------------------------------------------------------|-----------------------------------------------------|--------------------------------------------------|:-----:|
|  01  |  01   | Retrieves an exercise set by ID                                             | `should get an exercise set by id`                 | HTTP GET to `/api/sets/1`, returns ExerciseSet   |   ✅   |
|  02  |  02   | Updates an exercise set successfully                                        | `should update an exercise set`                    | HTTP PUT to `/api/sets/1`, returns updated set   |   ✅   |
|  03  |  03   | Handles error when updating an exercise set                                 | `should handle error when updating an exercise set`| HTTP 500 error handled correctly                 |   ✅   |
|  04  |  02   | Deletes an exercise set successfully                                        | `should delete an exercise set`                    | HTTP DELETE to `/api/sets/1`, returns null       |   ✅   |
|  05  |  03   | Handles error when deleting an exercise set                                 | `should handle error when deleting an exercise set`| HTTP 500 error handled correctly                 |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Data retrieval                                                 |
|  02   | Update and delete operations                                   |
|  03   | Error handling                                                 |

# WorkoutService (Frontend)

|  ID  | Group | Description                                                             | Test Case                                              | Result Output(s)                                 | Works |
|:----:|:-----:|--------------------------------------------------------------------------|--------------------------------------------------------|--------------------------------------------------|:-----:|
|  01  |  01   | Retrieves all workouts                                                   | `should get all workouts`                              | HTTP GET to `/api/workouts`, returns list        |   ✅   |
|  02  |  01   | Retrieves a workout by ID                                                | `should get a workout by id`                           | HTTP GET to `/api/workouts/1`, returns workout   |   ✅   |
|  03  |  02   | Creates a new workout                                                    | `should create a workout`                              | HTTP POST to `/api/workouts`, returns workout    |   ✅   |
|  04  |  02   | Updates an existing workout                                              | `should update a workout`                              | HTTP PUT to `/api/workouts/1`, returns updated   |   ✅   |
|  05  |  03   | Deletes a workout by ID                                                  | `should delete a workout`                              | HTTP DELETE to `/api/workouts/1`, returns null   |   ✅   |
|  06  |  04   | Retrieves exercises linked to a workout                                  | `should get exercises for a workout`                   | HTTP GET to `/api/workouts/1/exercises`          |   ✅   |
|  07  |  04   | Adds a new exercise to a workout                                         | `should add an exercise to a workout`                  | HTTP POST to `/api/workouts/1/exercises`         |   ✅   |
|  08  |  05   | Updates the last performed timestamp for a workout                      | `should update the last performed workout`             | HTTP PATCH to `/api/workouts/1`, returns updated |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Data retrieval                                                 |
|  02   | Workout creation and update                                    |
|  03   | Workout deletion                                               |
|  04   | Workout–exercise interaction                                   |
|  05   | Last activity tracking                                         |


# ExerciseCardComponent

|  ID  | Group | Description                                                           | Test Case                                             | Result Output(s)                                        | Works |
|:----:|:-----:|------------------------------------------------------------------------|-------------------------------------------------------|----------------------------------------------------------|:-----:|
|  01  |  01   | Component initializes successfully                                     | `should create the component`                         | Component instance is truthy                             |   ✅   |
|  02  |  02   | Toggles expansion and loads sets                                       | `should toggle expand and load sets`                  | `isExpanded` toggled, sets loaded via service            |   ✅   |
|  03  |  02   | Toggles edit mode                                                      | `should toggle edit mode`                             | `isEditing` toggled true → false                         |   ✅   |
|  04  |  03   | Saves edited exercise                                                  | `should save the exercise`                            | Exercise updated, `isEditing` is false                   |   ✅   |
|  05  |  03   | Deletes the exercise with confirmation                                 | `should delete the exercise`                          | Delete service called, emits deletion                    |   ✅   |
|  06  |  04   | Toggles visibility of set form                                         | `should show and hide set form when toggled`          | `showSetForm` toggled true → false                       |   ✅   |
|  07  |  05   | Adds a new set to the list                                             | `should handle set added`                             | Set added to internal list                               |   ✅   |
|  08  |  05   | Deletes a set from the list                                            | `should handle set deleted`                           | Set with matching ID removed                             |   ✅   |
|  09  |  05   | Updates an existing set                                                | `should handle set updated`                           | Set with matching ID updated                             |   ✅   |
|  10  |  06   | Navigates to exercise detail view                                      | `should navigate to exercise detail`                  | Router navigate called                                   |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Component setup                                                |
|  02   | UI interaction (expand/edit)                                   |
|  03   | Exercise CRUD operations                                       |
|  04   | Set form visibility                                            |
|  05   | Set handling (add/update/delete)                               |
|  06   | Navigation                                                     |


# ExerciseDetailComponent

|  ID  | Group | Description                                                              | Test Case                                            | Result Output(s)                                        | Works |
|:----:|:-----:|---------------------------------------------------------------------------|------------------------------------------------------|----------------------------------------------------------|:-----:|
|  01  |  01   | Loads exercise details and sets on init                                   | `should load exercise details and sets on init`      | `exerciseId`, `workoutId` set; sets loaded               |   ✅   |
|  02  |  01   | Groups exercise sets by date                                              | `should group sets by date`                          | Sets grouped and sorted by date                          |   ✅   |
|  03  |  02   | Adds a new set and updates UI                                             | `should add a new set`                               | Set added, list updated                                  |   ✅   |
|  04  |  02   | Deletes a set and updates internal state                                  | `should delete a set`                                | Set removed from list                                    |   ✅   |
|  05  |  03   | Toggles date expansion for set groups                                     | `should toggle date expanded state`                  | Expand/collapse state toggled correctly                  |   ✅   |
|  06  |  03   | Shows and hides the add set form                                          | `should show and hide the add set form`              | `showSetForm` toggled                                    |   ✅   |
|  07  |  04   | Calculates total repetitions of a group of sets                           | `should calculate total repetitions correctly`       | Total repetitions = 18                                   |   ✅   |
|  08  |  04   | Calculates average weight per repetition                                  | `should calculate average weight per rep correctly`  | Average = 104                                             |   ✅   |
|  09  |  05   | Returns current day of the week                                           | `should return the correct current day`              | Day string from ['Sunday'...'Saturday']                  |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Initialization and data loading                                |
|  02   | Set management (add/delete)                                    |
|  03   | UI interactions (expansion/form toggling)                      |
|  04   | Calculation logic                                              |
|  05   | Utility/date functionality                                     |

# ExerciseFormComponent

|  ID  | Group | Description                                                          | Test Case                                               | Result Output(s)                                             | Works |
|:----:|:-----:|-----------------------------------------------------------------------|---------------------------------------------------------|--------------------------------------------------------------|:-----:|
|  01  |  01   | Component is created successfully                                     | `should create the component`                           | Component instance is truthy                                 |   ✅   |
|  02  |  02   | Submits form, calls service, emits event, and resets form             | `should call WorkoutService and emit event on successful submit` | Exercise added, form reset, event emitted     |   ✅   |
|  03  |  02   | Handles service error gracefully during submission                    | `should handle errors during submit gracefully`         | Error logged, `isSubmitting` set to false                     |   ✅   |
|  04  |  03   | Resets the form fields                                                | `should reset the form`                                 | Exercise name and notes are reset to empty strings            |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Initialization                                                 |
|  02   | Form submission and error handling                             |
|  03   | Form reset functionality                                       |

# SetDetailComponent

|  ID  | Group | Description                                                                 | Test Case                                              | Result Output(s)                                                  | Works |
|:----:|:-----:|------------------------------------------------------------------------------|--------------------------------------------------------|-------------------------------------------------------------------|:-----:|
|  01  |  01   | Component initializes successfully                                           | `should create the component`                          | Component instance is truthy                                      |   ✅   |
|  02  |  02   | Loads set details and formats date/time                                      | `should load set details on init`                      | Set loaded, date/time fields formatted correctly                  |   ✅   |
|  03  |  02   | Handles error when loading set and navigates back                            | `should handle error loading set details and navigate back` | Navigation to exercise view triggered                       |   ✅   |
|  04  |  03   | Saves the updated set and navigates back                                     | `should save the set and navigate back`                | Service called, navigation to exercise view                      |   ✅   |
|  05  |  03   | Handles error on set update and prevents navigation                          | `should handle error on save and not navigate`         | Error logged, `isSubmitting` false, no navigation                |   ✅   |
|  06  |  04   | Deletes the set and navigates back                                           | `should delete the set and navigate back`              | Set deleted, navigation to exercise view                         |   ✅   |
|  07  |  05   | Formats a `Date` object to a readable date string                            | `should format date correctly`                         | Output: `1 May 2024`                                              |   ✅   |
|  08  |  05   | Formats a `Date` object to time (HH:mm)                                      | `should format time correctly`                         | Output: `20:25`                                                   |   ✅   |
|  09  |  05   | Formats a `Date` object to full time (HH:mm:ss)                              | `should format exact time correctly`                   | Output: `20:25:42`                                                |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Initialization                                                 |
|  02   | Set loading and error handling                                 |
|  03   | Set update logic                                               |
|  04   | Deletion logic                                                 |
|  05   | Utility: date/time formatting                                  |

# SetFormComponent

|  ID  | Group | Description                                                              | Test Case                                                 | Result Output(s)                                           | Works |
|:----:|:-----:|---------------------------------------------------------------------------|-----------------------------------------------------------|------------------------------------------------------------|:-----:|
|  01  |  01   | Component initializes successfully                                         | `should create the component`                             | Component instance is truthy                               |   ✅   |
|  02  |  02   | Submits form successfully, emits event, and resets form                   | `should call ExerciseService and emit event on successful submit` | Event emitted, form reset after successful submission | ✅ |
|  03  |  02   | Handles service error during form submission                              | `should handle errors during submit`                      | Error logged, `isSubmitting` reset                         |   ✅   |
|  04  |  03   | Resets form fields manually                                               | `should reset the form`                                   | `setData` fields reset to defaults                         |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Component creation                                             |
|  02   | Form submission and error handling                             |
|  03   | Manual form reset                                              |

# SetListComponent

|  ID  | Group | Description                                                          | Test Case                                             | Result Output(s)                                               | Works |
|:----:|:-----:|-----------------------------------------------------------------------|-------------------------------------------------------|----------------------------------------------------------------|:-----:|
|  01  |  01   | Component initializes successfully                                    | `should create the component`                         | Component instance is truthy                                   |   ✅   |
|  02  |  02   | Starts editing a set                                                  | `should start editing a set`                          | `editingSetId` and `editingSet` set correctly                  |   ✅   |
|  03  |  02   | Cancels editing a set                                                 | `should cancel edit`                                  | `editingSetId` cleared, `editingSet` reset                     |   ✅   |
|  04  |  03   | Saves an updated set and emits update                                 | `should save a set and emit update event`             | Service called, event emitted, edit mode cleared               |   ✅   |
|  05  |  03   | Handles error when saving a set                                       | `should handle error when saving a set`               | Error logged                                                   |   ✅   |
|  06  |  04   | Deletes a set and emits delete event                                  | `should delete a set and emit delete event`           | Service called, event emitted                                  |   ✅   |
|  07  |  04   | Cancels deletion if user declines confirmation                        | `should not delete set if user cancels confirmation`  | Service not called                                             |   ✅   |
|  08  |  04   | Handles error when deleting a set                                     | `should handle error when deleting a set`             | Error logged                                                   |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Initialization                                                 |
|  02   | Edit interaction                                               |
|  03   | Save logic and error handling                                  |
|  04   | Delete logic and confirmation handling                         |

# WorkoutCardComponent

|  ID  | Group | Description                                                            | Test Case                                              | Result Output(s)                                               | Works |
|:----:|:-----:|-------------------------------------------------------------------------|--------------------------------------------------------|----------------------------------------------------------------|:-----:|
|  01  |  01   | Component initializes correctly                                         | `should create the component`                          | Component instance is truthy                                   |   ✅   |
|  02  |  02   | Formats date into readable string                                       | `should format date correctly`                         | Output matches pattern like `Mo., 01. Mai 2024`                |   ✅   |
|  03  |  02   | Toggles delete confirmation state                                       | `should toggle delete confirmation state`              | `showDeleteConfirm` toggled                                   |   ✅   |
|  04  |  03   | Deletes workout and emits deleted event                                 | `should emit deleted event after successful deletion`  | Service called, event emitted, `isDeleting` is false           |   ✅   |
|  05  |  03   | Handles delete failure without emitting event                           | `should handle deletion error and not emit`            | Error logged, event not emitted, `isDeleting` is false         |   ✅   |
|  06  |  03   | Prevents deletion when workout has no ID                                | `should not delete if workout has no id`               | Service not called                                             |   ✅   |
|  07  |  04   | Returns "Never trained" if no date is provided                          | `should return "Never trained" if date is undefined`   | Returns static message                                         |   ✅   |
|  08  |  04   | Returns "Just now" for less than 1 minute                               | `should return "Just now" for less than 60 seconds`    | Output: `Just now`                                             |   ✅   |
|  09  |  04   | Calculates minutes ago                                                  | `should return "X minutes ago" for recent time`        | Output contains `"minute"`                                     |   ✅   |
|  10  |  04   | Calculates hours ago                                                    | `should return "X hours ago"`                          | Output contains `"hour"`                                       |   ✅   |
|  11  |  04   | Calculates days ago                                                     | `should return "X days ago"`                           | Output contains `"day"`                                        |   ✅   |
|  12  |  04   | Calculates weeks ago                                                    | `should return "X weeks ago"`                          | Output contains `"week"`                                       |   ✅   |
|  13  |  04   | Returns "months ago" for old date                                       | `should return "months ago" for older dates`           | Output: `months ago`                                           |   ✅   |
|  14  |  04   | Returns "Unknown" for invalid date input                                | `should return "Unknown" for invalid date input`       | Error logged, output: `Unknown`                                |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Initialization                                                 |
|  02   | UI interaction (formatting, toggling)                          |
|  03   | Deletion logic                                                 |
|  04   | Time difference formatting logic                               |

# WorkoutDetailComponent

|  ID  | Group | Description                                                              | Test Case                                              | Result Output(s)                                                | Works |
|:----:|:-----:|---------------------------------------------------------------------------|--------------------------------------------------------|-----------------------------------------------------------------|:-----:|
|  01  |  01   | Component initializes successfully                                        | `should create`                                        | Component instance is truthy                                    |   ✅   |
|  02  |  02   | Loads workout and exercises on init                                       | `should load workout and exercises on init`            | Workout and exercise data loaded, service methods called        |   ✅   |
|  03  |  03   | Toggles visibility of exercise form                                       | `should toggle the exercise form`                      | `showExerciseForm` toggled to true                              |   ✅   |
|  04  |  03   | Adds a new exercise and hides form                                        | `should add an exercise`                               | Exercise added to list, form hidden                             |   ✅   |
|  05  |  03   | Deletes an exercise from the list                                         | `should delete an exercise`                            | Exercise with matching ID removed from list                     |   ✅   |
|  06  |  04   | Deletes workout after confirmation and navigates back                    | `should delete workout and navigate back`              | Service called, navigation triggered                            |   ✅   |
|  07  |  04   | Updates workout date and reloads data                                     | `should update workout date and reload workout`        | Services called to update and reload workout and exercises      |   ✅   |
|  08  |  05   | Returns fallback if no date provided                                      | `should return "Never trained" if no date is provided` | Returns "Never trained"                                         |   ✅   |
|  09  |  05   | Returns formatted string if valid date is provided                        | `should return valid datetime string for valid date`   | Returns non-empty string                                        |   ✅   |
|  10  |  05   | Handles invalid date input gracefully                                     | `should handle error on invalid date string`           | Logs error, returns "Unknown"                                   |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Initialization                                                 |
|  02   | Data fetching                                                  |
|  03   | Exercise management                                            |
|  04   | Workout deletion and update                                    |
|  05   | Date/time utility logic                                        |

# WorkoutFormComponent

|  ID  | Group | Description                                                           | Test Case                                            | Result Output(s)                                                 | Works |
|:----:|:-----:|------------------------------------------------------------------------|------------------------------------------------------|------------------------------------------------------------------|:-----:|
|  01  |  01   | Component is created successfully                                      | `should create the component`                        | Component instance is truthy                                     |   ✅   |
|  02  |  02   | Initializes form with default values                                   | `should initialize the form with default values`     | Form fields contain initial values                               |   ✅   |
|  03  |  03   | Submits valid form, emits `workoutCreated`, and resets form            | `should emit workoutCreated on successful submission`| Event emitted, form reset                                        |   ✅   |
|  04  |  03   | Prevents submission of invalid form                                    | `should not submit if form is invalid`               | Submission blocked, no service call                              |   ✅   |
|  05  |  03   | Resets form after successful submission                                | `should reset form after submission`                 | Form values cleared                                              |   ✅   |
|  06  |  04   | Handles submission error gracefully                                    | `should handle errors during submission`             | Error logged, `isSubmitting` reset                               |   ✅   |
|  07  |  05   | Emits cancelled event when cancel is triggered                         | `should emit cancelled event on cancel`              | Event emitted via `cancelled` output                             |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Component setup                                                |
|  02   | Form initialization                                            |
|  03   | Valid submission behavior                                      |
|  04   | Error handling                                                 |
|  05   | User interaction (cancel)                                      |


# WorkoutListComponent

|  ID  | Group | Description                                                           | Test Case                                               | Result Output(s)                                                   | Works |
|:----:|:-----:|------------------------------------------------------------------------|---------------------------------------------------------|--------------------------------------------------------------------|:-----:|
|  01  |  01   | Component is created successfully                                      | `should create the component`                           | Component instance is truthy                                       |   ✅   |
|  02  |  02   | Loads and sorts workouts on initialization                             | `should load and sort workouts on init`                 | Workouts sorted by date, loading flag reset                        |   ✅   |
|  03  |  02   | Handles error during workout loading                                   | `should handle error during loadWorkouts`               | Error logged, `isLoading` is false                                 |   ✅   |
|  04  |  03   | Toggles workout creation form visibility                               | `should toggle form visibility`                         | `showForm` toggled to true                                         |   ✅   |
|  05  |  03   | Adds a new workout at the top of the list                              | `should add a workout to the beginning of the list`     | New workout inserted at index 0, form hidden                       |   ✅   |
|  06  |  03   | Removes a workout by ID                                                | `should remove a workout on deletion`                   | Workout with specified ID removed                                  |   ✅   |
|  07  |  04   | Returns all workouts if no search term is entered                      | `should return all workouts if no search term is provided` | Filter returns all workouts                                     |   ✅   |
|  08  |  04   | Filters workouts by search term in name or notes                       | `should filter workouts by name or notes`               | Filter returns matching workouts                                   |   ✅   |
|  09  |  04   | Returns empty list if search term doesn't match                        | `should return an empty list if search term matches nothing` | Filter returns empty array                                   |   ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | Initialization                                                 |
|  02   | Workout data fetching                                          |
|  03   | User interactions (form, add, delete)                          |
|  04   | Filtering/search logic                                         |


# AppComponent

This test case is also automatically generated.

|  ID  | Group | Description                            | Test Case                         | Result Output(s)                    | Works |
|:----:|:-----:|----------------------------------------|-----------------------------------|-------------------------------------|:-----:|
|  01  |  01   | Creates the application root component | `should create the app`           | App component instance is truthy    |  ✅   |
|  02  |  01   | Has correct title                      | `should have the 'client' title`  | `title` equals `'FitTrack'`         |  ✅   |

### Groupings

| Group | Description                                                    |
|:-----:|----------------------------------------------------------------|
|  01   | App initialization and config                                  |

