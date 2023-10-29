package com.example.backend_spring_boot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend_spring_boot.exception.ResourceNotFoundException;
import com.example.backend_spring_boot.model.MiniApp.BusinessParts;
import com.example.backend_spring_boot.model.MiniApp.Officers;
import com.example.backend_spring_boot.repository.MiniAppRepositoryBusiness;
import com.example.backend_spring_boot.repository.MiniAppRepositoryOfficers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins ="*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class MiniAppController {

    @Autowired
    private MiniAppRepositoryOfficers officerRepository;

    @Autowired
    private MiniAppRepositoryBusiness businessRepository;

    // Get all officers with optional filtering by afm, firstName, and lastName
	@GetMapping("/officers")
    public ResponseEntity<List<Officers>> searchOfficers(
    @RequestParam(required = false) String afm,
    @RequestParam(required = false) String firstName,
    @RequestParam(required = false) String lastName) {

    List<Officers> officers = new ArrayList<Officers>();

    // Check if any of the search criteria are provided
    if (afm != null || firstName != null || lastName != null) {
        // Fetch officers based on the provided criteria
        officers = officerRepository.findByAfmOrFirstNameOrLastName(
            afm != null ? afm : "",
            firstName != null ? firstName : "",
            lastName != null ? lastName : ""
        );
    } else {
        // No search criteria provided, fetch all officers
        officerRepository.findAll().forEach(officers::add);
    }

    return ResponseEntity.ok(officers);
    }

    // Get all employees by business department id
    @GetMapping("/business_parts/{part_id}/officers")
    public ResponseEntity<List<Officers>> getAllOfficersByBusinessPartId(@PathVariable Long part_id) {
        if (!businessRepository.existsById(part_id)) {
            throw new ResourceNotFoundException("BusinessPart not found with id: " + part_id);
        }

        List<Officers> officers = officerRepository.findByBusinessPartId(part_id);
        return ResponseEntity.ok(officers);
    }

    // Create an officer
    @PostMapping("/officers")
    public ResponseEntity<Officers> createOfficer(@RequestBody Officers officer) {
        Officers savedOfficer = officerRepository.save(officer);
        return new ResponseEntity<>(savedOfficer, HttpStatus.CREATED);
    }

    // Create an officer within a business department
    @PostMapping("/business_parts/{part_id}/officers")
    public ResponseEntity<Officers> createOfficerWithinBusinessPart(
            @PathVariable Long part_id,
            @RequestBody Officers officerRequest) {

        Optional<BusinessParts> businessPart = businessRepository.findById(part_id);

        if (businessPart.isPresent()) {
            BusinessParts businessParts = businessPart.get();
            officerRequest.setBusinessParts(businessParts);
            Officers savedOfficer = officerRepository.save(officerRequest);
            return new ResponseEntity<>(savedOfficer, HttpStatus.CREATED);
        } else {
            throw new ResourceNotFoundException("BusinessPart not found with id: " + part_id);
        }
    }

    // Get an officer by ID
    @GetMapping("/officers/{id}")
    public ResponseEntity<Officers> getOfficerById(@PathVariable Long id) {
        Officers officer = officerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + id));
        return ResponseEntity.ok(officer);
    }

    // Update an officer
    @PutMapping("/officers/{id}")
    public ResponseEntity<Officers> updateOfficer(@PathVariable Long id, @RequestBody Officers officerDetails) {
        Officers officer = officerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + id));

        officer.setAfm(officerDetails.getAfm());
        officer.setFirstName(officerDetails.getFirstName());
        officer.setLastName(officerDetails.getLastName());
        officer.setDateOfBirth(officerDetails.getDateOfBirth());

        Officers updatedOfficer = officerRepository.save(officer);
        return ResponseEntity.ok(updatedOfficer);
    }

    // Delete an officer
    @DeleteMapping("/officers/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteOfficer(@PathVariable Long id) {
        Officers officer = officerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + id));

        officerRepository.delete(officer);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    // Delete all officers within a business department
    @DeleteMapping("/business_parts/{part_id}/officers")
    public ResponseEntity<Void> deleteAllOfficersByBusinessPart(@PathVariable Long part_id) {
        if (!businessRepository.existsById(part_id)) {
            throw new ResourceNotFoundException("BusinessPart not found with id: " + part_id);
        }

        officerRepository.deleteByBusinessPartId(part_id);
        return ResponseEntity.noContent().build();
    }

    // BusinessParts Controller


    // Get all business parts
    @GetMapping("/business_parts")
    public ResponseEntity<List<BusinessParts>> getAllBusinessParts() {
        List<BusinessParts> businessParts = businessRepository.findAll();
        return ResponseEntity.ok(businessParts);
    }

    // Create a business part
    @PostMapping("/business_parts")
    public ResponseEntity<BusinessParts> createBusinessParts(@RequestBody BusinessParts businessParts) {
        BusinessParts savedBusinessPart = businessRepository.save(businessParts);
        return new ResponseEntity<>(savedBusinessPart, HttpStatus.CREATED);
    }

    // Get a business part by ID
    @GetMapping("/business_parts/{part_id}")
    public ResponseEntity<BusinessParts> getBusinessPartsById(@PathVariable Long part_id) {
        BusinessParts businessPart = businessRepository.findById(part_id)
                .orElseThrow(() -> new ResourceNotFoundException("BusinessPart not found with id: " + part_id));
        return ResponseEntity.ok(businessPart);
    }

    // Update a business part
    @PutMapping("/business_parts/{part_id}")
    public ResponseEntity<BusinessParts> updateBusinessParts(
            @PathVariable Long part_id, @RequestBody BusinessParts businessDetails) {

        BusinessParts businessPart = businessRepository.findById(part_id)
                .orElseThrow(() -> new ResourceNotFoundException("BusinessPart not found with id: " + part_id));

        businessPart.setName(businessDetails.getName());
        BusinessParts updatedBusinessPart = businessRepository.save(businessPart);
        return ResponseEntity.ok(updatedBusinessPart);
    }

    // Delete a business part
    @DeleteMapping("/business_parts/{part_id}")
    public ResponseEntity<Map<String, Boolean>> deleteBusinessParts(@PathVariable Long part_id) {
        BusinessParts businessPart = businessRepository.findById(part_id)
                .orElseThrow(() -> new ResourceNotFoundException("BusinessPart not found with id: " + part_id));

        businessRepository.delete(businessPart);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/business_parts/check/{departmentName}")
    public ResponseEntity<Boolean> checkDepartmentNameExists(@PathVariable String departmentName) {
        boolean exists = businessRepository.existsByName(departmentName);
        return ResponseEntity.ok(exists);
    }

    // Check AFM uniqueness
    @GetMapping("/officers/check-afm-unique")
    public ResponseEntity<Boolean> checkAfmUniqueness(@RequestParam String afm) {
        boolean isUnique = !officerRepository.existsByAfm(afm);
        return ResponseEntity.ok(isUnique);
    }

    // Check first/last name uniqueness
    @GetMapping("/officers/check-name-unique")
    public ResponseEntity<Boolean> checkNameUniqueness(
        @RequestParam String firstName, @RequestParam String lastName) {
        boolean isUnique = !officerRepository.existsByFirstNameAndLastName(firstName, lastName);
        return ResponseEntity.ok(isUnique);
    }


}
