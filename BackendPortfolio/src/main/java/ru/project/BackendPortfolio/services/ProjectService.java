package ru.project.BackendPortfolio.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.ProjectDTO;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.models.Project;
import ru.project.BackendPortfolio.repositories.PeopleRepository;
import ru.project.BackendPortfolio.repositories.ProjectRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ModelMapper modelMapper;
    private final ProjectRepository projectRepository;
    private final PeopleRepository personRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public ProjectService(ModelMapper modelMapper, ProjectRepository projectRepository, PeopleRepository personRepository, FileStorageService fileStorageService) {
        this.modelMapper = modelMapper;
        this.projectRepository = projectRepository;
        this.personRepository = personRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public Project createProject(ProjectDTO projectDTO) {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        var person = personRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Project project = new Project();
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());
        project.setOwner(person);

        if (projectDTO.getImageFile() != null) {
            String fileName = fileStorageService.save(projectDTO.getImageFile());
            project.setImageName(fileName);
        }

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(int projectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<Person> person = personRepository.findByUsername(username);
        if (person.isEmpty()) {
            throw new RuntimeException("Пользователь не найден");
        }

        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            throw new RuntimeException("Проект не найден");
        }

        if (!project.get().getOwner().equals(person.get())) {
            throw new RuntimeException("Вы не можете удалить этот проект, так как он вам не принадлежит.");
        }

        projectRepository.delete(project.get());
    }

    @Transactional
    public Project updateProject(int projectId, String newTitle, String newDescription) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<Person> person = personRepository.findByUsername(username);
        if (person.isEmpty()) {
            throw new RuntimeException("Пользователь не найден");
        }

        var projectOptional = projectRepository.findById(projectId);
        if (projectOptional.isEmpty()) {
            throw new RuntimeException("Проект не найден");
        }

        var project = projectOptional.get();
        if (!project.getOwner().equals(person.get())) {
            throw new RuntimeException("Вы не можете редактировать этот проект, так как он вам не принадлежит.");
        }

        project.setTitle(newTitle);
        project.setDescription(newDescription);
        return projectRepository.save(project);
    }

    public List<ProjectDTO> getProjectsByUser(String username) {
        var person = personRepository.findByUsername(username);
        var projects = projectRepository.findByOwner(person.get());
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

    public Optional<Project> getProjectById(int projectId) {
        return projectRepository.findById(projectId);
    }

}
