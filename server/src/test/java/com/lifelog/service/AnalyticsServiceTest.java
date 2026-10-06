package com.lifelog.service;

import com.lifelog.dto.AnalyticsResponseDTO;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@DisplayName("AnalyticsService Tests")
class AnalyticsServiceTest {

    private ExperienceRepository repository;
    private AnalyticsService service;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ExperienceRepository.class);
        service = new AnalyticsService(repository);
    }

    @Test
    @DisplayName("Analytics with empty repository returns zeroed metrics")
    void testEmptyRepositoryAnalytics() {
        when(repository.findAll()).thenReturn(Collections.emptyList());

        AnalyticsResponseDTO result = service.getAnalytics();
        assertNotNull(result);
        assertEquals(0, result.getTotalExperiences());
        assertEquals(0.0, result.getAverageRating());
        assertEquals("None", result.getMostCommonCategory());
        assertEquals("None", result.getMostActiveMonth());
        assertNull(result.getHighestRatedExperience());
        assertTrue(result.getCategoryDistribution().isEmpty());
    }

    @Test
    @DisplayName("Analytics correctly aggregates multiple experiences")
    void testPopulatedAnalytics() {
        Experience exp1 = new Experience("Hackathon Win", "Hackathons", "Built AI app", "Delhi", LocalDate.of(2025, 9, 15), 5);
        exp1.setId(1L);
        Experience exp2 = new Experience("Summer Internship", "Internships", "Software intern", "Remote", LocalDate.of(2025, 9, 20), 4);
        exp2.setId(2L);
        Experience exp3 = new Experience("Robotics Workshop", "Workshops", "Arduino build", "Campus", LocalDate.of(2025, 10, 5), 3);
        exp3.setId(3L);
        Experience exp4 = new Experience("DSA Hackathon", "Hackathons", "Algorithms", "Campus", LocalDate.of(2025, 10, 10), 4);
        exp4.setId(4L);

        when(repository.findAll()).thenReturn(List.of(exp1, exp2, exp3, exp4));

        AnalyticsResponseDTO result = service.getAnalytics();
        assertNotNull(result);
        assertEquals(4, result.getTotalExperiences());
        // Avg: (5 + 4 + 3 + 4) / 4 = 16 / 4 = 4.0
        assertEquals(4.0, result.getAverageRating());
        assertEquals("Hackathons", result.getMostCommonCategory());
        assertEquals(2L, result.getMostCommonCategoryCount());

        // Highest rated is exp1 (5 stars)
        assertNotNull(result.getHighestRatedExperience());
        assertEquals(1L, result.getHighestRatedExperience().getId());

        // Category counts
        assertEquals(2L, result.getCategoryDistribution().get("Hackathons"));
        assertEquals(1L, result.getCategoryDistribution().get("Internships"));
        assertEquals(1L, result.getCategoryDistribution().get("Workshops"));

        // Rating counts
        assertEquals(1L, result.getRatingDistribution().get(5));
        assertEquals(2L, result.getRatingDistribution().get(4));
        assertEquals(1L, result.getRatingDistribution().get(3));
        assertEquals(0L, result.getRatingDistribution().get(2));

        // Monthly activity
        assertEquals(2L, result.getMonthlyActivity().get("2025-09"));
        assertEquals(2L, result.getMonthlyActivity().get("2025-10"));
    }
}
