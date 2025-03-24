package ru.project.BackendPortfolio.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.project.BackendPortfolio.dto.ProjectDTO;
import ru.project.BackendPortfolio.models.Project;
import ru.project.BackendPortfolio.repositories.PeopleRepository;
import ru.project.BackendPortfolio.services.ProjectService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final PeopleRepository personRepository;

    @Autowired
    public ProjectController(ProjectService projectService, PeopleRepository personRepository) {
        this.projectService = projectService;
        this.personRepository = personRepository;
    }

    @GetMapping("/show")
    public Map<String, List<ProjectDTO>> getUserProjects() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var username = authentication.getName();
        var person = personRepository.findByUsername(username);
        var projects = projectService.getProjectsByUser(person.get());

        List<ProjectDTO> projectDTOs = new ArrayList<>();
        for (var project : projects) {
            var projectDTO = new ProjectDTO();
            projectDTO.setTitle(project.getTitle());
            projectDTO.setDescription(project.getDescription());
            projectDTOs.add(projectDTO);
        }

        return Map.of("projects", projectDTOs);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProject(@Validated @RequestBody ProjectDTO projectDTO) {
        var project = new Project();
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());

        var createdProject = projectService.createProject(project);
        var newProjectDTO = new ProjectDTO();
        newProjectDTO.setTitle(createdProject.getTitle());
        newProjectDTO.setDescription(createdProject.getDescription());

        return ResponseEntity.ok(Map.of(
                "message", "Проект успешно создан",
                "project", newProjectDTO));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProject(@PathVariable int id, @Validated @RequestBody ProjectDTO projectDTO) {
        try {
            var updatedProject = projectService.updateProject(id, projectDTO.getTitle(), projectDTO.getDescription());
            var newProjectDTO = new ProjectDTO();
            newProjectDTO.setTitle(updatedProject.getTitle());
            newProjectDTO.setDescription(updatedProject.getDescription());

            return ResponseEntity.ok(newProjectDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable int id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok("Проект успешно удалён");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
