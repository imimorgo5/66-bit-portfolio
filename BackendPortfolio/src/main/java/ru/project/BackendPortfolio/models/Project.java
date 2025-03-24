package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

@Entity(name = "project")
public class Project {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    @NotEmpty(message = "Название не должно быть пустым")
    private String title;

    @Column(name = "description")
    @NotEmpty(message = "Название не должно быть пустым")
    private String description;

    @ManyToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id")
    private Person owner;

    public Project(String title, String description, int id, Person owner) {
        this.title = title;
        this.description = description;
        this.id = id;
        this.owner = owner;
    }

    public Project() {}

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

    public @NotEmpty(message = "Название не должно быть пустым") String getDescription() {
        return description;
    }

    public void setDescription(@NotEmpty(message = "Название не должно быть пустым") String description) {
        this.description = description;
    }

    public Person getOwner() {
        return owner;
    }

    public void setOwner(Person owner) {
        this.owner = owner;
    }
}
