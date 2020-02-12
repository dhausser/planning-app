import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@atlaskit/avatar';
import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentTime,
} from '@atlaskit/comment';


function Comments({ comments }) {
  return (
    <>
      <h5>Activity</h5>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          avatar={(
            <Avatar
              src={`https://${process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${comment.author.key}`}
              label="Atlaskit avatar"
              size="medium"
            />
          )}
          author={<CommentAuthor>{comment.author.name}</CommentAuthor>}
          edited={comment.updated && <CommentEdited>Edited</CommentEdited>}
          time={(
            <CommentTime>
              {new Date(comment.created).toLocaleDateString()}
            </CommentTime>
          )}
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
}

Comments.defaultProps = {
  comments: null,
};

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.objectOf),
};

export default Comments;
