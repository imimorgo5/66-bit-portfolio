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

    // Создание проекта от имени пользователя (автоматически подставляет авторизованного пользователя)
    @PostMapping(value = "/create-by-person", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProjectByPerson(@ModelAttribute ProjectDTO projectDTO) {
        var newProjectDTO = projectService.createByPerson(projectDTO);
        return ResponseEntity.ok(Map.of("project", newProjectDTO));
    }

    // Создание проекта от имени команды (необходимо передавать teamId для корректного формирования связи)
    @PostMapping(value = "/create-by-team", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProjectByTeam(@ModelAttribute ProjectDTO projectDTO) {
        var newProjectDTO = projectService.createByTeam(projectDTO);
        return ResponseEntity.ok(Map.of("project", newProjectDTO));
    }

    // Получение командных проектов по id команды
    @GetMapping("/show-by-team/{id}")
    public ResponseEntity<?> getByTeam(@PathVariable("id") int id){
        var projectDTOs = projectService.getAllProjectsByTeam(id);
        return ResponseEntity.ok(Map.of("projects", projectDTOs));
    }

    // Получение проектов текущего пользователя
    @GetMapping("/show-by-person")
    public Map<String, List<ProjectDTO>> getUserProjects() {
        var projects = projectService.getProjectsByUser();
        return Map.of("projects", projects);
    }

    // Получение проекта по id
    @GetMapping("/project/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable("id") int id) {
        var project = projectService.getProjectDTOById(id);
        return ResponseEntity.ok(Map.of("project", project));
    }

    // Обновление проекта (независимо от того, командная она или пользовательская)
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProjectWithFile(@PathVariable("id") int id, @ModelAttribute ProjectDTO projectDTO) {
        var updatedProject = projectService.updateProject(id, projectDTO);
        var newProjectDTO = projectService.mapToDTO(updatedProject);
        return ResponseEntity.ok(newProjectDTO);
    }

    // Удаление проекта
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable("id") int id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok("Проект успешно удалён");
    }

    // НЕ ИСПОЛЬЗУЕТСЯ

//    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<?> createProject(@ModelAttribute ProjectDTO projectDTO) {
//        var project = projectService.createProject(projectDTO);
//        var newProjectDTO = projectService.mapToDTO(project);
//        return ResponseEntity.ok(Map.of(
//                "message", "Проект успешно создан",
//                "project", newProjectDTO));
//    }

    @GetMapping("/image/{projectId}")
    public ResponseEntity<byte[]> getProjectImage(@PathVariable("projectId") int projectId) {
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
