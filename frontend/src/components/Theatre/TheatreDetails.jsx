import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import AddReview from "../Reviews/AddReviews";
import ReviewList from "../Reviews/ShowReviewList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
export default function Theatre() {
  const axiosPrivate = useAxiosPrivate();
  const [userDetails, setUserDetails] = useState([]);
  const [disable, setDisable] = useState(true);
  const [userRatingvalue, setUserRatingValue] = useState(0.0);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const [theatre_id, setTheatre_id] = useState(id);
  const [loading, setLoading] = useState(true); // Add loading state

  function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={loading||isFetching}
        >
          <CircularProgress
            sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
          />
        </Backdrop>
      </React.Fragment>
    );
  }

  const handleAddReview = (review) => {
    sendReview(review);
  };

  const handleLikeReview = (id) => {
    setReviews(
      reviews.map((review) =>
        review.id === id
          ? {
              ...review,
              likes: review.liked ? review.likes - 1 : review.likes + 1,
              liked: !review.liked,
            }
          : review
      )
    );
    updateReviewLikes(id);
  };

  const handleReplyReview = (id, reply) => {
    sendReplyReview(id, reply);
  };

  const sendReplyReview = async (id, reply) => {
    try {
      const reviewReply = await axiosPrivate.post(`/reviews/reply`, {
        id,
        reply,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error replying review:", error);
    }
  };

  const updateReviewLikes = async (id) => {
    try {
      const reviewLikes = await axiosPrivate.patch(`/reviews/like`, {
        id,
      });
      console.log(reviewLikes.data);
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  const sendReview = async (review) => {
    try {
      const reviewPayload = {
        ...review,
        theatre_id: theatre_id,
      };
      const reviewResponse = await axiosPrivate.post(
        `/reviews/addReview`,
        reviewPayload
      );
      console.log(reviewResponse.data);
      window.location.reload();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  useEffect(() => {
    sendUserRating(userRatingvalue);
  }, [userRatingvalue]);

  const sendUserRating = async (rating) => {
    try {
      const ratingPayload = {
        rating: rating,
        theatre_id: theatre_id,
      };
      const ratingResponse = await axiosPrivate.post(
        "/reviews/addRating",
        ratingPayload
      );
      console.log(ratingResponse.data);
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  const navigate = useNavigate();

  const {
    data: details,
    loading: isFetching,
    error,
  } = useFetch(`/theatres/${id}`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/users/getUser");
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/reviews/${id}`);
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchUserRating = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/reviews/rating/${id}`);
        setUserRatingValue(response.data.rates);
        setLoading(false);
        console.log("user Rating Value", response.data.rates);
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchData();
    fetchReviews();
    fetchUserRating();
    setLoading(false);
  }, [id]);

  

  useEffect(() => {
    console.log("userDetails", userDetails);
    if (userDetails && userDetails.length > 0 && userDetails[0] !== null) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [userDetails]);

  const handleonClick = () => {
    navigate(`/schedule/t${id}`);
  };

  if (loading || isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GradientCircularProgress /> {/* Loading spinner */}
      </div>
    );
  }

  return (
    <div className="max-h-full pb-10 bg-black">
      <div className="relative">
        <img src={details.image_url} alt="profile" className="size-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
        <div className="text-2xl lg:text-5xl font-bold absolute text-white bottom-3 md:bottom-10 md:ml-10 ml-3 flex flex-col md:space-y-4 space-y-1">
          <span> {details.name}</span>
          <span> {details.district}</span>
        </div>
      </div>
      <h1 className="lg:text-4xl text-base font-bold md:ml-10 mx-3 mt-5 text-white">
        Movie Show Times at {details.name}
      </h1>
      <button
        onClick={handleonClick}
        className="bg-blue-500 hover:bg-blue-600 font-semibold p-2 text-white rounded-lg mt-5 md:ml-10 mx-3 "
      >
        Show Movie Schedule
      </button>
      <hr className="mt-5 w-3/4 h-1 mx-auto bg-white" />

      <p className="lg:text-2xl text-base md:ml-10 mx-3 mt-5 text-white font-semibold">
        {details.details}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <h1 className="lg:text-4xl text-2xl font-bold md:ml-10 mx-3 mt-5 text-white">
          Contact Details
        </h1>
        <div>
          <p className="lg:text-xl text-base md:ml-10 mx-3 mt-5 text-white">
            Mobile Number : {details.mobile_number}
          </p>
          <p className="lg:text-xl text-base md:ml-10 mx-3 mt-2 lg:mt-2 text-white">
            Email Address : {details.email}
          </p>
          <p className="lg:text-xl text-base md:ml-10 mx-3 mt-2 lg:mt-2 text-white">
            Address : {details.address}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
        <h1 className="lg:text-4xl text-2xl font-bold md:ml-10 mx-3 mt-5 text-white">
          Ratings
        </h1>
        <div className="flex flex-row space-x-5">
          <Box className="my-auto md:ml-10 ml-3 justify-items-center items-center mt-3">
            <Rating
              name="half-rating-read"
              value={parseFloat(details.rating).toFixed(1) || 0}
              precision={0.5}
              readOnly
              size="large"
              sx={{
                "& .MuiRating-iconEmpty": {
                  color: "white",
                },
              }}
            />
          </Box>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
        <h1 className="lg:text-4xl text-2xl font-bold md:ml-10 ml-3 mt-5 text-white">
          Location
        </h1>
        <iframe
          title="location"
          className="w-3/4 h-3/4 ml-10 mt-5 lg:w-96 lg:h-96"
          src={details.location}
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 ">
        <h1 className="lg:text-4xl text-xl font-bold mt-5 md:ml-10 ml-3 text-white">
          {disable ? "Please login to rate" : "Rate Now"}
        </h1>
        <Box className="md:ml-10 ml-3">
          <Rating
            name="half-rating"
            precision={0.5}
            size="large"
            value={parseFloat(userRatingvalue).toFixed(1) || 0}
            onChange={(event, newValue) => {
              if (!disable) {
                setUserRatingValue(newValue);
              }
            }}
            readOnly={disable}
            sx={{
              "& .MuiRating-iconEmpty": {
                color: "white",
              },
            }}
          />
        </Box>
      </div>
      <h1 className="lg:text-4xl text-xl font-bold mt-5 md:ml-10 ml-3 text-white">
        Reviews
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 md:mt-5 pb-8 mb-8">
        <AddReview
          onSubmit={handleAddReview}
          disable={disable}
          photo={userDetails && userDetails[0]?.avatar}
        />

        <ReviewList
          reviews={reviews}
          onLike={handleLikeReview}
          onReply={handleReplyReview}
          disable={disable}
        />
      </div>
    </div>
  );
}
