import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/routing/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import ReviewForm from "./components/Reviews/ReviewForm";
import Home from "./components/pages/Home";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Alerts from "./components/layout/Alerts";
import setAuthToken from "./setAuthToken";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem("token"),
        isAuthenticated: null,
        user: null,
        loading: true,
        error: null,
    });

    const register = async (data) => {
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        try {
            const res = await fetch("/api/users", config);
            const token = await res.json();
            if (token.error) {
                throw token.error;
            }
            localStorage.setItem("token", token.token);
            setAuth({
                ...auth,
                token: localStorage.token,
                isAuthenticated: true,
                loading: false,
            });
            loadUser();
        } catch (error) {
            localStorage.removeItem("token");
            setAuth({
                ...auth,
                isAuthenticated: false,
                loading: true,
                token: localStorage.getItem("token"),
                error: error,
            });
        }
    };

    const login = async (data) => {
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        try {
            const res = await fetch("/api/auth", config);
            const token = await res.json();
            if (token.error) {
                throw token.error;
            }

            localStorage.setItem("token", token.token);
            setAuth({
                ...auth,
                token: localStorage.token,
                isAuthenticated: true,
                loading: false,
            });
            loadUser();
        } catch (error) {
            localStorage.removeItem("token");
            setAuth({
                ...auth,
                isAuthenticated: false,
                loading: true,
                user: null,
                token: localStorage.getItem("token"),
                error: error,
            });
        }
    };

    const loadUser = async () => {
        setAuthToken(localStorage.token);

        try {
            const res = await axios.get("/api/auth");
            if (res.data.msg) {
                throw res.data.msg;
            }
            setAuth({
                ...auth,
                isAuthenticated: true,
                loading: false,
                user: res.data,
            });
        } catch (error) {
            localStorage.removeItem("token");
            setAuth({
                ...auth,
                isAuthenticated: false,
                loading: true,
                token: localStorage.getItem("token"),
                error: error,
            });
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuth({
            ...auth,
            isAuthenticated: false,
            loading: true,
            user: null,
            token: localStorage.getItem("token"),
            error: null,
        });
    };

    const [alerts, setAlerts] = useState([]);

    const setAlert = (msg, type) => {
        const id = uuid();
        setAlerts([...alerts, { msg: msg, type: type, id: id }]);

        setTimeout(() => deleteAlert(id), 5000);
    };

    const deleteAlert = (id) => {
        setAlerts(alerts.filter((alert) => alert.id !== id));
    };

    const clearErrors = () => {
        setAuth({ ...auth, error: null });
    };

    const [reviews, setReviews] = useState([]);

    const addReview = async (review) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const res = await axios.post("/api/reviews", review, config);
            setReviews([...reviews, res.data]);
        } catch (error) {
            setAlert(error.response.message, "danger");
        }
    };

    const deleteReview = async (id) => {
        try {
            await axios.delete(`/api/reviews/${id}`);
            setReviews(reviews.filter((review) => review._id !== id));
        } catch (error) {
            setAlert(error.response.message, "danger");
        }
    };

    const getReviews = async () => {
        try {
            const res = await axios.get("/api/reviews");
            setReviews([...res.data]);
        } catch (error) {
            setAlert(error.response.message, "danger");
        }
    };

    const clearReviews = () => {
        setReviews([]);
    };

    return (
        <Router>
            <>
                <Navbar auth={auth} logout={logout} />
                <div className="container">
                    <Alerts alerts={alerts} />
                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={(props) => (
                                <Home
                                    loadUser={loadUser}
                                    reviews={reviews}
                                    addReview={addReview}
                                    deleteReview={deleteReview}
                                    auth={auth}
                                    getReviews={getReviews}
                                    clearReviews={clearReviews}
                                    {...props}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/register"
                            render={(props) => (
                                <Register
                                    {...props}
                                    setAlert={setAlert}
                                    register={register}
                                    error={auth.error}
                                    isAuthenticated={auth.isAuthenticated}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/login"
                            render={(props) => (
                                <Login
                                    {...props}
                                    login={login}
                                    setAlert={setAlert}
                                    error={auth.error}
                                    isAuthenticated={auth.isAuthenticated}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                        <PrivateRoute
                            exact
                            path="/addreview"
                            auth={auth}
                            render={(props) => (
                                <ReviewForm
                                    {...props}
                                    auth={auth}
                                    addReview={addReview}
                                />
                            )}
                        />
                    </Switch>
                </div>
            </>
        </Router>
    );
};

export default App;
