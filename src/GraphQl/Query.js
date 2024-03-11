import { gql } from "@apollo/client";

export const getAllDevelopers = gql`
  {
    getAllDevelopers {
      id
      firstname
      lastname
    }
  }
`;

export const getAssignedProject = gql`
query GetAssignedProject($getAssignedProjectId: ID!) {
  getAssignedProject(id: $getAssignedProjectId) {
    id
    projectName
    addTaskHours {
      assignProjectId
      comments
      date
      day
      hours
    }
  }
}
`;



export const getUser = gql`
{
  getUser{
    id
    firstname
    lastname
    email
    password
    accountType
    approved
    token
    assignProject {
      projectName
      addTaskHours {
      comments
      date
      day
      hours
    }
    }
  }
}

`;

export const getUserById = gql`
query GetUserByID($getUserByIdId: ID!) {
  getUserByID(id: $getUserByIdId) {
    id
    firstname
    lastname
    email
    password
    accountType
    approved
    token
    assignProject {
      id
      projectName
      addTaskHours {
        id
        date
        day
        hours
        comments
      }
    }
  }
}
`;