import React, { lazy } from "react"
import { Route, Routes } from "react-router-dom"
import PrivateRoute from "../components/PrivateRoute/PrivateRoute"
import { retry } from "../utilities/RetryImport"

// lazy loading
const Home = lazy(() => retry(() => import("./views/Home/Home")))
const About = lazy(() => retry(() => import("./views/About/About")))
const Category = lazy(() => retry(() => import("./views/Category/Category")))
const SavedStations = lazy(() =>
  retry(() => import("./views/SavedStations/SavedStations")),
)
const ErrorRoute = lazy(() => retry(() => import("./views/Error/Error")))

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />
      {/* Stations Category */}
      <Route
        path="/category"
        element={
          <PrivateRoute isUserLoggedIn={true}>
            <Category />
          </PrivateRoute>
        }
      />
      {/* Search Stations */}
      <Route
        path="/search"
        element={
          <PrivateRoute isUserLoggedIn={true}>
            <Category />
          </PrivateRoute>
        }
      />
      {/* Favorites && Recently Played Stations */}
      <Route
        path="/list/:listType"
        element={
          <PrivateRoute isUserLoggedIn={true}>
            <SavedStations />
          </PrivateRoute>
        }
      />
      {/* About */}
      <Route path="/about" element={<About />} />
      {/* Error */}
      <Route path="*" element={<ErrorRoute />} />
    </Routes>
  )
}

export default React.memo(AppRoutes)
