package ru.project.BackendPortfolio.dto;

import java.util.List;

public class TeamDTO {

    private int id;

    private String title;

    private int adminId;

    private List<PersonTeamDTO> persons;

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

    public List<PersonTeamDTO> getPersons() {
        return persons;
    }

    public void setPersons(List<PersonTeamDTO> persons) {
        this.persons = persons;
    }
}
