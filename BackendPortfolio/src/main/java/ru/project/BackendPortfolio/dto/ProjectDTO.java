package ru.project.BackendPortfolio.dto;

import jakarta.validation.constraints.NotEmpty;
//import lombok.Getter;
//import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

//@Getter
//@Setter
public class ProjectDTO {

    private int id;

    @NotEmpty(message = "Название не должно быть пустым")
    private String title;

    private String description;

    private List<ProjectLinkDTO> projectLinks;

    private MultipartFile imageFile;

    private String imageName;

    private LocalDateTime createdAt;

    public List<ProjectLinkDTO> getProjectLinks() {
        return projectLinks;
    }

    public void setProjectLinks(List<ProjectLinkDTO> projectLinks) {
        this.projectLinks = projectLinks;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public @NotEmpty(message = "Название не должно быть пустым") String getTitle() {
        return title;
    }

    public void setTitle(@NotEmpty(message = "Название не должно быть пустым") String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MultipartFile getImageFile() {
        return imageFile;
    }

    public void setImageFile(MultipartFile imageFile) {
        this.imageFile = imageFile;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
