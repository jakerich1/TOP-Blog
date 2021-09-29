/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../use-auth';
import './style.scss';
import Post from '../Post/Post';

const axios = require('axios').default;

function Dashboard() {
  const auth = useAuth();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [postInfo, setPageInfo] = useState({
    all: 0, published: 0, unpublished: 0, pages: 0,
  });
  const [pages, setPages] = useState([]);

  const fetchPosts = async (pageRequest) => {
    try {
      const postReturn = await axios.get(`https://top-blog-jr.herokuapp.com/posts?page=${pageRequest}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
      setPosts(postReturn.data);
    } catch (error) {
      return error.response.data;
    }
    return true;
  };

  const fetchInfo = async () => {
    try {
      const infoReturn = await axios.get('https://top-blog-jr.herokuapp.com/posts/info');

      infoReturn.data.unpublished = infoReturn.data.all - infoReturn.data.published;
      infoReturn.data.pages = Math.ceil(infoReturn.data.all / 10);

      const pageArray = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < infoReturn.data.pages + 1; i++) {
        pageArray.push(i);
      }

      setPages(pageArray);
      setPageInfo(infoReturn.data);
    } catch (error) {
      return error.response.data;
    }
    return true;
  };

  useEffect(() => {
    fetchPosts(page);
    fetchInfo();
    auth.checkAuth();
  }, [page, auth]);

  return (
    <div className="dash-wrap">
      <div className="inner-wrap">

        <header>
          <h1>Home</h1>

          {auth.user
            ? <button type="button" onClick={auth.signout}>sign out</button>
            : <Link to="/login"><button type="button" onClick={auth.signout}>Log In</button></Link>}
        </header>

        <main>

          <div className="post-area">
            <div className="post-section">

              {posts.map((post) => (
                <Post
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  content={post.content}
                  timestamp={post.timestamp}
                />
              ))}

            </div>

            <div className="post-nav">

              {pages.map((pageNum, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="nav-li"
                  onClick={() => setPage(pageNum)}
                  onKeyDown={() => setPage(pageNum)}
                  style={{
                    background: pageNum === page ? 'white' : 'none',
                    color: pageNum === page ? '#FF416C' : 'white',
                  }}
                >
                  {pageNum}
                </div>
              ))}

            </div>
          </div>

        </main>

      </div>
    </div>
  );
}

export default Dashboard;
