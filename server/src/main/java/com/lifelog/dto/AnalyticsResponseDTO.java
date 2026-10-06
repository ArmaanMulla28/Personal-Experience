package com.lifelog.dto;

import com.lifelog.model.Experience;
import java.util.Map;

public class AnalyticsResponseDTO {

    private long totalExperiences;
    private double averageRating;
    private String mostCommonCategory;
    private long mostCommonCategoryCount;
    private String mostActiveMonth;
    private long mostActiveMonthCount;
    private Experience highestRatedExperience;
    private Map<String, Long> categoryDistribution;
    private Map<Integer, Long> ratingDistribution;
    private Map<String, Long> monthlyActivity;

    public AnalyticsResponseDTO() {
    }

    public AnalyticsResponseDTO(
            long totalExperiences,
            double averageRating,
            String mostCommonCategory,
            long mostCommonCategoryCount,
            String mostActiveMonth,
            long mostActiveMonthCount,
            Experience highestRatedExperience,
            Map<String, Long> categoryDistribution,
            Map<Integer, Long> ratingDistribution,
            Map<String, Long> monthlyActivity
    ) {
        this.totalExperiences = totalExperiences;
        this.averageRating = averageRating;
        this.mostCommonCategory = mostCommonCategory;
        this.mostCommonCategoryCount = mostCommonCategoryCount;
        this.mostActiveMonth = mostActiveMonth;
        this.mostActiveMonthCount = mostActiveMonthCount;
        this.highestRatedExperience = highestRatedExperience;
        this.categoryDistribution = categoryDistribution;
        this.ratingDistribution = ratingDistribution;
        this.monthlyActivity = monthlyActivity;
    }

    public long getTotalExperiences() {
        return totalExperiences;
    }

    public void setTotalExperiences(long totalExperiences) {
        this.totalExperiences = totalExperiences;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public String getMostCommonCategory() {
        return mostCommonCategory;
    }

    public void setMostCommonCategory(String mostCommonCategory) {
        this.mostCommonCategory = mostCommonCategory;
    }

    public long getMostCommonCategoryCount() {
        return mostCommonCategoryCount;
    }

    public void setMostCommonCategoryCount(long mostCommonCategoryCount) {
        this.mostCommonCategoryCount = mostCommonCategoryCount;
    }

    public String getMostActiveMonth() {
        return mostActiveMonth;
    }

    public void setMostActiveMonth(String mostActiveMonth) {
        this.mostActiveMonth = mostActiveMonth;
    }

    public long getMostActiveMonthCount() {
        return mostActiveMonthCount;
    }

    public void setMostActiveMonthCount(long mostActiveMonthCount) {
        this.mostActiveMonthCount = mostActiveMonthCount;
    }

    public Experience getHighestRatedExperience() {
        return highestRatedExperience;
    }

    public void setHighestRatedExperience(Experience highestRatedExperience) {
        this.highestRatedExperience = highestRatedExperience;
    }

    public Map<String, Long> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(Map<String, Long> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public Map<Integer, Long> getRatingDistribution() {
        return ratingDistribution;
    }

    public void setRatingDistribution(Map<Integer, Long> ratingDistribution) {
        this.ratingDistribution = ratingDistribution;
    }

    public Map<String, Long> getMonthlyActivity() {
        return monthlyActivity;
    }

    public void setMonthlyActivity(Map<String, Long> monthlyActivity) {
        this.monthlyActivity = monthlyActivity;
    }
}
