package ru.project.BackendPortfolio.dto;

import java.util.List;

public class CreateTeamDTO {

    private String title;

    private String myRole;

    private List<PersonTeamDTO> persons;

    public String getMyRole() {
        return myRole;
    }

    public void setMyRole(String myRole) {
        this.myRole = myRole;
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
