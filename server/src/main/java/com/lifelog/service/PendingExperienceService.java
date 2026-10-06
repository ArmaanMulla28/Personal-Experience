package com.lifelog.service;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.dsa.queue.ExperienceQueue;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service integrating the Custom ExperienceQueue (FIFO) for pending experiences
 * that require documentation, follow-up, or review.
 */
@Service
public class PendingExperienceService {

    private final ExperienceQueue queue = new ExperienceQueue();
    private final AtomicLong pendingIdGenerator = new AtomicLong(10000);

    /**
     * Enqueues a pending experience at the rear of the FIFO queue.
     */
    public synchronized void enqueuePending(ExperienceItem item) {
        if (item == null) {
            return;
        }
        if (item.getId() == null) {
            item.setId(pendingIdGenerator.incrementAndGet());
        }
        queue.enqueue(item);
    }

    /**
     * Dequeues and returns the next pending experience in FIFO order.
     */
    public synchronized ExperienceItem dequeueNext() {
        if (queue.isEmpty()) {
            return null;
        }
        try {
            return queue.dequeue();
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    /**
     * Inspects the next pending experience without removing it.
     */
    public synchronized ExperienceItem peekNext() {
        if (queue.isEmpty()) {
            return null;
        }
        try {
            return queue.peek();
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    /**
     * Returns all pending experiences in FIFO order.
     */
    public synchronized List<ExperienceItem> getAllPending() {
        return queue.traverse();
    }

    /**
     * Removes a pending experience by ID from the queue by rebuilding without that ID.
     */
    public synchronized boolean deletePendingById(Long id) {
        if (id == null || queue.isEmpty()) {
            return false;
        }
        List<ExperienceItem> items = queue.traverse();
        boolean found = false;
        queue.clear();
        for (ExperienceItem item : items) {
            if (id.equals(item.getId())) {
                found = true;
            } else {
                queue.enqueue(item);
            }
        }
        return found;
    }

    public synchronized int size() {
        return queue.size();
    }

    public synchronized boolean isEmpty() {
        return queue.isEmpty();
    }

    public synchronized void clear() {
        queue.clear();
    }
}
