package com.lifelog.controller;

import com.lifelog.dto.AnalyticsResponseDTO;
import com.lifelog.dto.MemoryLaneDTO;
import com.lifelog.service.AnalyticsService;
import com.lifelog.service.MemoryLaneService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/experiences")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final MemoryLaneService memoryLaneService;

    public AnalyticsController(AnalyticsService analyticsService, MemoryLaneService memoryLaneService) {
        this.analyticsService = analyticsService;
        this.memoryLaneService = memoryLaneService;
    }

    /**
     * GET /api/experiences/analytics
     * Returns aggregated statistics, rating/category distributions, and active monthly metrics.
     */
    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponseDTO> getAnalytics() {
        AnalyticsResponseDTO analytics = analyticsService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }

    /**
     * GET /api/experiences/memory-lane
     * Returns nostalgic memories, "On This Day" anniversaries, and historical milestones.
     */
    @GetMapping("/memory-lane")
    public ResponseEntity<List<MemoryLaneDTO>> getMemoryLane(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<MemoryLaneDTO> memories = memoryLaneService.getMemoryLane(date);
        return ResponseEntity.ok(memories);
    }
}
