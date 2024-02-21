import { gql } from "@apollo/client";
export const SIGNUP = gql`
  mutation signup(
    $firstname: String
    $lastname: String
    $email: String
    $password: String
    $confirmPassword: String
    $accountType: String
  ) {
    signup(
      userData: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        accountType: $accountType
      }
    ) {
      id
      firstname
      lastname
      email
      password
      accountType
    }
  }
`;
export const LOGIN = gql`
  mutation login($email: String, $password: String, $accountType: String) {
    login(
      loginData: {
        email: $email
        password: $password
        accountType: $accountType
      }
    ) {
      id
      accountType
      token
      firstname
      lastname
      email
    }
  }
`;

export const ASSIGNPROJECT = gql`
  mutation assignProject($developerId: ID!, $assignedproject: String) {
    assignProject(
      assignproject: {
        developerId: $developerId
        assignedproject: $assignedproject
      }
    ) {
      id
      projectName
    }
  }
`;
export const ADDTASKHOURS = gql`
  mutation AddTaskHours(
    $userId: ID!
    $idHoursData: [idHours]!
    $startdate: String!
    $enddate: String!
  ) {
    addTaskHours(
      taskHoursData: {
        userId: $userId
        idHoursData: $idHoursData
        startdate: $startdate
        enddate: $enddate
      }
    ) {
      startdate
      enddate
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
`;

export const UPDATETASKHOUR = gql`
  mutation editAddedTask($userId: ID!, $idHoursData: [idHours]!) {
    editAddedTask(
      updateTaskData: {
        userId: $userId
        idHoursData: $idHoursData
      }
    ) {
      startdate
    enddate
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
`;