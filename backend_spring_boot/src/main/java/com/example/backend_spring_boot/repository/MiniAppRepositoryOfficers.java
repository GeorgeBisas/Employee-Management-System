package com.example.backend_spring_boot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend_spring_boot.model.MiniApp.Officers;

import java.util.List;



public interface MiniAppRepositoryOfficers extends JpaRepository<Officers, Long> {
  List<Officers> findByAfm(String afm);
  List<Officers> findByFirstName(String firstName);
  List<Officers> findByLastName(String lastName);

 
  List<Officers> findByBusinessPartId(Long part_id);
  List<Officers> deleteByPartIdOfficer(Long part_id);
  List<Officers> findByBusinessPartsId(Long part_id);
  List<Officers> findByAfmOrFirstNameOrLastName(String afm, String firstName, String lastName);

  void deleteByBusinessPartId(Long part_id);
  boolean existsByAfm(String afm);
  boolean existsByFirstNameAndLastName(String firstName, String lastName);

}
