package com.lifelog.controller;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.dto.ExperienceRequestDTO;
import com.lifelog.model.Experience;
import com.lifelog.service.ExperienceSearchService;
import com.lifelog.service.ExperienceService;
import com.lifelog.service.RecentlyViewedService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
@CrossOrigin(origins = "*")
public class ExperienceController {

    private final ExperienceService experienceService;
    private final RecentlyViewedService recentlyViewedService;
    private final ExperienceSearchService experienceSearchService;

    public ExperienceController(
            ExperienceService experienceService,
            RecentlyViewedService recentlyViewedService,
            ExperienceSearchService experienceSearchService
    ) {
        this.experienceService = experienceService;
        this.recentlyViewedService = recentlyViewedService;
        this.experienceSearchService = experienceSearchService;
    }

    /**
     * GET /api/experiences
     * Supports sorting via query params:
     * - sortBy: "date", "rating", "title"
     * - direction: "asc", "desc"
     */
    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperiences(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ) {
        List<Experience> experiences = experienceService.getAllExperiences(sortBy, direction);
        return ResponseEntity.ok(experiences);
    }

    /**
     * POST /api/experiences
     */
    @PostMapping
    public ResponseEntity<Experience> createExperience(@Valid @RequestBody ExperienceRequestDTO request) {
        Experience created = experienceService.createExperience(request);
        experienceSearchService.indexExperience(ExperienceItem.fromEntity(created));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * GET /api/experiences/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Experience> getExperienceById(@PathVariable Long id) {
        return experienceService.getExperienceById(id)
                .map(exp -> {
                    recentlyViewedService.recordView(ExperienceItem.fromEntity(exp));
                    return ResponseEntity.ok(exp);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT /api/experiences/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Experience> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody ExperienceRequestDTO request
    ) {
        Experience updated = experienceService.updateExperience(id, request);
        experienceSearchService.indexExperience(ExperienceItem.fromEntity(updated));
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/experiences/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        boolean deleted = experienceService.deleteExperience(id);
        if (deleted) {
            experienceSearchService.deleteFromIndex(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * GET /api/experiences/search?query=...
     */
    @GetMapping("/search")
    public ResponseEntity<List<Experience>> searchExperiences(@RequestParam(required = false) String query) {
        List<Experience> results = experienceService.searchExperiences(query);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/experiences/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Experience>> getExperiencesByCategory(@PathVariable String category) {
        List<Experience> results = experienceService.getExperiencesByCategory(category);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/experiences/rating/{rating}
     */
    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<Experience>> getExperiencesByRating(@PathVariable Integer rating) {
        List<Experience> results = experienceService.getExperiencesByRating(rating);
        return ResponseEntity.ok(results);
    }
}
