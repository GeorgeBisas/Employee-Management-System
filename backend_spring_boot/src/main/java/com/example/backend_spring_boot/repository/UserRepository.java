package com.example.backend_spring_boot.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend_spring_boot.model.MiniApp.Users;


import java.util.Optional;

import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
  Optional<Users> findByUsername(String login);

  Boolean existsByUsername(String login);

  Boolean existsByPassword(String password);
}