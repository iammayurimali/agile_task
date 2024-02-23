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
      projectTaskHoursDetails {
        taskHours {
          date
          day
          hours
        }
      }
    }
  }
}
`;

export const GET_INITIAL_TASK_HOURS = gql`
  query GetInitialTaskHours($getUserByIdId: ID!) {
    getUserByID(id: $getUserByIdId) {
      id
      assignProject {
        addTaskHours {
          projectTaskHoursDetails {
            assignProjectId
            taskHours {
              date
              day
              hours
            }
          }
        }
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
        enddate
        startdate
        projectTaskHoursDetails {
          assignProjectId
          taskHours {
            date
            day
            hours
          }
        }
      }
    }
  }
}

`;