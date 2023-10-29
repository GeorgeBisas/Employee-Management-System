package com.example.backend_spring_boot.payload.response;

public class JwtResponse {
  private String token;
  private String type = "";
  private Long id;
  private String login;


  public JwtResponse(String accessToken, Long id, String login) {
    this.token = accessToken;
    this.id = id;
    this.login = login;

  }

  public String getAccessToken() {
    return token;
  }

  public void setAccessToken(String accessToken) {
    this.token = accessToken;
  }

  public String getTokenType() {
    return type;
  }

  public void setTokenType(String tokenType) {
    this.type = tokenType;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return login;
  }

  public void setUsername(String login) {
    this.login = login;
  }

}