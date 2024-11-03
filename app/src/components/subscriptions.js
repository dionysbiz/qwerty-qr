import gql from 'graphql-tag';

export const MESSAGE_SUBSCRIPTION= gql`
  subscription OnMessageReceived {
    messageStream
  }
`;

/*
const COMMENTS_SUBSCRIPTION: TypedDocumentNode<
  OnCommentAddedSubscription,
  OnCommentAddedSubscriptionVariables
> = gql`
  subscription OnCommentAdded($postID: ID!) {
    commentAdded(postID: $postID) {
      id
      content
    }
  }
`;
*/