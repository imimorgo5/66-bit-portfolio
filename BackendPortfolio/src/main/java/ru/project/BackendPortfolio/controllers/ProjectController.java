package ru.project.BackendPortfolio.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.project.BackendPortfolio.dto.ProjectDTO;
import ru.project.BackendPortfolio.services.ProjectService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/show")
    public Map<String, List<ProjectDTO>> getUserProjects() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var username = authentication.getName();
        var projects = projectService.getProjectsByUser(username);
        return Map.of("projects", projects);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProject(@Validated @RequestBody ProjectDTO projectDTO) {
        var project = projectService.mapDTOToProject(projectDTO);
        var createdProject = projectService.createProject(project);
        var newProjectDTO = projectService.mapToDTO(createdProject);
        return ResponseEntity.ok(Map.of(
                "message", "Проект успешно создан",
                "project", newProjectDTO));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProject(@PathVariable int id, @Validated @RequestBody ProjectDTO projectDTO) {
        var updatedProject = projectService.updateProject(id, projectDTO.getTitle(), projectDTO.getDescription());
        var newProjectDTO = projectService.mapToDTO(updatedProject);
        return ResponseEntity.ok(newProjectDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable int id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok("Проект успешно удалён");
    }
}
