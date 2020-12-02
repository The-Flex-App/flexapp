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
      projectIdB
    }
  }
`;

export { ADD_PROJECT, ADD_VIDEO }