import React, { Fragment, memo, useState, useEffect } from "react";
import StationsList from "../../../components/StationsList/StationsList";
import { connect } from "react-redux";
import * as Consts from "../../../utilities/consts";
import { useParams } from "react-router-dom";
import EmptyResults from "../../../components/Generic/EmptyResults";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const SavedStations = ({savedList}) => {
    const { t } = useTranslation();
    const { listType } = useParams();
    const [currentList, setCurrentList] = useState([]);
    useEffect(() => {
        const availableListNames = ["favorites", "history"];
        if(listType && availableListNames.some(name => name === listType)){
            setCurrentList(savedList[listType]);
        };
    }, [listType,savedList]);
    return (
        <Fragment>
            {
                currentList && currentList.length > 0 ?
                <StationsList list={currentList} title={listType} areSavedStations={true}/>
                :
                <EmptyResults msg={t("empty_list_msg")} />
            }
            
        </Fragment>
    )
};
SavedStations.propTypes = {
    savedList: PropTypes.object.isRequired
};

SavedStations.defaultProps = {
    savedList: {}
};
const mapStateToProps = state => {
    return {
        savedList: state[Consts.MAIN].localStorageCopy || {}
    }
}
export default connect(mapStateToProps)(memo(SavedStations));