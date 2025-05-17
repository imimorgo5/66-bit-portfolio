package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "team")
public class Team {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "admin_id")
    private int adminId;

    @OneToMany(mappedBy = "team")
    private List<Card> cards;

    @OneToMany(mappedBy = "team")
    private List<Project> projects;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonTeam> personTeams = new ArrayList<>();

    public Team(int id, String title, List<PersonTeam> personTeams) {
        this.id = id;
        this.title = title;
        this.personTeams = personTeams;
    }

    public Team() {}

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<Card> getCards() {
        return cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }

    public int getAdminId() {
        return adminId;
    }

    public void setAdminId(int adminId) {
        this.adminId = adminId;
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

    public List<PersonTeam> getPersonTeams() {
        return personTeams;
    }

    public void setPersonTeams(List<PersonTeam> personTeams) {
        this.personTeams = personTeams;
    }
}
