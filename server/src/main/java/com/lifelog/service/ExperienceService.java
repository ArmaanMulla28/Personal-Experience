package com.lifelog.service;

import com.lifelog.dto.ExperienceRequestDTO;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    @Transactional(readOnly = true)
    public List<Experience> getAllExperiences() {
        return experienceRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public Optional<Experience> getExperienceById(Long id) {
        return experienceRepository.findById(id);
    }

    @Transactional
    public Experience createExperience(ExperienceRequestDTO dto) {
        Experience experience = new Experience(
                dto.getTitle(),
                dto.getCategory(),
                dto.getDescription(),
                dto.getLocation(),
                dto.getExperienceDate(),
                dto.getRating()
        );
        return experienceRepository.save(experience);
    }

    @Transactional
    public boolean deleteExperience(Long id) {
        if (experienceRepository.existsById(id)) {
            experienceRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
