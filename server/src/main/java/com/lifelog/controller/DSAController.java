package com.lifelog.controller;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.dto.ExperienceRequestDTO;
import com.lifelog.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller exposing REST APIs powered by the custom Java DSA implementations:
 * - Linked List: Experience Timeline
 * - Stack: Recently Viewed Experiences
 * - Queue: Pending Documentation
 * - BST: Numeric ID Lookup & Tree Traversal
 * - Max Heap: Top-Rated Experiences
 */
@RestController
@RequestMapping("/api/experiences")
@CrossOrigin(origins = "*")
public class DSAController {

    private final TimelineService timelineService;
    private final RecentlyViewedService recentlyViewedService;
    private final PendingExperienceService pendingExperienceService;
    private final ExperienceSearchService experienceSearchService;
    private final ExperienceRankingService experienceRankingService;

    public DSAController(
            TimelineService timelineService,
            RecentlyViewedService recentlyViewedService,
            PendingExperienceService pendingExperienceService,
            ExperienceSearchService experienceSearchService,
            ExperienceRankingService experienceRankingService
    ) {
        this.timelineService = timelineService;
        this.recentlyViewedService = recentlyViewedService;
        this.pendingExperienceService = pendingExperienceService;
        this.experienceSearchService = experienceSearchService;
        this.experienceRankingService = experienceRankingService;
    }

    // ==========================================
    // 1. LINKED LIST: TIMELINE
    // ==========================================

    @GetMapping("/timeline")
    public ResponseEntity<List<ExperienceItem>> getTimeline() {
        List<ExperienceItem> timeline = timelineService.getTimeline();
        return ResponseEntity.ok(timeline);
    }

    @GetMapping("/timeline/search/{id}")
    public ResponseEntity<ExperienceItem> searchTimeline(@PathVariable Long id) {
        ExperienceItem found = timelineService.searchTimeline(id);
        if (found != null) {
            return ResponseEntity.ok(found);
        }
        return ResponseEntity.notFound().build();
    }

    // ==========================================
    // 2. STACK: RECENTLY VIEWED (LIFO)
    // ==========================================

    @GetMapping("/recent")
    public ResponseEntity<List<ExperienceItem>> getRecentlyViewed(
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<ExperienceItem> recent = recentlyViewedService.getRecentlyViewed(limit);
        return ResponseEntity.ok(recent);
    }

    @DeleteMapping("/recent")
    public ResponseEntity<Void> clearRecentHistory() {
        recentlyViewedService.clearHistory();
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // 3. QUEUE: PENDING EXPERIENCES (FIFO)
    // ==========================================

    @GetMapping("/pending")
    public ResponseEntity<List<ExperienceItem>> getPendingExperiences() {
        List<ExperienceItem> pending = pendingExperienceService.getAllPending();
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/pending")
    public ResponseEntity<ExperienceItem> enqueuePending(
            @Valid @RequestBody ExperienceRequestDTO request
    ) {
        ExperienceItem item = new ExperienceItem(
                null,
                request.getTitle(),
                request.getCategory(),
                request.getExperienceDate(),
                request.getRating(),
                request.getRating()
        );
        item.setDescription(request.getDescription());
        item.setLocation(request.getLocation());
        pendingExperienceService.enqueuePending(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @DeleteMapping("/pending/next")
    public ResponseEntity<ExperienceItem> dequeueNextPending() {
        ExperienceItem dequeued = pendingExperienceService.dequeueNext();
        if (dequeued != null) {
            return ResponseEntity.ok(dequeued);
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/pending/{id}")
    public ResponseEntity<Void> deletePendingById(@PathVariable Long id) {
        boolean deleted = pendingExperienceService.deletePendingById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ==========================================
    // 4. BST: NUMERIC ID LOOKUP & TRAVERSAL
    // ==========================================

    @GetMapping("/search/id/{id}")
    public ResponseEntity<ExperienceItem> searchByBstId(@PathVariable Long id) {
        ExperienceItem item = experienceSearchService.searchById(id);
        if (item != null) {
            // Also register view in Stack
            recentlyViewedService.recordView(item);
            return ResponseEntity.ok(item);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/bst/inorder")
    public ResponseEntity<List<ExperienceItem>> getBSTInorder() {
        List<ExperienceItem> sorted = experienceSearchService.getInorderList();
        return ResponseEntity.ok(sorted);
    }

    @GetMapping("/bst/stats")
    public ResponseEntity<Map<String, Object>> getBSTStats() {
        Map<String, Object> stats = experienceSearchService.getBSTStats();
        return ResponseEntity.ok(stats);
    }

    // ==========================================
    // 5. MAX HEAP: TOP EXPERIENCES (PRIORITY QUEUE)
    // ==========================================

    @GetMapping("/top")
    public ResponseEntity<List<ExperienceItem>> getTopExperiences(
            @RequestParam(defaultValue = "5") int limit
    ) {
        List<ExperienceItem> top = experienceRankingService.getTopExperiences(limit);
        return ResponseEntity.ok(top);
    }
}
