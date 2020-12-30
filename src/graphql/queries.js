import { gql } from '@apollo/client';

const PROJECTS = gql`
  query GetProjects($workspaceId: String!) {
    projectByWorkspaceId(workspaceId: $workspaceId) {
      id
      title
      description
      rag
      finishDate
    }
  }
`;

const TOPICS = gql`
  query GetTopics($projectId: Int!) {
    topicsByProjectId(projectId: $projectId) {
      id
      title
    }
  }
`;

// const VIDEOS = gql`
//   query GetVideos($projectId: Int) {
//     videosByProject(
//       projectId: $projectId
//       orderBy: { field: "createdAt", direction: desc }
//     ) {
//       id
//       video
//       thumbnail
//       title
//     }
//   }
// `;

const VIDEOS_TOPIC = gql`
  query GetVideosByTopic($projectId: Int, $topicId: Int) {
    videosByTopic(
      projectId: $projectId
      topicId: $topicId
      orderBy: { field: "updatedAt", direction: desc }
    ) {
      id
      video
      thumbnail
      title
    }
  }
`;

const USERINFO = gql`
  query GetUserInfo {
    getUserInfo {
      id
      userName
      email
      firstName
      lastName
      role
    }
  }
`;

export { PROJECTS, USERINFO, TOPICS, VIDEOS_TOPIC };
