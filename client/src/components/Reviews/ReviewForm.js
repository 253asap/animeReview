import { set } from "mongoose";
import React, { useState } from "react";

const ReviewForm = ({ addReview, auth }) => {
    const [review, setReview] = useState({
        name: null,
        rating: "",
        imgUrl: null,
        userId: auth.user.id,
        username: auth.user.username,
        reviewText: "",
    });
    const { name, rating, reviewText } = review;

    const [animeList, setAnimeList] = useState([]);
    const [search, setSearch] = useState("");

    const getAnimeList = async (name) => {
        const res = await fetch(
            `https://api.jikan.moe/v3/search/anime?q=${name}`
        ).then((res) => res.json());
        setAnimeList(res.results.slice(0, 10));
    };

    const onChange = (e, purpose) => {
        if (purpose === "findName") {
            setSearch(e.target.value);
        } else {
            setReview({ ...review, [e.target.name]: e.target.value });
        }
    };

    const onSubmit = (e) => {
        if (!name) {
            e.preventDefault();
            getAnimeList(search);
            setSearch("");
        } else {
            e.preventDefault();
            addReview(review);
            setReview({
                name: null,
                rating: "",
                imgUrl: null,
                userId: auth.user.id,
                username: auth.user.username,
                reviewText: "",
            });
        }
    };

    const addReviewForm = (
        <>
            <h2 className="text-primary">Add Review</h2>
            <h2>Title: {name}</h2>
            <input
                type="number"
                placeholder="Rating out of 10..."
                name="rating"
                min="1"
                max="10"
                required
                value={rating}
                onChange={(e) => onChange(e, "addReview")}
            />
            <textarea
                type="text"
                placeholder="Enter your review here..."
                required
                name="reviewText"
                value={reviewText}
                onChange={(e) => onChange(e, "addReview")}
            />
            <div>
                <input
                    type="submit"
                    value="Add Review"
                    className="btn btn-primary btn-block"
                />
            </div>
        </>
    );

    const findNameForm = (
        <>
            <input
                type="text"
                name="search"
                placeholder="Search Anime Titles..."
                required
                value={search}
                onChange={(e) => onChange(e, "findName")}
            />
            <input
                type="submit"
                value="Search"
                className="btn btn-primary btn-block"
            />
            {animeList.map((anime) => (
                <div className="card text-center bg-light" key={anime.mal_id}>
                    <img
                        src={anime.image_url}
                        alt={anime.title}
                        className=""
                        style={{ maxWidth: "200px" }}
                    />
                    <h3>{anime.title}</h3>
                    <button
                        className="btn btn-danger btn-block"
                        onClick={() => {
                            setReview({
                                ...review,
                                name: anime.title,
                                imgUrl: anime.image_url,
                            });
                        }}
                    >
                        Write review for this
                    </button>
                </div>
            ))}
        </>
    );

    return (
        <form onSubmit={onSubmit}>{name ? addReviewForm : findNameForm}</form>
    );
};

export default ReviewForm;
