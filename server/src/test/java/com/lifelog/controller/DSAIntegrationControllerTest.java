package com.lifelog.controller;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import com.lifelog.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("DSAController Web Layer Tests")
class DSAIntegrationControllerTest {

    private MockMvc mockMvc;
    private ExperienceRepository repository;

    @BeforeEach
    void setUp() {
        // ExperienceRepository is a Java interface, which Mockito mocks cleanly on modern JVMs
        repository = Mockito.mock(ExperienceRepository.class);

        TimelineService timelineService = new TimelineService(repository);
        RecentlyViewedService recentlyViewedService = new RecentlyViewedService();
        PendingExperienceService pendingExperienceService = new PendingExperienceService();
        ExperienceSearchService experienceSearchService = new ExperienceSearchService(repository);
        ExperienceRankingService experienceRankingService = new ExperienceRankingService(repository);

        DSAController controller = new DSAController(
                timelineService,
                recentlyViewedService,
                pendingExperienceService,
                experienceSearchService,
                experienceRankingService
        );

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("GET /api/experiences/timeline returns 200 with list from CustomLinkedList")
    void testGetTimeline() throws Exception {
        Experience exp = new Experience("Hackathon", "Hackathons", "desc", "loc", LocalDate.now(), 5);
        exp.setId(1L);
        when(repository.findAll()).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/experiences/timeline"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Hackathon"));
    }

    @Test
    @DisplayName("POST /api/experiences/pending and GET /api/experiences/pending using ExperienceQueue")
    void testPendingQueue() throws Exception {
        String json = """
                {
                    "title": "Pending Project",
                    "category": "Projects",
                    "rating": 4
                }
                """;

        mockMvc.perform(post("/api/experiences/pending")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Pending Project"));

        mockMvc.perform(get("/api/experiences/pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Pending Project"));
    }

    @Test
    @DisplayName("GET /api/experiences/search/id/{id} uses ExperienceBST")
    void testSearchByBstId() throws Exception {
        Experience exp = new Experience("BST Found", "Projects", "desc", "loc", LocalDate.now(), 5);
        exp.setId(100L);
        when(repository.findById(100L)).thenReturn(Optional.of(exp));

        mockMvc.perform(get("/api/experiences/search/id/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("BST Found"));

        mockMvc.perform(get("/api/experiences/search/id/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/experiences/top returns 200 with ranked list from ExperienceMaxHeap")
    void testGetTopExperiences() throws Exception {
        Experience exp = new Experience("Top Hackathon", "Hackathons", "desc", "loc", LocalDate.now(), 5);
        exp.setId(1L);
        when(repository.findAll()).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/experiences/top?limit=5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Top Hackathon"))
                .andExpect(jsonPath("$[0].rating").value(5));
    }

    @Test
    @DisplayName("GET /api/experiences/bst/stats returns tree structure metrics")
    void testGetBSTStats() throws Exception {
        Experience exp = new Experience("Test", "Projects", "desc", "loc", LocalDate.now(), 4);
        exp.setId(10L);
        when(repository.findAll()).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/experiences/bst/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size").value(1))
                .andExpect(jsonPath("$.minId").value(10));
    }
}
