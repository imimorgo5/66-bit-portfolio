package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;

@Entity
@Table(name = "project_link")
public class ProjectLink {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "project_id", referencedColumnName = "id")
    private Project project;

    @Column(name = "link")
    private String link;

    @Column(name = "description")
    private String description;

    public ProjectLink(int id, Project project, String link, String description) {
        this.id = id;
        this.project = project;
        this.link = link;
        this.description = description;
    }

    public ProjectLink() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
