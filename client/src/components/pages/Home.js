import React, { useEffect } from "react";
import Reviews from "../Reviews/Reviews";
import { Link } from "react-router-dom";

const Home = ({
    reviews,
    deleteReview,
    loadUser,
    auth,
    getReviews,
    clearReviews,
}) => {
    useEffect(() => {
        loadUser();
        getReviews();
    }, []);
    return (
        <div>
            {auth.isAuthenticated && (
                <Link
                    to="/addreview"
                    className="btn text-center btn-primary btn-block"
                >
                    Add A Review!
                </Link>
            )}
            <Reviews
                reviews={reviews}
                deleteReview={deleteReview}
                getReviews={getReviews}
                clearReviews={clearReviews}
                auth={auth}
            />
        </div>
    );
};

export default Home;
