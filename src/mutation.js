import { gql } from '@apollo/client';

const ADD_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      title
    }
  }
`;

const PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      description
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

const VIDEOS = gql`
  query GetVideos($projectId: Int) {
    videosByProject(projectId: $projectId, orderBy: { field: "createdAt", direction: desc }) {
      id
      video
      thumbnail
      title
    }
  }
`;

export { ADD_PROJECT, PROJECTS, ADD_VIDEO, VIDEOS }