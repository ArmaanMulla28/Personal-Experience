package com.lifelog.service;

import com.lifelog.dsa.linkedlist.CustomLinkedList;
import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service integrating the CustomLinkedList data structure for experience timelines.
 * Chronologically orders experiences and manages timeline traversal, lookup, and deletion.
 */
@Service
public class TimelineService {

    private final ExperienceRepository experienceRepository;

    public TimelineService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    /**
     * Builds and returns a CustomLinkedList populated with experiences from the database,
     * ordered chronologically (most recent first).
     */
    public CustomLinkedList buildTimeline() {
        List<Experience> entities = experienceRepository.findAll();
        List<ExperienceItem> items = entities.stream()
                .map(ExperienceItem::fromEntity)
                .sorted(Comparator.comparing(
                        ExperienceItem::getDate,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .collect(Collectors.toList());

        CustomLinkedList linkedList = new CustomLinkedList();
        for (ExperienceItem item : items) {
            linkedList.insertAtEnd(item);
        }
        return linkedList;
    }

    /**
     * Returns an ordered list of experiences by traversing the custom linked list.
     */
    public List<ExperienceItem> getTimeline() {
        CustomLinkedList timeline = buildTimeline();
        return timeline.traverse();
    }

    /**
     * Searches the custom linked list timeline for an experience with the specified ID.
     */
    public ExperienceItem searchTimeline(Long id) {
        CustomLinkedList timeline = buildTimeline();
        return timeline.searchById(id);
    }

    /**
     * Deletes an experience from the timeline (both in custom linked list and repository).
     */
    public boolean deleteFromTimeline(Long id) {
        CustomLinkedList timeline = buildTimeline();
        boolean removedFromList = timeline.deleteById(id);
        if (experienceRepository.existsById(id)) {
            experienceRepository.deleteById(id);
            return true;
        }
        return removedFromList;
    }
}
