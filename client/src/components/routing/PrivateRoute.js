import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ auth, ...rest }) => {
    const { isAuthenticated } = auth;

    return (
        <Route
            {...rest}
            render={(props) =>
                !isAuthenticated ? (
                    <Redirect to="/login" />
                ) : (
                    <Route {...rest} />
                )
            }
        />
    );
};

export default PrivateRoute;
