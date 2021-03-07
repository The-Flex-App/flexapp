import { gql } from '@apollo/client';

const ADD_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      title
      rag
      period
      order
    }
  }
`;

const EDIT_PROJECT = gql`
  mutation EditProject($id: ID!, $input: ProjectInput!) {
    editProject(id: $id, input: $input) {
      id
      title
      rag
      period
      order
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      title
      rag
      period
      order
    }
  }
`;

const ADD_TOPIC = gql`
  mutation CreateTopic($input: TopicInput!) {
    createTopic(input: $input) {
      title
    }
  }
`;

const EDIT_TOPIC = gql`
  mutation EditTopic($id: ID!, $input: TopicInput!) {
    editTopic(id: $id, input: $input) {
      title
    }
  }
`;

const DELETE_TOPIC = gql`
  mutation DeleteTopic($id: ID!) {
    deleteTopic(id: $id) {
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
      topicId
    }
  }
`;
const EDIT_VIDEO = gql`
  mutation EditVideo($id: ID!, $input: VideoInput!) {
    editVideo(id: $id, input: $input) {
      title
    }
  }
`;

const DELETE_VIDEO = gql`
  mutation DeleteVideo($id: ID!) {
    deleteVideo(id: $id) {
      title
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

const REARRANGE_PROJECT = gql`
  mutation RearrangeProject($input: ProjectListInput) {
    reArrangeProjects(input: $input) {
      success
    }
  }
`;

export {
  ADD_PROJECT,
  EDIT_PROJECT,
  DELETE_PROJECT,
  ADD_TOPIC,
  EDIT_TOPIC,
  DELETE_TOPIC,
  ADD_VIDEO,
  EDIT_VIDEO,
  DELETE_VIDEO,
  ADD_USER,
  ADD_INVITE,
  REMOVE_USER_WORKSPACE,
  REARRANGE_PROJECT,
};
