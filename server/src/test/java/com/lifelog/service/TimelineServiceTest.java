package com.lifelog.service;

import com.lifelog.dsa.linkedlist.CustomLinkedList;
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

@DisplayName("TimelineService Integration Tests")
class TimelineServiceTest {

    private ExperienceRepository repository;
    private TimelineService timelineService;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ExperienceRepository.class);
        timelineService = new TimelineService(repository);
    }

    @Test
    @DisplayName("Build timeline sorts chronologically (most recent first)")
    void testBuildTimelineChronological() {
        Experience e1 = new Experience("Old Workshop", "Workshops", "desc", "loc", LocalDate.of(2024, 1, 1), 3);
        e1.setId(1L);
        Experience e2 = new Experience("New Hackathon", "Hackathons", "desc", "loc", LocalDate.of(2026, 5, 1), 5);
        e2.setId(2L);
        Experience e3 = new Experience("Mid Internship", "Internships", "desc", "loc", LocalDate.of(2025, 3, 1), 4);
        e3.setId(3L);

        when(repository.findAll()).thenReturn(Arrays.asList(e1, e2, e3));

        CustomLinkedList list = timelineService.buildTimeline();
        assertEquals(3, list.size());

        List<ExperienceItem> timeline = list.traverse();
        assertEquals(2L, timeline.get(0).getId()); // 2026 first
        assertEquals(3L, timeline.get(1).getId()); // 2025 second
        assertEquals(1L, timeline.get(2).getId()); // 2024 third
    }

    @Test
    @DisplayName("Search timeline by ID")
    void testSearchTimeline() {
        Experience e1 = new Experience("Project", "Projects", "desc", "loc", LocalDate.now(), 4);
        e1.setId(10L);
        when(repository.findAll()).thenReturn(List.of(e1));

        ExperienceItem found = timelineService.searchTimeline(10L);
        assertNotNull(found);
        assertEquals(10L, found.getId());
        assertEquals("Project", found.getTitle());

        assertNull(timelineService.searchTimeline(999L));
    }

    @Test
    @DisplayName("Delete from timeline")
    void testDeleteFromTimeline() {
        Experience e1 = new Experience("Project", "Projects", "desc", "loc", LocalDate.now(), 4);
        e1.setId(10L);
        when(repository.findAll()).thenReturn(List.of(e1));
        when(repository.existsById(10L)).thenReturn(true);

        assertTrue(timelineService.deleteFromTimeline(10L));
        Mockito.verify(repository).deleteById(10L);
    }
}
