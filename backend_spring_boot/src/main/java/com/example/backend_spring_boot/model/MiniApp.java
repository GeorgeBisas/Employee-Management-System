package com.example.backend_spring_boot.model;

import java.util.Date;
import java.util.List;
import java.util.Set;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;

import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.persistence.CascadeType;

public class MiniApp {
    

    @Entity
    @Table(name = "departments")
    public class BusinessParts {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private long part_id;

        @Column(name = "name")
        private String name;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "id", nullable = false)
        private Officers officers;
        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "id", nullable = false)
        private Users users;

        public BusinessParts() {

        }

        public BusinessParts(String name) {
            this.name = name;
           
        }


        public long getId() {
            return part_id;
        }
    
        public String getName() {

            return name;
        }
    
        public void setName(String name) {
            this.name = name;
        }
    
        @Override
        public String toString() {
            return "departments [id=" + part_id + ", name=" + name + " ]";
        }
        
    }


    @Entity
    @Table(name = "officers",
    uniqueConstraints = { 
        @UniqueConstraint(columnNames = "afm"),
        @UniqueConstraint(columnNames = "first_name"),
        @UniqueConstraint(columnNames = "last_name")
        })
    public class Officers {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private long id;

        @Column(name = "afm")
        private String afm;

        @Column(name = "first_name")
        private String firstName;

        @Column(name = "last_name")
        private String lastName;

        @Column(name = "date_of_birth")
        private Date dateOfBirth;

        @OneToMany(mappedBy = "officers", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
        private Set<BusinessParts> businessParts ;

        public Officers() {

        }

        public Officers(String afm, String firstName, String lastName, Date dateOfBirth) {

            this.afm = afm;
            this.firstName = firstName;
            this.lastName = lastName;
            this.dateOfBirth = dateOfBirth;
           
        }

        
        public long getId() {
            return id;
        }
    

        public String getAfm() {

            return afm;
        }
    
        public void setAfm(String afm) {
            this.afm = afm;
        }


        public String getFirstName() {

            return firstName;
        }
    
        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

    
        public String getLastName() {

            return lastName;
        }


        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public Date getDateOfBirth() {

            return dateOfBirth;
        }
    
        public void setDateOfBirth(Date dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
        }
    

        @Override
        public String toString() {
            return "officers [id=" + id + ", firstName=" + firstName + ", lastName=" + lastName + ", dateOfBirth=" + dateOfBirth + " ]";
        }

        public void setBusinessParts(BusinessParts name) {

             
        }

        public List<Officers> getBusinessParts() {
            return null;
        }

    

    }

    
        @Entity
        @Table(name = "users", 
        uniqueConstraints = { 
        @UniqueConstraint(columnNames = "login"),
        @UniqueConstraint(columnNames = "password") 
        })
        public class Users {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        

        @Column(name="login")
        private String login;
        @Column(name="password")
        private String password;
        @OneToMany(mappedBy = "users", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
        private Set<BusinessParts> businessParts ;

        
        public Users(String login, String password) {
            

        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getLogin() {
            return login;
        }

        public void setLogin(String login) {
            this.login = login;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getUsername() {
            return null;
        }
        
         @Override
        public String toString() {
            return "users [id=" + id + ", login=" + login + ", password=" + password +"] ";
        }

    }

}