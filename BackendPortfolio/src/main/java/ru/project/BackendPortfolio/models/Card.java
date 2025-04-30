package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "card")
public class Card {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    @NotEmpty(message = "Название не должно быть пустым")
    private String title;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "card")
    private List<CardFile> cardFiles;

    @OneToMany(mappedBy = "card")
    private List<CardLink> cardLinks;

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectCard> projectCards = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "card_links", joinColumns = @JoinColumn(name = "card_id"))
    @Column(name = "link")
    private List<String> links = new ArrayList<>();

    @Column(name = "created_at", updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id")
    private Person owner;

    public Card() {
    }

    public Card(int id, String title, String description, Person owner, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.owner = owner;
        this.createdAt = createdAt;
    }

    public List<ProjectCard> getProjectCards() {
        return projectCards;
    }

    public void setProjectCards(List<ProjectCard> projectCards) {
        this.projectCards = projectCards;
    }

    public List<CardLink> getCardLinks() {
        return cardLinks;
    }

    public void setCardLinks(List<CardLink> cardLinks) {
        this.cardLinks = cardLinks;
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

    public Person getOwner() {
        return owner;
    }

    public void setOwner(Person owner) {
        this.owner = owner;
    }

    public List<String> getLinks() {
        return links;
    }

    public void setLinks(List<String> links) {
        this.links = links;
    }

    public List<CardFile> getCardFiles() {
        return cardFiles;
    }

    public void setCardFiles(List<CardFile> cardFiles) {
        this.cardFiles = cardFiles;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
