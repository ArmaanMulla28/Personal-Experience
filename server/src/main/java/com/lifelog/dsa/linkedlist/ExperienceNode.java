package com.lifelog.dsa.linkedlist;

import com.lifelog.dsa.model.ExperienceItem;

/**
 * Singly-linked list node holding an ExperienceItem and a pointer to next node.
 */
public class ExperienceNode {

    private ExperienceItem data;
    private ExperienceNode next;

    public ExperienceNode(ExperienceItem data) {
        this.data = data;
        this.next = null;
    }

    public ExperienceNode(ExperienceItem data, ExperienceNode next) {
        this.data = data;
        this.next = next;
    }

    public ExperienceItem getData() {
        return data;
    }

    public void setData(ExperienceItem data) {
        this.data = data;
    }

    public ExperienceNode getNext() {
        return next;
    }

    public void setNext(ExperienceNode next) {
        this.next = next;
    }
}
