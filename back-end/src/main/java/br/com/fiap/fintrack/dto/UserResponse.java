package br.com.fiap.fintrack.dto;

import br.com.fiap.fintrack.model.User;

public class UserResponse {
    private String id;
    private String email;
    private String cpf;
    private String birthDate;
    private String createdAt;

    public UserResponse() {}

    public UserResponse(String id, String email, String cpf, String birthDate, String createdAt) {
        this.id = id;
        this.email = email;
        this.cpf = cpf;
        this.birthDate = birthDate;
        this.createdAt = createdAt;
    }

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getCpf(),
                user.getBirthDate(),
                user.getCreatedAt()
        );
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getBirthDate() { return birthDate; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
