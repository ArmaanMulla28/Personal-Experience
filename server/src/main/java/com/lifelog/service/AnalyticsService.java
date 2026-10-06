package com.lifelog.service;

import com.lifelog.dto.AnalyticsResponseDTO;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ExperienceRepository experienceRepository;

    public AnalyticsService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsResponseDTO getAnalytics() {
        List<Experience> experiences = experienceRepository.findAll();

        if (experiences.isEmpty()) {
            return new AnalyticsResponseDTO(
                    0,
                    0.0,
                    "None",
                    0,
                    "None",
                    0,
                    null,
                    Collections.emptyMap(),
                    Map.of(1, 0L, 2, 0L, 3, 0L, 4, 0L, 5, 0L),
                    Collections.emptyMap()
            );
        }

        long totalExperiences = experiences.size();

        // 1. Average Rating & Rating Distribution
        Map<Integer, Long> ratingDistribution = new LinkedHashMap<>();
        for (int r = 1; r <= 5; r++) {
            ratingDistribution.put(r, 0L);
        }

        long ratingSum = 0;
        long ratedCount = 0;
        Experience highestRated = null;

        for (Experience exp : experiences) {
            Integer rating = exp.getRating();
            if (rating != null && rating >= 1 && rating <= 5) {
                ratingSum += rating;
                ratedCount++;
                ratingDistribution.put(rating, ratingDistribution.get(rating) + 1);

                if (highestRated == null || rating > (highestRated.getRating() != null ? highestRated.getRating() : 0)) {
                    highestRated = exp;
                } else if (rating.equals(highestRated.getRating())) {
                    // Tie-breaker: latest experience date
                    if (exp.getExperienceDate() != null && highestRated.getExperienceDate() != null
                            && exp.getExperienceDate().isAfter(highestRated.getExperienceDate())) {
                        highestRated = exp;
                    }
                }
            }
        }

        double averageRating = 0.0;
        if (ratedCount > 0) {
            double rawAvg = (double) ratingSum / ratedCount;
            averageRating = BigDecimal.valueOf(rawAvg)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        // 2. Category Distribution & Most Common Category
        Map<String, Long> categoryDistribution = experiences.stream()
                .filter(e -> e.getCategory() != null && !e.getCategory().isBlank())
                .collect(Collectors.groupingBy(
                        Experience::getCategory,
                        Collectors.counting()
                ));

        String mostCommonCategory = "None";
        long mostCommonCategoryCount = 0;
        for (Map.Entry<String, Long> entry : categoryDistribution.entrySet()) {
            if (entry.getValue() > mostCommonCategoryCount) {
                mostCommonCategoryCount = entry.getValue();
                mostCommonCategory = entry.getKey();
            }
        }

        // 3. Monthly Activity Breakdown & Most Active Month
        DateTimeFormatter monthYearFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, Long> monthlyActivityMap = new TreeMap<>();

        for (Experience exp : experiences) {
            if (exp.getExperienceDate() != null) {
                String ym = exp.getExperienceDate().format(monthYearFormatter);
                monthlyActivityMap.put(ym, monthlyActivityMap.getOrDefault(ym, 0L) + 1);
            }
        }

        String mostActiveMonth = "None";
        long mostActiveMonthCount = 0;
        for (Map.Entry<String, Long> entry : monthlyActivityMap.entrySet()) {
            if (entry.getValue() > mostActiveMonthCount) {
                mostActiveMonthCount = entry.getValue();
                mostActiveMonth = entry.getKey();
            }
        }

        return new AnalyticsResponseDTO(
                totalExperiences,
                averageRating,
                mostCommonCategory,
                mostCommonCategoryCount,
                mostActiveMonth,
                mostActiveMonthCount,
                highestRated,
                categoryDistribution,
                ratingDistribution,
                monthlyActivityMap
        );
    }
}
