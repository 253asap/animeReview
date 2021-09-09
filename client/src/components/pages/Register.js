import React, { useState, useEffect } from "react";

const Register = ({
    setAlert,
    register,
    error,
    deleteAlert,
    isAuthenticated,
    history,
    clearErrors,
}) => {
    const [user, setUser] = useState({
        username: "",
        password: "",
        password2: "",
    });

    useEffect(() => {
        if (isAuthenticated) {
            history.push("/");
        }

        if (error === "User already exists!") {
            setAlert(error, "danger");
            clearErrors();
        }
    }, [error, isAuthenticated, history]);

    const { username, password, password2 } = user;

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (username === "" || password === "" || password2 === "") {
            setAlert("Pleaser Enter all fields!", "danger");
        } else if (password !== password2) {
            setAlert("Passwords do not match!", "danger");
        } else {
            register({ username: username, password: password });
        }
    };

    return (
        <div className="form-container">
            <h1>
                Account <span className="text-primary">Register</span>
            </h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        required
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        required
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        minLength="5"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password2">Confirm Password</label>
                    <input
                        required
                        type="password"
                        name="password2"
                        value={password2}
                        onChange={onChange}
                    />
                </div>
                <input
                    type="submit"
                    value="Register"
                    className="btn btn-primary btn-block"
                />
            </form>
        </div>
    );
};

export default Register;
