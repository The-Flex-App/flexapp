import { gql } from '@apollo/client';

const ADD_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      title
    }
  }
`;

const ADD_VIDEO = gql`
  mutation CreateVideo($input: VideoInput!) {
    createVideo(input: $input) {
      thumbnail
      duration
      video
      projectId
    }
  }
`;

const ADD_USER = gql`
  mutation CreateUser($input: UserInput) {
    createUser(input: $input) {
      firstName
      lastName
      email
      workspaceId
      role
      workspaces {
        id
        firstName
        lastName
        email
        workspaceId
      }
      workspaceMembers {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

const ADD_INVITE = gql`
  mutation CreateInvitaton($input: InvitationInput) {
    createInvitaton(input: $input) {
      id
    }
  }
`;

const REMOVE_USER_WORKSPACE = gql`
  mutation RemoveUserWorkspace($input: UserWorkspaceInput) {
    removeUserWorkspace(input: $input) {
      workspaces {
        id
        firstName
        lastName
        email
        workspaceId
      }
      workspaceMembers {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export { ADD_PROJECT, ADD_VIDEO, ADD_USER, ADD_INVITE, REMOVE_USER_WORKSPACE };
