package com.example.backend_spring_boot.payload.request;


public class LoginRequest {

    private String login;

	private String password;

	public String getUsername() {
		return login;
	}

	public void setUsername(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}