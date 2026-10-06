package com.lifelog.service;

import com.lifelog.dsa.bst.ExperienceBST;
import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service integrating the Custom ExperienceBST (Binary Search Tree)
 * for fast numeric ID-based lookup and tree traversal analytics.
 */
@Service
public class ExperienceSearchService {

    private final ExperienceRepository experienceRepository;
    private final ExperienceBST bst = new ExperienceBST();

    public ExperienceSearchService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    /**
     * Synchronizes and rebuilds the BST from current database experiences.
     */
    public synchronized void reindex() {
        bst.clear();
        List<Experience> all = experienceRepository.findAll();
        for (Experience exp : all) {
            bst.insert(ExperienceItem.fromEntity(exp));
        }
    }

    /**
     * Searches for an experience by its numeric ID using the custom BST.
     * Operates in average O(log n) time.
     */
    public synchronized ExperienceItem searchById(Long id) {
        if (id == null) {
            return null;
        }
        ExperienceItem found = bst.search(id);
        if (found == null) {
            // Re-check database if not yet in cache
            experienceRepository.findById(id).ifPresent(exp -> {
                ExperienceItem item = ExperienceItem.fromEntity(exp);
                bst.insert(item);
            });
            found = bst.search(id);
        }
        return found;
    }

    /**
     * Inserts/updates an experience in the BST index.
     */
    public synchronized void indexExperience(ExperienceItem item) {
        if (item != null) {
            bst.insert(item);
        }
    }

    /**
     * Deletes an experience from the BST index.
     */
    public synchronized boolean deleteFromIndex(Long id) {
        return id != null && bst.delete(id);
    }

    /**
     * Returns all experiences sorted ascending by ID via In-Order BST traversal.
     */
    public synchronized List<ExperienceItem> getInorderList() {
        if (bst.isEmpty()) {
            reindex();
        }
        return bst.inorderTraversal();
    }

    /**
     * Returns structural metrics of the custom Binary Search Tree.
     */
    public synchronized Map<String, Object> getBSTStats() {
        if (bst.isEmpty()) {
            reindex();
        }
        Map<String, Object> stats = new HashMap<>();
        stats.put("size", bst.size());
        stats.put("height", bst.height());
        stats.put("isEmpty", bst.isEmpty());
        ExperienceItem min = bst.findMin();
        ExperienceItem max = bst.findMax();
        stats.put("minId", min != null ? min.getId() : null);
        stats.put("maxId", max != null ? max.getId() : null);
        return stats;
    }

    public synchronized ExperienceBST getBst() {
        return bst;
    }
}
