import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import he from 'he';
import { useAuth } from '../../use-auth';
import Comment from '../Comment/Comment';
import './style.scss';

function SinglePost() {
  const auth = useAuth();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState(false);
  const [currentComment, setCurrentComment] = useState('');

  const toggleCommentForm = () => {
    setCommentForm(!commentForm);
  };

  const fetchComments = async () => {
    if (!id) return;

    try {
      const commentData = await axios.get(`https://top-blog-jr.herokuapp.com/posts/${id}/comments`);
      setComments(commentData.data);
    } catch (error) {
      // console.log(error)
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`https://top-blog-jr.herokuapp.com/posts/${id}/comments`,
        {
          content: currentComment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt-fe')}` },
        });
      fetchComments();
    } catch (errors) {
      // console.log(errors)
    }
  };

  const handleContent = (e) => {
    e.target.style.height = '5px';
    e.target.style.height = `${e.target.scrollHeight}px`;
    setCurrentComment(e.target.value);
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const postData = await axios.get(`https://top-blog-jr.herokuapp.com/posts/${id}`);
        setTitle(postData.data.title);
        setContent(postData.data.content);
        setDate(postData.data.timestamp);
      } catch (error) {
        // console.log(error)
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  useEffect(() => {
    auth.checkAuth();
  }, [auth]);

  const convertDate = (dateToConvert) => {
    const timestamp = Date.parse(dateToConvert);
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="create-wrap">
      <div className="inner-wrap">
        <header>
          <h1>Post</h1>
          {auth.user ? <button type="button" onClick={auth.signout}>sign out</button> : <Link to="/login"><button type="button" onClick={auth.signout}>Log In</button></Link>}
        </header>

        <div className="post">
          <div className="post-content">
            <div className="content-header">
              <div className="post-title">
                {title}
              </div>
              <div className="post-date">
                {convertDate(date)}
              </div>
            </div>

            <div className="post-content-area">
              {he.decode(content)}
            </div>
          </div>
        </div>

        <h2>Comments</h2>

        { auth.user ? <button type="button" onClick={toggleCommentForm}>Add comment</button> : ''}

        <div style={{ display: commentForm ? 'block' : 'none' }} className="comment-form">
          <form onSubmit={submitComment}>
            <textarea onInput={handleContent} value={currentComment} placeholder="Comment here" />
            <button type="submit">submit</button>
          </form>
        </div>

        <div className="comment-cont">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              displayname={comment.user.displayname}
              date={comment.timestamp}
              content={comment.content}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

export default SinglePost;
