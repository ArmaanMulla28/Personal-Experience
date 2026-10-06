package com.lifelog.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class ExperienceRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    private String description;
    private String location;
    private LocalDate experienceDate;
    private Integer rating;

    public ExperienceRequestDTO() {
    }

    public ExperienceRequestDTO(String title, String category, String description, String location, LocalDate experienceDate, Integer rating) {
        this.title = title;
        this.category = category;
        this.description = description;
        this.location = location;
        this.experienceDate = experienceDate;
        this.rating = rating;
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
}
