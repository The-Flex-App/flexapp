import { gql } from '@apollo/client';

const PROJECTS = gql`
  query GetProjects($workspaceId: String!) {
    projectByWorkspaceId(workspaceId: $workspaceId) {
      id
      title
      description
      rag
      period
      order
      topics {
        id
        title
      }
    }
  }
`;

const TOPICS = gql`
  query GetTopics($projectId: Int!) {
    topicsByProjectId(projectId: $projectId) {
      id
      title
      videos {
        id
        video
        thumbnail
        title
        firstName
        lastName
        email
      }
    }
  }
`;

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
      firstName
      lastName
      email
      userId
      createdAt
      updatedAt
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
