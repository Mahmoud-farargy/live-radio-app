import React from "react";
import Auxiliary from "../../../components/HOC/Auxiliary";
import "./Error.scss";
import { Link } from "react-router-dom";
import appConfig from "../../../info/app-config.json";

const Error = () => {
    return(
        <Auxiliary>
            <div id="errorRoute">
                <div className="error--route--inner flex-column">
                    <h2>Sorry, this page isn't available.</h2>
                    <p>The link you followed may be broken, or the page may have been removed.</p>
                    <Link to="/" className="primary__btn">Go back to {appConfig.title}</Link>
                </div>
            </div>
        </Auxiliary>
    )
}

export default Error;