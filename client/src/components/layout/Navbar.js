import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Navbar = ({ title, icon, auth, logout }) => {
    const { isAuthenticated, user } = auth;

    const authLinks = (
        <>
            <li>Logged in: {user && user.username}</li>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <a onClick={logout} href="#!">
                    <i className="fas fa-sign-out-alt"></i>
                    <span className="hide-sm">Logout</span>
                </a>
            </li>
        </>
    );

    const nonAuthLinks = (
        <>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/login">Login</Link>
            </li>
            <li>
                <Link to="/register">Register</Link>
            </li>
        </>
    );

    return (
        <div className="navbar bg-primary">
            <h1>
                <i className={icon} /> {title}
            </h1>
            <ul>{isAuthenticated ? authLinks : nonAuthLinks}</ul>
        </div>
    );
};

Navbar.prototype = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
};

Navbar.defaultProps = {
    title: "Anime Review",
    icon: "fas fa-user-astronaut",
};

export default Navbar;
