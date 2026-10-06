package com.lifelog.service;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@DisplayName("ExperienceRankingService Integration Tests")
class ExperienceRankingServiceTest {

    private ExperienceRepository repository;
    private ExperienceRankingService rankingService;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ExperienceRepository.class);
        rankingService = new ExperienceRankingService(repository);
    }

    @Test
    @DisplayName("Top experiences extracted in descending rating order using Max Heap")
    void testGetTopExperiencesDescending() {
        Experience e1 = new Experience("Low Rated", "Workshops", "desc", "loc", LocalDate.now(), 2);
        e1.setId(1L);
        Experience e2 = new Experience("Hackathon Winner", "Hackathons", "desc", "loc", LocalDate.now(), 5);
        e2.setId(2L);
        Experience e3 = new Experience("Good Internship", "Internships", "desc", "loc", LocalDate.now(), 4);
        e3.setId(3L);
        Experience e4 = new Experience("College Event", "Events", "desc", "loc", LocalDate.now(), 3);
        e4.setId(4L);

        when(repository.findAll()).thenReturn(Arrays.asList(e1, e2, e3, e4));

        List<ExperienceItem> top3 = rankingService.getTopExperiences(3);
        assertEquals(3, top3.size());
        assertEquals(5, top3.get(0).getEffectiveRating());
        assertEquals("Hackathon Winner", top3.get(0).getTitle());
        assertEquals(4, top3.get(1).getEffectiveRating());
        assertEquals("Good Internship", top3.get(1).getTitle());
        assertEquals(3, top3.get(2).getEffectiveRating());
        assertEquals("College Event", top3.get(2).getTitle());
    }

    @Test
    @DisplayName("Limit larger than dataset returns all available sorted")
    void testLimitLargerThanSize() {
        Experience e1 = new Experience("Exp 1", "Projects", "desc", "loc", LocalDate.now(), 4);
        e1.setId(1L);
        when(repository.findAll()).thenReturn(List.of(e1));

        List<ExperienceItem> top = rankingService.getTopExperiences(10);
        assertEquals(1, top.size());
        assertEquals(1L, top.get(0).getId());
    }
}
