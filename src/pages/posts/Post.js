import { useState, useEffect } from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media, OverlayTrigger } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import Tooltip from "@mui/material/Tooltip";
import ReviewCreateForm from "../reviews/ReviewCreateForm";
import Reviews from "../reviews/Reviews";
import { axiosReq } from "../../api/axiosDefaults";


const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    title,
    content,
    image,
    updated_at,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const history = useHistory();

  const [reviews, setReviews] = useState({ results: [] });
  const [reviewOpen, setReviewOpen] = useState(false);
  // eslint-disable-next-line
  const [post, setPost] = useState({ results: [] });

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: post }, { data: reviews }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
          axiosReq.get(`/reviews/?post=${id}`),
        ]);
        setPost({ results: [post] });
        setReviews(reviews);
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && postPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        {content && <Card.Text>{content}</Card.Text>}
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  <>You can't like your own post!</>
                </Tooltip>
              }
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
        <div>
          {reviews.results.length ? (
            <Tooltip title="Click to view the review" placement="bottom" arrow>
              <div
                className={styles.Reviews}
                onClick={() => setReviewOpen(!reviewOpen)}
              >
                See Review
              </div>
            </Tooltip>
          ) : is_owner && currentUser && reviews.results.length === 0 ? (
            <Tooltip title="Click to add a review" placement="bottom" arrow>
              <div
                className={styles.Reviews}
                onClick={() => setReviewOpen(!reviewOpen)}
              >
                Add Review
              </div>
            </Tooltip>
          ) : (
            <div></div>
          )}
        </div>
      </Card.Body>
      {/* {reviewOpen && (
        <Card.Body>
          {is_owner && currentUser && reviews.results.length === 0 ? (
            <ReviewCreateForm
              profile_id={currentUser.profile_id}
              post={id}
              setPost={setPost}
              setReviews={setReviews}
            />
          ) : reviews.results.length ? (
            <p>Your review:</p>
          ) : null}
          {reviews.results.length ? (
            <Reviews {...reviews.results[0]} setReviews={setReviews} />
          ) : currentUser ? (
            <span>No review has been added yet!</span>
          ) : (
            <span>No reviews yet</span>
          )}
        </Card.Body>
      )} */}
    </Card>
  );
};

export default Post;
