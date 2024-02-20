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
    projectName
   id
  }
}
`;
