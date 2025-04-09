package ru.project.BackendPortfolio.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
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

    public @NotEmpty(message = "Имя не должно быть пустым") @Size(min = 2, max = 100, message = "Имя должно быть от 2 до 100 символов длиной") String getUsername() {
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
