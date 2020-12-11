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

const ADD_USER = gql`
	mutation CreateUser($input: UserInput) {
		createUser(input: $input) {
			firstName
			lastName
			email
			workspaceId
			memberWorkspaceInfo {
				firstName
				lastName
				email
				workspaceId
			}
			ownerWorkspaceInfo {
				firstName
				lastName
				email
				role
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

export { ADD_PROJECT, ADD_VIDEO, ADD_USER, ADD_INVITE };
