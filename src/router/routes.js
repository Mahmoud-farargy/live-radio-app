import React, { lazy, Suspense, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./views/Home/Home";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import { retry } from "../utilities/RetryImport";
// lazy loading
const About = lazy(() => retry(() => import("./views/About/About")));
const Category = lazy(() => retry(() => import("./views/Category/Category")));
const SavedStations = lazy(() => retry(() => import("./views/SavedStations/SavedStations")));

const Routes = () => {
    return (
        <Fragment>
            <div id="routesContainer">
                    <Switch>
                        {/* Authenticated Routes */}
                        {/* Home */}
                        <PrivateRoute exact path="/" component={Home} isUserLoggedIn={true} />

                        {/* Regular routes */}
                        <Suspense exact fallback="loading...">
                            {/* Stations Category */}
                            <PrivateRoute exact path="/category" component={Category} isUserLoggedIn={true} />
                            {/* Search Stations */}
                            <PrivateRoute exact path="/search" component={Category} isUserLoggedIn={true} />
                            {/* Favorites && Recently Played Stations */}
                            <PrivateRoute exact path="/list/:listType" component={SavedStations} isUserLoggedIn={true} />
                            {/* About */}
                            <Route path="/about" component={About} />
                        </Suspense>
                    </Switch>  
            </div>

        </Fragment>

    )
}

export default React.memo(Routes);