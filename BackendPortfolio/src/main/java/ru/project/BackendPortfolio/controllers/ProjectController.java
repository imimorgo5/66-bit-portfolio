package ru.project.BackendPortfolio.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.project.BackendPortfolio.dto.ProjectDTO;
import ru.project.BackendPortfolio.models.Project;
import ru.project.BackendPortfolio.repositories.ProjectRepository;
import ru.project.BackendPortfolio.services.FileStorageService;
import ru.project.BackendPortfolio.services.ProjectService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectRepository projectRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public ProjectController(ProjectService projectService, ProjectRepository projectRepository, FileStorageService fileStorageService) {
        this.projectService = projectService;
        this.projectRepository = projectRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/show")
    public Map<String, List<ProjectDTO>> getUserProjects() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var username = authentication.getName();
        var projects = projectService.getProjectsByUser(username);
        return Map.of("projects", projects);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProject(@ModelAttribute ProjectDTO projectDTO) {
        var project = projectService.createProject(projectDTO);
        var newProjectDTO = projectService.mapToDTO(project);
        return ResponseEntity.ok(Map.of(
                "message", "Проект успешно создан",
                "project", newProjectDTO));
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProjectWithFile(@PathVariable int id, @ModelAttribute ProjectDTO projectDTO) {
        var updatedProject = projectService.updateProject(id, projectDTO.getTitle(), projectDTO.getDescription());
        if (projectDTO.getImageFile() != null) {
            String fileName = fileStorageService.saveFile(projectDTO.getImageFile());
            updatedProject.setImageName(fileName);
        }
        var newProjectDTO = projectService.mapToDTO(projectRepository.save(updatedProject));
        return ResponseEntity.ok(newProjectDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable int id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok("Проект успешно удалён");
    }

    @GetMapping("/image/{projectId}")
    public ResponseEntity<byte[]> getProjectImage(@PathVariable int projectId) {
        var project = projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

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
