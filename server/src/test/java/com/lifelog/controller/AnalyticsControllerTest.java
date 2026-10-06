package com.lifelog.controller;

import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import com.lifelog.service.AnalyticsService;
import com.lifelog.service.MemoryLaneService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("AnalyticsController Web Tests")
class AnalyticsControllerTest {

    private MockMvc mockMvc;
    private ExperienceRepository repository;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ExperienceRepository.class);
        AnalyticsService analyticsService = new AnalyticsService(repository);
        MemoryLaneService memoryLaneService = new MemoryLaneService(repository);
        AnalyticsController controller = new AnalyticsController(analyticsService, memoryLaneService);

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("GET /api/experiences/analytics returns computed metrics")
    void testGetAnalytics() throws Exception {
        Experience exp = new Experience("Hackathon", "Hackathons", "Won 1st", "Remote", LocalDate.of(2025, 9, 1), 5);
        exp.setId(1L);

        when(repository.findAll()).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/experiences/analytics")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalExperiences").value(1))
                .andExpect(jsonPath("$.averageRating").value(5.0))
                .andExpect(jsonPath("$.mostCommonCategory").value("Hackathons"))
                .andExpect(jsonPath("$.mostActiveMonth").value("2025-09"));
    }

    @Test
    @DisplayName("GET /api/experiences/memory-lane returns memories")
    void testGetMemoryLane() throws Exception {
        Experience exp = new Experience("AI Summit", "Workshops", "Presented keynote", "Goa", LocalDate.of(2024, 10, 6), 5);
        exp.setId(10L);

        when(repository.findAll()).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/experiences/memory-lane?date=2026-10-06")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].experienceId").value(10))
                .andExpect(jsonPath("$[0].title").value("AI Summit"))
                .andExpect(jsonPath("$[0].yearsAgo").value(2));
    }
}
