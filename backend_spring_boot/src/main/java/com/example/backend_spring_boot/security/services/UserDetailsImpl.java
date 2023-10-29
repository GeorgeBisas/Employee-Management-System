package com.example.backend_spring_boot.security.services;

import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.example.backend_spring_boot.model.MiniApp.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String login;

    @JsonIgnore
    private String password;

    public UserDetailsImpl(Long id, String login, String password) {
        this.id = id;
        this.login = login;
        this.password = password;
    }

    public static UserDetailsImpl build(Users user) {
        return new UserDetailsImpl(
            user.getId(),
            user.getUsername(),
            user.getPassword()
        );
    }

    public Long getId() {
        return id;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // In this example, we provide a single role named "ROLE_USER" to the user.
        return Collections.singletonList(new SimpleGrantedAuthority("USER"));
    }
}
