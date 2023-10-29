package com.example.backend_spring_boot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend_spring_boot.model.MiniApp.BusinessParts;

import java.util.List;

    

public interface MiniAppRepositoryBusiness extends JpaRepository<BusinessParts, Long> {
  
  List<BusinessParts> findByName(String name);
  boolean existsByName(String departmentName);

}


    
