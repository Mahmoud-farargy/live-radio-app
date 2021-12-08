import React, {memo} from "react";
import Auxiliary from "../HOC/Auxiliary";
import StationsListItem from "./StationsListItem.js/StationsListItem";
import styled from "styled-components";
import { connect } from "react-redux";
import EmptyResults from "../Generic/EmptyResults";
import * as consts from "../../utilities/consts";


const OuterContainer = styled.div`
        ul#stationsList{
            .list--name{
                margin: 0.1rem 0 1rem 0;
            }
            width: 100%;
            list-style: none;
            padding:0;
            background-color: var(--ultra-white);
            display: block;
            padding: 1.3rem 1rem;
            margin-top: 1.3rem;
            border-radius: 0.5rem;
            overflow: hidden;
        }
        .list--loading{
            @keyframes spin {
                to {
                    transform: rotateZ(360deg);
                }
            }
            height: calc(100vh - var(--height-header) - ${(props) => props.playerState.isPlayerFullMode && props.playerState.isPlayerOpen ? "var(--player-height-size)": "0px"});
            width: 100%;
            justify-content: center;
            align-items:center;
            span {
            display: block;
            margin: 0 auto;
            width:60px;
            height: 60px;
            border: 4px solid transparent;
            border-top-color: var(--primary-clr);
            border-radius: 50%;
            animation: spin ease 1000ms infinite;
            -webkit-animation: spin ease 1000ms infinite;
            }
        }
`;

const StationsList = ({ list, loading, isPlayerFullMode, isPlayerOpen, title }) => {
    return (
        <Auxiliary>
            <OuterContainer playerState={{isPlayerFullMode, isPlayerOpen}} className="stationsList--outer--container">
                {
                    !loading ?
                    <ul id="stationsList">
                        {list?.length > 0 &&<h4 className="list--name">{title}</h4>}
                        {
                            list && list.length > 0 ? list.map((item, idx) => {
                                return item && (
                                    <StationsListItem item={item} key={item.id || idx} index={idx} wholeList={list}/>
                                )
                            })
                            :
                            <EmptyResults msg="No matching stations" />
                        }
                    </ul>
                    :
                    <div className="list--loading flex-column">
                        <span></span>
                    </div>
                }  
            </OuterContainer>
        </Auxiliary>
    )
};

StationsList.defaultProps ={
    list: [],
    loading: false,
    title: "",
    isPlayerFullMode: true
}
const mapStateToProps = state => {
    return {
        isPlayerFullMode: state[consts.MAIN].isPlayerFullMode,
        isPlayerOpen: state[consts.MAIN].isPlayerOpen,
    }
}
export default connect(mapStateToProps)(memo(StationsList));