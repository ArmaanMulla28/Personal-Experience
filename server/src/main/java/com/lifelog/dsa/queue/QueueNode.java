package com.lifelog.dsa.queue;

import com.lifelog.dsa.model.ExperienceItem;

/**
 * Node for custom FIFO Queue.
 */
public class QueueNode {

    private ExperienceItem data;
    private QueueNode next;

    public QueueNode(ExperienceItem data) {
        this.data = data;
        this.next = null;
    }

    public QueueNode(ExperienceItem data, QueueNode next) {
        this.data = data;
        this.next = next;
    }

    public ExperienceItem getData() {
        return data;
    }

    public void setData(ExperienceItem data) {
        this.data = data;
    }

    public QueueNode getNext() {
        return next;
    }

    public void setNext(QueueNode next) {
        this.next = next;
    }
}
