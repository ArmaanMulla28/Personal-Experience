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

    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperiences() {
        List<Experience> experiences = experienceService.getAllExperiences();
        return ResponseEntity.ok(experiences);
    }

    @PostMapping
    public ResponseEntity<Experience> createExperience(@Valid @RequestBody ExperienceRequestDTO request) {
        Experience created = experienceService.createExperience(request);
        experienceSearchService.indexExperience(ExperienceItem.fromEntity(created));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Experience> getExperienceById(@PathVariable Long id) {
        return experienceService.getExperienceById(id)
                .map(exp -> {
                    // Push to Recently Viewed Stack (LIFO)
                    recentlyViewedService.recordView(ExperienceItem.fromEntity(exp));
                    return ResponseEntity.ok(exp);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        boolean deleted = experienceService.deleteExperience(id);
        if (deleted) {
            experienceSearchService.deleteFromIndex(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
