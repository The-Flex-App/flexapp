import { gql } from '@apollo/client';

const PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      description
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

export { PROJECTS, VIDEOS }