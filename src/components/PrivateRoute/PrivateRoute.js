import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({component: Component, isUserLoggedIn, ...rest}){
    return (
        <Route 
        {...rest}
        render={(props) => isUserLoggedIn
            ? <Component {...props} />
            : <Redirect to={{pathname: "/auth/login"}} />
             }
        />
    )
}
export default PrivateRoute;