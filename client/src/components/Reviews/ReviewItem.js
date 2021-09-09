import React from "react";

const ReviewItem = (props) => {
    const { name, imgUrl, rating, reviewText, username, _id } = props.review;
    let bool = false;
    if (props.auth.user) {
        if (props.auth.user.username === username) {
            bool = true;
        }
    }

    const onDel = () => {
        props.deleteReview(_id);
    };

    return (
        <div className="card text-center bg-light">
            <img
                src={imgUrl}
                alt={name}
                className=""
                style={{ maxWidth: "200px" }}
            />
            <h3>{name}</h3>
            <h4>Rating: {rating}/10</h4>
            <h5>
                Review by: <strong>{username}</strong>
            </h5>
            <p>{reviewText}</p>
            {bool && (
                <button className="btn btn-danger btn-block" onClick={onDel}>
                    Delete
                </button>
            )}
        </div>
    );
};

export default ReviewItem;
