import React, { PureComponent } from "react";
import { notify, serialize, lowerString, isValidAudioSrc, convertToAPlayerItem } from "../../utilities/tools";
import PropTypes from "prop-types";
import api, { setBaseURL } from "../../services/api";
import { connect } from "react-redux";
import * as Consts from "../../utilities/consts";
import appInfo from "../../info/app-config";


export const withStationsFetcher = WrappedComponent => {
    const { pageLimit, radioBrowserUrls } = appInfo;

    class newComponent extends PureComponent {
        constructor(props) {
            super(props);
            this._isMounted = true;
            this.hasError = false;
        }
        componentWillUnmount(){
            this._isMounted = false;
        }
        fetchStations = ({ limit, offset, ...rest }) => {
            const { localMemory } = this.props;
            const availableKeys = ["language", "languageExact", "tag", "tagExact", "reverse", "order", "name", "nameExact", "country", "countryExact", "countryCode", "state", "stateExact", "tagList", "codec", "bitrateMin", "bitrateMax", "is_https"];
            return new Promise((resolve, reject) => {
                if (rest ? (typeof rest === "object" && Object.keys(rest).every(key => availableKeys.some(el => lowerString(el) === lowerString(key)))) : true) {
                    const mainObject = {
                        ...rest,
                        hideBroken: true,
                        limit: limit || pageLimit || 50,
                        offset: offset || 0,
                        is_https: (localMemory.settings && typeof localMemory.settings.httpsOnly === "boolean") ? localMemory.settings.httpsOnly : true,
                    }
                    api().get(`/stations/search?${serialize(mainObject)}`).then((res) => {
                        
                        if (this._isMounted) {
                            const filteredData = res.data?.filter(item => {
                                const src = item?.url_resolved || item?.url;
                                const isSecure = parseInt(item.ssl_error) === 0;
                                const isSrcValid = isValidAudioSrc(src);

                                return isSrcValid && isSecure;
                            }).map(audioItem => convertToAPlayerItem(audioItem));
                            
                            const lengthBeforeFitlering = res.data?.length;
                            const newObject = {
                                data: filteredData,
                                length: lengthBeforeFitlering,
                            };
                            const receievedData = (res?.data ? newObject : {});
                            
                            resolve(receievedData);
                        }
                    }).catch((err) => {
                        if(!this._isMounted || this.hasError) return;                
                        setBaseURL(radioBrowserUrls[2]);
                        this.hasError = true;
                        
                        notify(err?.message || "An error occurred.", "error");
                        reject([]);
                    });
                } else {
                    reject([]);
                }
            });
        }
        render() {
            return (
                <WrappedComponent {...this.props} fetchStations={this.fetchStations} />
            )
        }
    }
    newComponent.propTypes = {
        localMemory: PropTypes.object.isRequired
    }
    const mapStateToProps = state => {
        return {
            localMemory: state[Consts.MAIN].localStorageCopy || {}
        }
    }
    return connect(mapStateToProps)(newComponent);
}

withStationsFetcher.propTypes = {
    WrappedComponent: PropTypes.elementType.isRequired,
}