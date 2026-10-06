package com.lifelog.service;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.dsa.priorityqueue.ExperienceMaxHeap;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service integrating the Custom ExperienceMaxHeap (Priority Queue)
 * to retrieve and rank the user's highest-impact experiences.
 */
@Service
public class ExperienceRankingService {

    private final ExperienceRepository experienceRepository;

    public ExperienceRankingService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    /**
     * Builds an ExperienceMaxHeap using Floyd's algorithm in O(n) time,
     * then extracts the top 'count' experiences in descending order of rating.
     */
    public List<ExperienceItem> getTopExperiences(int count) {
        if (count <= 0) {
            count = 5;
        }

        List<Experience> entities = experienceRepository.findAll();
        ExperienceItem[] array = entities.stream()
                .map(ExperienceItem::fromEntity)
                .toArray(ExperienceItem[]::new);

        ExperienceMaxHeap heap = new ExperienceMaxHeap(array.length);
        heap.buildHeap(array);

        List<ExperienceItem> top = new ArrayList<>();
        int extractLimit = Math.min(count, heap.size());
        for (int i = 0; i < extractLimit; i++) {
            top.add(heap.extractMax());
        }
        return top;
    }
}
