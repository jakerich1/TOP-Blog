/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import he from 'he';
import { useHistory } from 'react-router-dom';
import './style.scss';

function Post(props) {
  const history = useHistory();

  const convertDate = (date) => {
    const timestamp = Date.parse(date);
    return new Date(timestamp).toLocaleString();
  };

  const handleNav = () => {
    history.push(`/post/${props.id}`);
  };

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div role="button" onClick={handleNav} onKeyDown={handleNav} className="post">
      <div className="post-content">
        <div className="content-header">
          <div className="post-title">
            {props.title}
          </div>
          <div className="post-date">
            {convertDate(props.timestamp)}
          </div>
        </div>

        <div className="post-content-area">
          {he.decode(props.content)}
        </div>
      </div>
    </div>
  );
}

export default Post;
