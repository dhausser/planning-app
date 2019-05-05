import React from 'react'
import Avatar from '@atlaskit/avatar'
import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentTime,
} from '@atlaskit/comment'

import { hostname } from '../credentials'

export default ({ comments }) => (
  <>
    <h4>Activity</h4>
    {comments.map(comment => (
      <Comment
        key={comment.id}
        avatar={
          <Avatar
            src={`https://${hostname}/secure/useravatar?ownerId=${
              comment.author.key
            }`}
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
)
