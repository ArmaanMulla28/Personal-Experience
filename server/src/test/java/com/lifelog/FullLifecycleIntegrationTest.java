package com.lifelog;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.dto.ExperienceRequestDTO;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import com.lifelog.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("Phase 8: Full End-to-End Application Lifecycle Integration Test")
class FullLifecycleIntegrationTest {

    private ExperienceRepository repository;
    private ExperienceService experienceService;
    private RecentlyViewedService recentlyViewedService;
    private TimelineService timelineService;
    private PendingExperienceService pendingExperienceService;
    private ExperienceSearchService experienceSearchService;
    private ExperienceRankingService experienceRankingService;

    private final Map<Long, Experience> mockDb = new HashMap<>();
    private long idSequence = 100L;

    @BeforeEach
    void setUp() {
        mockDb.clear();
        repository = Mockito.mock(ExperienceRepository.class);

        // Wire mock repository to in-memory map
        when(repository.save(any(Experience.class))).thenAnswer(inv -> {
            Experience exp = inv.getArgument(0);
            if (exp.getId() == null) {
                exp.setId(idSequence++);
            }
            mockDb.put(exp.getId(), exp);
            return exp;
        });

        when(repository.findById(anyLong())).thenAnswer(inv -> {
            Long id = inv.getArgument(0);
            return Optional.ofNullable(mockDb.get(id));
        });

        when(repository.findAll()).thenAnswer(inv -> new ArrayList<>(mockDb.values()));
        when(repository.existsById(anyLong())).thenAnswer(inv -> mockDb.containsKey(inv.getArgument(0)));
        doAnswer(inv -> {
            mockDb.remove(inv.getArgument(0));
            return null;
        }).when(repository).deleteById(anyLong());

        // Initialize Services
        experienceService = new ExperienceService(repository);
        recentlyViewedService = new RecentlyViewedService();
        timelineService = new TimelineService(repository);
        pendingExperienceService = new PendingExperienceService();
        experienceSearchService = new ExperienceSearchService(repository);
        experienceRankingService = new ExperienceRankingService(repository);
    }

    @Test
    @DisplayName("Complete Lifecycle: Create -> DB -> BST -> Timeline -> Stack -> Heap -> Queue -> Delete")
    void testCompleteLifecycle() {
        // Step 1: Create multiple experiences
        ExperienceRequestDTO dto1 = new ExperienceRequestDTO(
                "Smart India Hackathon", "Hackathons", "Won 1st prize", "Bhopal",
                LocalDate.of(2025, 9, 20), 5
        );
        ExperienceRequestDTO dto2 = new ExperienceRequestDTO(
                "Software Engineering Internship", "Internships", "Fullstack development", "Bangalore",
                LocalDate.of(2025, 6, 1), 4
        );
        ExperienceRequestDTO dto3 = new ExperienceRequestDTO(
                "Robotics Workshop", "Workshops", "ROS & Gazebo", "Campus",
                LocalDate.of(2025, 3, 15), 3
        );

        Experience exp1 = experienceService.createExperience(dto1);
        Experience exp2 = experienceService.createExperience(dto2);
        Experience exp3 = experienceService.createExperience(dto3);

        assertNotNull(exp1.getId());
        assertNotNull(exp2.getId());
        assertNotNull(exp3.getId());
        assertEquals(3, mockDb.size());

        // Step 2: BST Search Integration
        experienceSearchService.reindex();
        ExperienceItem bstFound = experienceSearchService.searchById(exp1.getId());
        assertNotNull(bstFound, "BST should index exp1");
        assertEquals("Smart India Hackathon", bstFound.getTitle());
        assertEquals(3, experienceSearchService.getBSTStats().get("size"));

        // Step 3: Timeline Linked List
        List<ExperienceItem> timeline = timelineService.getTimeline();
        assertEquals(3, timeline.size());
        // Chronological order (most recent first): Hackathon (September) -> Internship (June) -> Robotics Workshop (March)
        assertEquals(exp1.getId(), timeline.get(0).getId());
        assertEquals(exp2.getId(), timeline.get(1).getId());
        assertEquals(exp3.getId(), timeline.get(2).getId());

        // Step 4: Recently Viewed Stack (LIFO)
        recentlyViewedService.recordView(bstFound);
        recentlyViewedService.recordView(new ExperienceItem(exp2.getId(), exp2.getTitle(), exp2.getCategory(), exp2.getExperienceDate(), exp2.getRating()));

        List<ExperienceItem> recent = recentlyViewedService.getRecentlyViewed(5);
        assertEquals(2, recent.size());
        assertEquals(exp2.getId(), recent.get(0).getId(), "Most recently viewed must be at top of stack");
        assertEquals(exp1.getId(), recent.get(1).getId());

        // Step 5: Ranking with Max Heap
        List<ExperienceItem> topRanked = experienceRankingService.getTopExperiences(3);
        assertEquals(3, topRanked.size());
        assertEquals(5, topRanked.get(0).getRating(), "Top ranked must be 5-star");
        assertEquals(exp1.getId(), topRanked.get(0).getId());

        // Step 6: Pending Queue (FIFO)
        ExperienceItem pendingA = new ExperienceItem(901L, "Write Documentation", "Tasks", LocalDate.now(), 4);
        ExperienceItem pendingB = new ExperienceItem(902L, "Upload Certificate", "Tasks", LocalDate.now(), 5);

        pendingExperienceService.enqueuePending(pendingA);
        pendingExperienceService.enqueuePending(pendingB);

        assertEquals(2, pendingExperienceService.size());
        assertEquals(901L, pendingExperienceService.peekNext().getId(), "FIFO peek must show first enqueued item");

        ExperienceItem dequeued = pendingExperienceService.dequeueNext();
        assertEquals(901L, dequeued.getId());
        assertEquals(1, pendingExperienceService.size());
        assertEquals(902L, pendingExperienceService.peekNext().getId());

        // Step 7: Update Experience & Re-verify
        ExperienceRequestDTO updateDTO = new ExperienceRequestDTO(
                "Smart India Hackathon - Grand Finale Winner", "Hackathons", "National Champion", "Bhopal",
                LocalDate.of(2025, 9, 20), 5
        );
        Experience updated = experienceService.updateExperience(exp1.getId(), updateDTO);
        assertEquals("Smart India Hackathon - Grand Finale Winner", updated.getTitle());

        // Step 8: Delete Experience
        assertTrue(experienceService.deleteExperience(exp3.getId()));
        assertEquals(2, mockDb.size());
        assertFalse(experienceService.getExperienceById(exp3.getId()).isPresent());
    }
}
