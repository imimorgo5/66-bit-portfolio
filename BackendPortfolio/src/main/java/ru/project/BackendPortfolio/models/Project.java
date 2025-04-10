package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
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
    @NotEmpty(message = "Описание не должно быть пустым")
    private String description;

    @Column(name = "image_name")
    private String imageName;

    @Column(name = "created_at", updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id")
    private Person owner;

    public Project(int id, String title, String description, String imageName, LocalDateTime createdAt, Person owner) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageName = imageName;
        this.createdAt = createdAt;
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

    public Person getOwner() {
        return owner;
    }

    public void setOwner(Person owner) {
        this.owner = owner;
    }
}
