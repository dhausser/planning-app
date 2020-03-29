import React from 'react';
import Avatar from '@atlaskit/avatar';
import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentTime,
} from '@atlaskit/comment';

interface CommentsProps extends Comment {
  comments: Array<{
    id: string;
    author: { key: string; name: string };
    body: string;
    created: string;
    updated: string;
  }>;
}

const Comments: React.FC<CommentsProps> = ({ comments }) => {
  return (
    <>
      <h5>Activity</h5>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          avatar={
            <Avatar
              src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${comment.author.key}`}
              label="Atlaskit avatar"
              size="medium"
            />
          }
          author={<CommentAuthor>{comment.author.name}</CommentAuthor>}
          edited={comment.updated && <CommentEdited>Edited</CommentEdited>}
          time={
            <CommentTime>
              {new Date(comment.created).toLocaleDateString()}
            </CommentTime>
          }
          content={<p>{comment.body}</p>}
          actions={[
            <CommentAction>Reply</CommentAction>,
            <CommentAction>Edit</CommentAction>,
            <CommentAction>Like</CommentAction>,
          ]}
        />
      ))}
    </>
  );
};

export default Comments;
