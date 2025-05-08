package ch.zhaw.skibidicoders.fittrack.controller;

import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseSetRequestDto;
import ch.zhaw.skibidicoders.fittrack.exception.ExerciseSetNotFoundException;
import ch.zhaw.skibidicoders.fittrack.model.ExerciseSet;
import ch.zhaw.skibidicoders.fittrack.service.ExerciseSetService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ExerciseSetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ExerciseSetService exerciseSetService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldGetExerciseSet() throws Exception {
        ExerciseSet exerciseSet = new ExerciseSet();
        exerciseSet.setId(1L);

        Mockito.when(exerciseSetService.getExerciseSet(1L)).thenReturn(exerciseSet);

        mockMvc.perform(get("/api/sets/1"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void shouldReturnNotFoundWhenExerciseSetDoesNotExist() throws Exception {
        Mockito.when(exerciseSetService.getExerciseSet(2L))
                .thenThrow(new ExerciseSetNotFoundException());

        mockMvc.perform(get("/api/sets/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldUpdateExerciseSet() throws Exception {
        ExerciseSet existingSet = new ExerciseSet();
        existingSet.setId(1L);
        existingSet.setRepetitions(10);
        existingSet.setWeight(60.0);

        Mockito.when(exerciseSetService.updateExerciseSet(eq(1L), any(ExerciseSetRequestDto.class)))
                .thenAnswer(invocation -> {
                    ExerciseSetRequestDto dto = invocation.getArgument(1);
                    existingSet.setRepetitions(dto.repetitions());
                    existingSet.setWeight(dto.weight());
                    return existingSet;
                });

        ExerciseSetRequestDto requestDto = new ExerciseSetRequestDto(12, 80, "notes");

        mockMvc.perform(put("/api/sets/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.repetitions").value(12))
                .andExpect(jsonPath("$.weight").value(80));
    }

    @Test
    void shouldReturnNotFoundWhenUpdatingNonexistentExerciseSet() throws Exception {
        Mockito.when(exerciseSetService.updateExerciseSet(eq(2L), any(ExerciseSetRequestDto.class)))
                .thenThrow(new ExerciseSetNotFoundException());

        ExerciseSetRequestDto requestDto = new ExerciseSetRequestDto(12,80, "notes");

        mockMvc.perform(put("/api/sets/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteExerciseSet() throws Exception {
        mockMvc.perform(delete("/api/sets/1"))
                .andExpect(status().isNoContent());

        Mockito.verify(exerciseSetService).deleteExerciseSet(1L);
    }

    @Test
    void shouldReturnNotFoundWhenDeletingNonexistentExerciseSet() throws Exception {
        Mockito.doThrow(new ExerciseSetNotFoundException())
                .when(exerciseSetService).deleteExerciseSet(2L);

        mockMvc.perform(delete("/api/sets/2"))
                .andExpect(status().isNotFound());

        Mockito.verify(exerciseSetService).deleteExerciseSet(2L);
    }
}