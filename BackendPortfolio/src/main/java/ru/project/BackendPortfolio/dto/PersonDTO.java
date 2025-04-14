package ru.project.BackendPortfolio.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
//import lombok.Getter;
//import lombok.Setter;

//@Getter
//@Setter
public class PersonDTO {

    @NotEmpty(message = "Имя не должно быть пустым")
    @Size(min = 2, max = 100, message = "Имя должно быть от 2 до 100 символов длиной")
    private String username;

    @Email(message = "Введите корректный Email")
    private String email;

    private String password;

    private String imageName;

    private MultipartFile imageFile;

    private String phoneNumber;

    private String birthDate;

    private List<ProjectDTO> projectDTOs;

    private List<CardDTO> cardDTOs;

    public List<CardDTO> getCardDTOs() {
        return cardDTOs;
    }

    public void setCardDTOs(List<CardDTO> cardDTOs) {
        this.cardDTOs = cardDTOs;
    }

    public List<ProjectDTO> getProjectDTOs() {
        return projectDTOs;
    }

    public void setProjectDTOs(List<ProjectDTO> projectDTOs) {
        this.projectDTOs = projectDTOs;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public MultipartFile getImageFile() {
        return imageFile;
    }

    public void setImageFile(MultipartFile imageFile) {
        this.imageFile = imageFile;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(@NotEmpty(message = "Имя не должно быть пустым") @Size(min = 2, max = 100, message = "Имя должно быть от 2 до 100 символов длиной") String username) {
        this.username = username;
    }

    public @Email(message = "Введите корректный Email") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Введите корректный Email") String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
