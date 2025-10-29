package br.com.fiap.fintrack.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserRegistrationRequest {
    @Email(message = "field email must be a valid email address")
    @NotBlank(message = "field email is missing")
    private String email;

    @NotBlank(message = "field cpf is missing")
    @Size(min = 11, max = 14, message = "field cpf must contain between 11 and 14 characters")
    private String cpf;

    @NotBlank(message = "field birthDate is missing")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "field birthDate must be in DD-MM-YYYY format")
    private String birthDate;

    @NotBlank(message = "field password is missing")
    @Size(min = 6, message = "field password must contain at least 6 characters")
    private String password;

    public UserRegistrationRequest() {}

    public UserRegistrationRequest(String email, String cpf, String birthDate, String password) {
        this.email = email;
        this.cpf = cpf;
        this.birthDate = birthDate;
        this.password = password;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getBirthDate() { return birthDate; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
