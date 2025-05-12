package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;

@Entity
@Table(name = "project_file")
public class ProjectFile {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "description")
    private String description;

    @Column(name = "file_title")
    private String fileTitle;

    @ManyToOne
    @JoinColumn(name = "folder_id", referencedColumnName = "id")
    private Folder folder;

    public ProjectFile() {}

    public ProjectFile(int id, String description, String fileTitle, Folder folder) {
        this.id = id;
        this.description = description;
        this.fileTitle = fileTitle;
        this.folder = folder;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileTitle() {
        return fileTitle;
    }

    public void setFileTitle(String fileTitle) {
        this.fileTitle = fileTitle;
    }

    public Folder getFolder() {
        return folder;
    }

    public void setFolder(Folder folder) {
        this.folder = folder;
    }
}
