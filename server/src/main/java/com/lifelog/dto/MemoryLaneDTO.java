package com.lifelog.dto;

import java.time.LocalDate;

public class MemoryLaneDTO {

    private Long experienceId;
    private String title;
    private String category;
    private String description;
    private String location;
    private LocalDate experienceDate;
    private Integer rating;
    private String memoryType;
    private String milestoneLabel;
    private String reflectionPrompt;
    private long daysAgo;
    private long yearsAgo;

    public MemoryLaneDTO() {
    }

    public MemoryLaneDTO(Long experienceId, String title, String category, String description,
                         String location, LocalDate experienceDate, Integer rating,
                         String memoryType, String milestoneLabel, String reflectionPrompt,
                         long daysAgo, long yearsAgo) {
        this.experienceId = experienceId;
        this.title = title;
        this.category = category;
        this.description = description;
        this.location = location;
        this.experienceDate = experienceDate;
        this.rating = rating;
        this.memoryType = memoryType;
        this.milestoneLabel = milestoneLabel;
        this.reflectionPrompt = reflectionPrompt;
        this.daysAgo = daysAgo;
        this.yearsAgo = yearsAgo;
    }

    public Long getExperienceId() {
        return experienceId;
    }

    public void setExperienceId(Long experienceId) {
        this.experienceId = experienceId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getExperienceDate() {
        return experienceDate;
    }

    public void setExperienceDate(LocalDate experienceDate) {
        this.experienceDate = experienceDate;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getMemoryType() {
        return memoryType;
    }

    public void setMemoryType(String memoryType) {
        this.memoryType = memoryType;
    }

    public String getMilestoneLabel() {
        return milestoneLabel;
    }

    public void setMilestoneLabel(String milestoneLabel) {
        this.milestoneLabel = milestoneLabel;
    }

    public String getReflectionPrompt() {
        return reflectionPrompt;
    }

    public void setReflectionPrompt(String reflectionPrompt) {
        this.reflectionPrompt = reflectionPrompt;
    }

    public long getDaysAgo() {
        return daysAgo;
    }

    public void setDaysAgo(long daysAgo) {
        this.daysAgo = daysAgo;
    }

    public long getYearsAgo() {
        return yearsAgo;
    }

    public void setYearsAgo(long yearsAgo) {
        this.yearsAgo = yearsAgo;
    }
}
