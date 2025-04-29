package ru.project.BackendPortfolio.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.CardLinkDTO;
import ru.project.BackendPortfolio.dto.ProjectLinkDTO;
import ru.project.BackendPortfolio.models.Project;
import ru.project.BackendPortfolio.models.ProjectLink;
import ru.project.BackendPortfolio.repositories.ProjectLinkRepository;

@Service
public class ProjectLinkService {

    private final ProjectLinkRepository projectLinkRepository;

    @Autowired
    public ProjectLinkService(ProjectLinkRepository projectLinkRepository) {
        this.projectLinkRepository = projectLinkRepository;
    }

    @Transactional
    public ProjectLink create(ProjectLinkDTO projectLinkDTO, Project project){
        var projectLink = new ProjectLink();
        projectLink.setProject(project);
        projectLink.setDescription(projectLinkDTO.getDescription());
        projectLink.setLink(projectLinkDTO.getLink());
        return projectLinkRepository.save(projectLink);
    }

    @Transactional
    public void delete(ProjectLink projectLink){
        projectLinkRepository.delete(projectLink);
    }
}
