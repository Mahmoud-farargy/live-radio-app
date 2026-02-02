import { Navigate } from "react-router-dom";

function PrivateRoute({ children, isUserLoggedIn }){
      return isUserLoggedIn ? children : <Navigate to="/auth/login" replace />;
}
export default PrivateRoute;