package ru.project.BackendPortfolio.dto;

import org.springframework.web.multipart.MultipartFile;

public class ProjectFileDTO {

    private String fileTitle;

    private String description;

    private MultipartFile file;

    public String getFileTitle() {
        return fileTitle;
    }

    public void setFileTitle(String fileTitle) {
        this.fileTitle = fileTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
