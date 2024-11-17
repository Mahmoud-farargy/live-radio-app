import React, { Fragment, useEffect, useState } from "react";
import StationsList from "../../../components/StationsList/StationsList";
import { withStationsFetcher } from "../../../components/HOC/withStationsFetcher";
import { useQuery } from "../../../utilities/customHooks/useQuery";
import { getObjectFromQueries } from "../../../utilities/tools";

const Category = ({ fetchStations }) => {
    const currentQueries = useQuery();
    const [response, setResponse] = useState({
        results: [],
        loading: false
    });

    useEffect(() => {
        if (currentQueries) {
            setResponse({
                ...response,
                loading: true
            });
            fetchStations(getObjectFromQueries(currentQueries)).then((res) => {
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
            <StationsList list={response?.results} loading={response?.loading} title={currentQueries?.get("tag") || (currentQueries?.get("name") ? `"${currentQueries?.get("name")}"` : "")}/>
        </Fragment>
    )
}
export default withStationsFetcher(Category);