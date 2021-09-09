import React, { useEffect } from "react";
import ReviewItem from "./ReviewItem";

const Reviews = ({ reviews, deleteReview, auth }) => {
    return (
        <div style={{}} className="grid-2">
            {reviews.map((review) => (
                <ReviewItem
                    review={review}
                    key={review._id}
                    deleteReview={deleteReview}
                    auth={auth}
                />
            ))}
        </div>
    );
};

export default Reviews;
