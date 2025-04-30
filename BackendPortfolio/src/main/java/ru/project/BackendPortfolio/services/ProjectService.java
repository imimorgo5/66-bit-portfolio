package ru.project.BackendPortfolio.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.ProjectDTO;
import ru.project.BackendPortfolio.exceptions.ForbiddenException;
import ru.project.BackendPortfolio.models.Project;
import ru.project.BackendPortfolio.repositories.ProjectRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

    private final ModelMapper modelMapper;
    private final ProjectRepository projectRepository;
    private final FileStorageService fileStorageService;
    private final PersonService personService;
    private final ProjectLinkService projectLinkService;

    @Autowired
    public ProjectService(ModelMapper modelMapper, ProjectRepository projectRepository,
                          FileStorageService fileStorageService, PersonService personService,
                          ProjectLinkService projectLinkService) {
        this.modelMapper = modelMapper;
        this.projectRepository = projectRepository;
        this.fileStorageService = fileStorageService;
        this.personService = personService;
        this.projectLinkService = projectLinkService;
    }

    @Transactional
    public Project createProject(ProjectDTO projectDTO) {
        var person = personService.getActivePerson();
        var project = modelMapper.map(projectDTO, Project.class);
        project.setOwner(person);

        if (projectDTO.getImageFile() != null) {
            var fileName = fileStorageService.save(projectDTO.getImageFile());
            project.setImageName(fileName);
        }

        // Сначала сохраняем проект, чтобы получить его ID
        project = projectRepository.save(project);

        var newProjectLinks = projectDTO.getProjectLinks();
        if (newProjectLinks != null) {
            for (var newProjectLink : newProjectLinks) {
                projectLinkService.create(newProjectLink, project);
            }
        }

        return project;
    }


    @Transactional
    public void deleteProject(int projectId) {
        var person = personService.getActivePerson();
        var project = getProjectById(projectId);

        if (!project.getOwner().equals(person)) {
            throw new ForbiddenException("Вы не можете удалить этот проект, так как он вам не принадлежит.");
        }

        projectRepository.delete(project);
    }

    @Transactional
    public Project updateProject(int projectId, ProjectDTO projectDTO) {
        var person = personService.getActivePerson();
        var project = getProjectById(projectId);

        if (!project.getOwner().equals(person)) {
            throw new ForbiddenException("Вы не можете редактировать этот проект, так как он вам не принадлежит.");
        }

        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());

        if (projectDTO.getImageFile() != null) {
            var fileName = fileStorageService.save(projectDTO.getImageFile());
            project.setImageName(fileName);
        }

        var oldProjectLinks = project.getProjectLinks();
        if (oldProjectLinks != null) {
            for(var oldProjectLink : oldProjectLinks) {
                projectLinkService.delete(oldProjectLink);
            }
        }

        var newProjectLinks = projectDTO.getProjectLinks();
        if (newProjectLinks != null) {
            for(var newProjectLink : newProjectLinks) {
                projectLinkService.create(newProjectLink, project);
            }
        }

        return projectRepository.save(project);
    }

    public ProjectDTO getProjectDTOById(int id){
        var project = getProjectById(id);
        return mapToDTO(project);
    }

    public List<ProjectDTO> getProjectsByUser() {
        var person = personService.getActivePerson();
        var projects = projectRepository.findByOwner(person);
        List<ProjectDTO> projectDTOs = new ArrayList<>();
        for (var project : projects) {
            var projectDTO = mapToDTO(project);
            projectDTOs.add(projectDTO);
        }
        return projectDTOs;
    }

    public ProjectDTO mapToDTO(Project project) {
        return modelMapper.map(project, ProjectDTO.class);
    }

    public Project mapDTOToProject(ProjectDTO projectDTO) {
        return modelMapper.map(projectDTO, Project.class);
    }

    public Project getProjectById(int projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));
    }

}