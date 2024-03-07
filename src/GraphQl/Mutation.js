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
      firstname
      lastname
      email
      password
      accountType
    }
  }
`;
export const LOGIN = gql`
  mutation login($email: String, $password: String) {
    login(
      loginData: {
        email: $email
        password: $password
       
      }
    ) {
      
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
      projectName
    }
  }
`;

export const ADDTASKHOURS = gql`
  mutation AddTaskHours(
    $userId: ID!
    $assignProjectId: ID!
    $comments: String!
    $date: String!
    $day: String!
    $hours: Float!
  ) {
    addTaskHours(
      taskHoursData: {
        userId: $userId
        assignProjectId: $assignProjectId
        comments: $comments
        date: $date
        day: $day
        hours: $hours
      }
    ) {
      id
      date
      day
      hours
      comments
    }
  }
`;

export const UPDATETASKHOUR = gql`
  mutation editAddedTask(
    $userId: ID!
    $assignProjectId: ID!
    $comments: String!
    $date: String!
    $day: String!
    $hours: Float!
  ) {
    editAddedTask(
      updateTaskData: {
        userId: $userId
        assignProjectId: $assignProjectId
        comments: $comments
        date: $date
        day: $day
        hours: $hours
      }
    ) {
      date
      day
      hours
      comments
    }
  }
`;

export const DELETETASKHOUR = gql`
  mutation deleteTaskData(
    $assignProjectId: ID!
    $comments: String!
    $date: String!
    $day: String!
    $hours: Float!
  ) {
    deleteTaskData(
      deletedata: {
        assignProjectId: $assignProjectId
        comments: $comments
        date: $date
        day: $day
        hours: $hours
      }
    ) {
      id
      date
      day
      hours
      comments
    }
  }
`;
