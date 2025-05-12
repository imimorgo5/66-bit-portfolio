package ru.project.BackendPortfolio.dto;

import java.util.List;

public class FolderDTO {
    private String title;
    private List<ProjectFileDTO> files;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<ProjectFileDTO> getFiles() {
        return files;
    }

    public void setFiles(List<ProjectFileDTO> files) {
        this.files = files;
    }
}

