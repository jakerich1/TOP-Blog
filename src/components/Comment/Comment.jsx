/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import './style.scss';

function Comment(props) {
  const convertDate = (date) => {
    const timestamp = Date.parse(date);
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="comment">
      <div className="comment-head">
        <h3>{props.displayname}</h3>
        <div className="comment-date">{convertDate(props.date)}</div>
      </div>
      <div className="comment-content">
        {props.content}
      </div>
    </div>
  );
}

export default Comment;
