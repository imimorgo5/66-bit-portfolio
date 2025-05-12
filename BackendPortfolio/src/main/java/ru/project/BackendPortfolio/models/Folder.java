package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "folder")
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title")
    private String title;

    @ManyToOne
    @JoinColumn(name = "project_id", referencedColumnName = "id")
    private Project project;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectFile> files = new ArrayList<ProjectFile>();

    public Folder() {}

    public Folder(int id, String title, Project project, List<ProjectFile> files) {
        this.id = id;
        this.title = title;
        this.project = project;
        this.files = files;
    }

    public void addFile(ProjectFile file) {
        files.add(file);
        file.setFolder(this);
    }

    public void removeFile(ProjectFile file) {
        files.remove(file);
        file.setFolder(null);
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public List<ProjectFile> getFiles() {
        return files;
    }

    public void setFiles(List<ProjectFile> files) {
        this.files = files;
    }
}
