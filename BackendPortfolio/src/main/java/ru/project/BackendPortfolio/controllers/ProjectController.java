package ru.project.BackendPortfolio.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.project.BackendPortfolio.dto.ProjectDTO;
import ru.project.BackendPortfolio.services.FileStorageService;
import ru.project.BackendPortfolio.services.ProjectService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final FileStorageService fileStorageService;

    @Autowired
    public ProjectController(ProjectService projectService, FileStorageService fileStorageService) {
        this.projectService = projectService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProject(@ModelAttribute ProjectDTO projectDTO) {
        var project = projectService.createProject(projectDTO);
        var newProjectDTO = projectService.mapToDTO(project);
        return ResponseEntity.ok(Map.of(
                "message", "Проект успешно создан",
                "project", newProjectDTO));
    }

    @GetMapping("/show")
    public Map<String, List<ProjectDTO>> getUserProjects() {
        var projects = projectService.getProjectsByUser();
        return Map.of("projects", projects);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProjectWithFile(@PathVariable int id, @ModelAttribute ProjectDTO projectDTO) {
        var updatedProject = projectService.updateProject(id, projectDTO);
        var newProjectDTO = projectService.mapToDTO(updatedProject);
        return ResponseEntity.ok(newProjectDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable int id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok("Проект успешно удалён");
    }

    @GetMapping("/image/{projectId}")
    public ResponseEntity<byte[]> getProjectImage(@PathVariable int projectId) {
        var project = projectService.getProjectById(projectId);

        if (project.getImageName() == null) {
            return ResponseEntity.notFound().build();
        }

        var imageBytes = fileStorageService.loadFileAsBytes(project.getImageName());
        return ResponseEntity.ok()
                .contentType(getMediaTypeFromFileName(project.getImageName()))
                .body(imageBytes);
    }

    private MediaType getMediaTypeFromFileName(String fileName) {
        if (fileName.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        } else {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
