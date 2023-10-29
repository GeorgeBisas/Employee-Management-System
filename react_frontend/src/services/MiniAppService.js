import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MiniAppService = {
  // Officers API Endpoints
  getAllOfficers: () => {
    return axios.get(`${API_BASE_URL}/officers`);
  },

  createOfficer: (employee) => {
    return axios.post(`${API_BASE_URL}/officers`, employee);
  },

  getOfficerById: (employeeId) => {
    return axios.get(`${API_BASE_URL}/officers/${employeeId}`);
  },

  updateOfficer: (employeeId, employee) => {
    return axios.put(`${API_BASE_URL}/officers/${employeeId}`, employee);
  },

  deleteOfficer: (employeeId) => {
    return axios.delete(`${API_BASE_URL}/officers/${employeeId}`);
  },

  // Business Parts API Endpoints
  getAllBusinessParts: () => {
    return axios.get(`${API_BASE_URL}/businessParts`);
  },

  createBusinessPart: (businesspart) => {
    return axios.post(`${API_BASE_URL}/businessParts`, businesspart);
  },

  getBusinessPartById: (businesspartId) => {
    return axios.get(`${API_BASE_URL}/businessParts/${businesspartId}`);
  },

  updateBusinessPart: (businesspartId, businesspart) => {
    return axios.put(`${API_BASE_URL}/businessParts/${businesspartId}`, businesspart);
  },

  deleteBusinessPart: (businesspartId) => {
    return axios.delete(`${API_BASE_URL}/businessParts/${businesspartId}`);
  },
  // Fetch officers by business part ID
  getOfficersByBusinessPartId: (businessPartId) => {
    return axios.get(`${API_BASE_URL}/businessParts/${businessPartId}/officers`);
  },
  // Check AFM uniqueness
  checkAfmUniqueness: (afm) => {
    return axios.get(`${API_BASE_URL}/officers/check/afm/${afm}`);
  },

  // Check uniqueness of first and last name
  checkNameUniqueness: (firstName, lastName) => {
    return axios.get(`${API_BASE_URL}/officers/check/firstlastname/${firstName}/${lastName}`);
  },

  // Check department name uniqueness
  checkDepartmentNameExists: (departmentName) => {
    return axios.get(`${API_BASE_URL}/business_parts/check/${departmentName}`);
  },
  // Create an officer within a business department
  createOfficerWithinBusinessPart: (businessPartId, officerData) => {
    const url = `${API_BASE_URL}/business_parts/${businessPartId}/officers`;

    // Send a POST request to create the officer within the business department
    return axios.post(url, officerData);
  },
};

export default MiniAppService;