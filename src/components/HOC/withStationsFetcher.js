import React, { PureComponent } from "react";
import { notify } from "../../utilities/tools";
import { serialize } from "../../utilities/tools";
import PropTypes from "prop-types";
import api from "../../services/api";
import { connect } from "react-redux";
import * as Consts from "../../utilities/consts";

export const withStationsFetcher = WrappedComponent => {

    class newComponent extends PureComponent {
        constructor(props) {
            super(props);
            this._isMounted = true;
        }
        componentWillUnmount(){
            this._isMounted = false;
        }
        fetchStations = ({ limit, offset, ...rest }) => {
            const { localMemory } = this.props;
            const availableKeys = ["language", "languageExact", "tag", "tagExact", "reverse", "order", "name", "nameExact", "country", "countryExact", "countryCode", "state", "stateExact", "tagList", "codec", "bitrateMin", "bitrateMax", "is_https"];
            return new Promise((resolve, reject) => {
                if (rest ? (typeof rest === "object" && Object.keys(rest).every(key => availableKeys.some(el => el.toLowerCase() === key.toLowerCase()))) : true) {
                    const mainObject = {
                        ...rest,
                        hideBroken: true,
                        limit: limit || 100,
                        offset: offset || 0,
                        is_https: (localMemory.settings && typeof localMemory.settings.httpsOnly === "boolean") ? localMemory.settings.httpsOnly : true,
                    }
                    api().get(`/stations/search?${serialize(mainObject)}`).then((res) => {
                        if (this._isMounted) {
                            const receievedData = (res?.data ? (res.data?.filter(item => parseInt(item.ssl_error) === 0)) : []);
                            resolve(receievedData);
                        }
                    }).catch((err) => {
                        if(this._isMounted){
                            notify(err?.message || "An error occurred.", "error");
                            reject([]);
                        }
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