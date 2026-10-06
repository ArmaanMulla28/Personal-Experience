package com.lifelog.service;

import com.lifelog.dto.MemoryLaneDTO;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class MemoryLaneService {

    private final ExperienceRepository experienceRepository;

    public MemoryLaneService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    /**
     * Finds memory lane experiences relative to a reference date.
     * Searches for exact day anniversaries, same-month memories from prior years,
     * and historical milestone flashbacks.
     */
    @Transactional(readOnly = true)
    public List<MemoryLaneDTO> getMemoryLane(LocalDate referenceDate) {
        if (referenceDate == null) {
            referenceDate = LocalDate.now();
        }

        List<Experience> allExperiences = experienceRepository.findAll();
        if (allExperiences.isEmpty()) {
            return Collections.emptyList();
        }

        List<MemoryLaneDTO> memories = new ArrayList<>();
        Set<Long> addedIds = new HashSet<>();

        // Sort by experienceDate ascending so we can identify chronological milestones
        List<Experience> sortedByDate = allExperiences.stream()
                .filter(e -> e.getExperienceDate() != null)
                .sorted(Comparator.comparing(Experience::getExperienceDate))
                .toList();

        // 1. Exact Day Anniversaries (e.g. Exactly 1, 2, 3... years ago today)
        for (Experience exp : sortedByDate) {
            LocalDate expDate = exp.getExperienceDate();
            if (expDate.isBefore(referenceDate)
                    && expDate.getMonth() == referenceDate.getMonth()
                    && expDate.getDayOfMonth() == referenceDate.getDayOfMonth()) {
                long yearsAgo = ChronoUnit.YEARS.between(expDate, referenceDate);
                long daysAgo = ChronoUnit.DAYS.between(expDate, referenceDate);
                String label = yearsAgo == 1 ? "1 Year Ago Today" : yearsAgo + " Years Ago Today";
                String prompt = "A milestone on this exact calendar day. Look at how much you've accomplished since!";

                memories.add(createMemoryDTO(exp, "EXACT_DAY_ANNIVERSARY", label, prompt, daysAgo, yearsAgo));
                addedIds.add(exp.getId());
            }
        }

        // 2. Same Month in Previous Years
        for (Experience exp : sortedByDate) {
            if (addedIds.contains(exp.getId())) continue;
            LocalDate expDate = exp.getExperienceDate();
            if (expDate.isBefore(referenceDate)
                    && expDate.getMonth() == referenceDate.getMonth()
                    && expDate.getYear() < referenceDate.getYear()) {
                long yearsAgo = referenceDate.getYear() - expDate.getYear();
                long daysAgo = ChronoUnit.DAYS.between(expDate, referenceDate);
                String monthName = expDate.getMonth().name().charAt(0) + expDate.getMonth().name().substring(1).toLowerCase();
                String label = yearsAgo + (yearsAgo == 1 ? " Year Ago in " : " Years Ago in ") + monthName;
                String prompt = "During this month, you made noteworthy strides in your personal journey.";

                memories.add(createMemoryDTO(exp, "SAME_MONTH_REFLECTION", label, prompt, daysAgo, yearsAgo));
                addedIds.add(exp.getId());
            }
        }

        // 3. Significant Milestones (e.g., First recorded milestone, standout 5-star experiences)
        if (!sortedByDate.isEmpty()) {
            Experience oldest = sortedByDate.get(0);
            if (!addedIds.contains(oldest.getId()) && ChronoUnit.DAYS.between(oldest.getExperienceDate(), referenceDate) >= 7) {
                long daysAgo = ChronoUnit.DAYS.between(oldest.getExperienceDate(), referenceDate);
                long yearsAgo = ChronoUnit.YEARS.between(oldest.getExperienceDate(), referenceDate);
                memories.add(createMemoryDTO(
                        oldest,
                        "ORIGIN_MILESTONE",
                        "The Genesis Experience",
                        "The very first experience you ever logged into LifeLog. Where your documented journey began.",
                        daysAgo,
                        yearsAgo
                ));
                addedIds.add(oldest.getId());
            }
        }

        // 4. Standout Flashbacks (Top rated 5-star memories from past months)
        for (Experience exp : sortedByDate) {
            if (addedIds.contains(exp.getId())) continue;
            if (exp.getRating() != null && exp.getRating() >= 5) {
                long daysAgo = ChronoUnit.DAYS.between(exp.getExperienceDate(), referenceDate);
                if (daysAgo >= 14) { // At least 2 weeks old
                    long yearsAgo = ChronoUnit.YEARS.between(exp.getExperienceDate(), referenceDate);
                    String label = daysAgo >= 365
                            ? (yearsAgo + " Years Ago Flashback")
                            : (daysAgo + " Days Ago Flashback");
                    memories.add(createMemoryDTO(
                            exp,
                            "STANDOUT_ACHIEVEMENT",
                            "5-Star Highlight: " + label,
                            "One of your highest rated moments. Remember the passion and dedication that made this shine.",
                            daysAgo,
                            yearsAgo
                    ));
                    addedIds.add(exp.getId());
                }
            }
            if (memories.size() >= 8) break; // Keep memory lane focused and impactful
        }

        return memories;
    }

    private MemoryLaneDTO createMemoryDTO(Experience exp, String memoryType, String label,
                                          String prompt, long daysAgo, long yearsAgo) {
        return new MemoryLaneDTO(
                exp.getId(),
                exp.getTitle(),
                exp.getCategory(),
                exp.getDescription(),
                exp.getLocation(),
                exp.getExperienceDate(),
                exp.getRating(),
                memoryType,
                label,
                prompt,
                daysAgo,
                yearsAgo
        );
    }
}
