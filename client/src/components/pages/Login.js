import React, { useState, useEffect } from "react";

const Login = ({
    setAlert,
    login,
    error,
    deleteAlert,
    isAuthenticated,
    history,
    clearErrors,
}) => {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        if (isAuthenticated) {
            history.push("/");
        }

        if (error === "Invalid username or password") {
            setAlert(error, "danger");
            clearErrors();
        }
    }, [error, isAuthenticated, history]);

    const { username, password } = user;

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (username === "" || password === "") {
            setAlert("Please enter all fields!", "danger");
        } else {
            login({
                username: username,
                password: password,
            });
        }
    };

    return (
        <div className="form-container">
            <h1>
                Account <span className="text-primary">Login</span>
            </h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                    />
                </div>
                <input
                    type="submit"
                    value="Login"
                    className="btn btn-primary btn-block"
                />
            </form>
        </div>
    );
};

export default Login;
