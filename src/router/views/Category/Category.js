import React, { Fragment, useEffect, useState } from "react";
import StationsList from "../../../components/StationsList/StationsList";
import { withStationsFetcher } from "../../../components/HOC/withStationsFetcher";
import { useQuery } from "../../../utilities/customHooks/useQuery";
import { getObjectFromQueries } from "../../../utilities/tools";

const Category = ({ fetchStations }) => {
    const currentQueries = useQuery();
    console.log(currentQueries);
    const [response, setResponse] = useState({
        results: [],
        loading: false
    });

    useEffect(() => {
        console.log(currentQueries);
        if (currentQueries) {
            setResponse({
                ...response,
                loading: true
            });
            console.log("current query", getObjectFromQueries(currentQueries), new URLSearchParams(currentQueries));
            fetchStations(getObjectFromQueries(currentQueries)).then((res) => {
                console.log(res);
                setResponse({
                    results: res,
                    loading: false
                });
            }).catch(() => {
                setResponse({
                    ...response,
                    loading: false
                });
            });
        }
    }, [currentQueries, fetchStations]);

    return (
        <Fragment>
            <StationsList list={response?.results} loading={response?.loading} title={currentQueries.get("tag") || currentQueries.get("name") || "Search"}/>
        </Fragment>
    )
}
export default withStationsFetcher(Category);