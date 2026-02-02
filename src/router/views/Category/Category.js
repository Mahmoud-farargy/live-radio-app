import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StationsList from "../../../components/StationsList/StationsList";
import { withStationsFetcher } from "../../../components/HOC/withStationsFetcher";
import { useQuery } from "../../../utilities/customHooks/useQuery";
import { getObjectFromQueries } from "../../../utilities/tools";
import appInfo from "../../../info/app-config";

const Category = ({ fetchStations }) => {
    const { pageLimit } = appInfo;
    const currentPage = useRef(0);
    const currentQueries = useQuery();

    const [response, setResponse] = useState({
        results: [],
        loading: false,
        isLoadingMore: false,
        hasReachedEnd: false,
    });
    const loadData = useCallback(({isLoadMore}) => {
        if (currentQueries) {
            setResponse((prevState)=> ({
                ...prevState,
                ...(!!isLoadMore ? {
                   isLoadingMore: true
                } : {
                  loading: true,
                })
            }));
            fetchStations({...getObjectFromQueries(currentQueries), ...(isLoadMore && {offset: ((currentPage.current + 1) * pageLimit)})}).then(({data, length}) => {
                const receivedPageLength = length || 0;
                setResponse((prevState) => ({
                    results: [...(isLoadMore ? [...prevState.results, ...data] : data)],
                    loading: false,
                    isLoadingMore: false,
                    hasReachedEnd: receivedPageLength < pageLimit
                }));

                if(isLoadMore){
                    currentPage.current++;
                }
                
            }).catch(() => {
                setResponse((prevState) => ({
                    ...prevState,
                    loading: false,
                    isLoadingMore: false
                }));
            });
        }
    }, [currentQueries, fetchStations, currentPage]);

    useEffect(() => {
        currentPage.current = 0;
        loadData({});
    }, [loadData]);

    const isLoadingMoreItemsAllowed = useMemo(() => !response?.loading && !response.hasReachedEnd, [response]);
    
    const loadMoreStations = () => {
        if(isLoadingMoreItemsAllowed && !response.isLoadingMore){
            loadData({isLoadMore: true});
        }
    }

    return (
        <div className="page-container">
            <StationsList list={response?.results} loading={response?.loading} title={currentQueries?.get("tag") || (currentQueries?.get("name") ? `"${currentQueries?.get("name")}"` : "")} areSavedStations={false}/>
            <div className="load--more__button__container">
                {isLoadingMoreItemsAllowed ? <button onClick={loadMoreStations}>
                    { response.isLoadingMore ? 'Loading More...' : 'Load More' }
                </button> : null}
            </div>
        </div>
    )
}
export default withStationsFetcher(Category);