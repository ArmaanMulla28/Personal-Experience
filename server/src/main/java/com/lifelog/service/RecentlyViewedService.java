package com.lifelog.service;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.dsa.stack.ExperienceStack;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service integrating the Custom ExperienceStack (LIFO) for tracking recently viewed experiences.
 * Whenever a user opens or inspects an experience, it is pushed onto the top of the stack.
 */
@Service
public class RecentlyViewedService {

    private final ExperienceStack stack = new ExperienceStack();

    /**
     * Records a view of an experience by pushing it onto the top of the stack.
     * Prevents consecutive identical items from cluttering the top.
     */
    public synchronized void recordView(ExperienceItem item) {
        if (item == null || item.getId() == null) {
            return;
        }

        // Avoid consecutive duplicate at the top
        if (!stack.isEmpty() && item.getId().equals(stack.peek().getId())) {
            return;
        }

        // Rebuild stack to remove any older occurrence of this item so it appears at top
        List<ExperienceItem> existing = stack.traverse();
        stack.clear();

        // Push existing items except the current one in reverse order
        for (int i = existing.size() - 1; i >= 0; i--) {
            ExperienceItem old = existing.get(i);
            if (!item.getId().equals(old.getId())) {
                stack.push(old);
            }
        }

        // Push the freshly viewed item to the top
        stack.push(item);
    }

    /**
     * Retrieves up to 'limit' recently viewed experiences from the stack (most recent first).
     */
    public synchronized List<ExperienceItem> getRecentlyViewed(int limit) {
        List<ExperienceItem> all = stack.traverse();
        if (limit <= 0 || limit >= all.size()) {
            return all;
        }
        return new ArrayList<>(all.subList(0, limit));
    }

    /**
     * Clears all recorded view history.
     */
    public synchronized void clearHistory() {
        stack.clear();
    }

    /**
     * Returns the count of items currently in the recently viewed stack.
     */
    public synchronized int size() {
        return stack.size();
    }
}
