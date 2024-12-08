import React, { memo } from "react";
import Auxiliary from "../../../components/HOC/Auxiliary";
import SlidableList from "../../../components/SlidableList/SlidableList";
import Suggestions from "../../../components/Suggestions/Suggestions";
import topTags from "../../../info/topTags.json";
import * as Consts from "../../../utilities/consts";
import { connect } from "react-redux";
import { upperString } from "../../../utilities/tools";
import countriesListJSON from "../../../info/countriesList.json";


const Home = ({visitorLocation}) => {
    const getRandomList = () => {
        if(topTags){
            const rndm = Math.floor(Math.random() * topTags.length || 0);
            return topTags[rndm] || "";
        }
    }
    return (
        <Auxiliary>
            
            <SlidableList params={{order: "votes", reverse: true}}
                listTitle="Popular stations"
            />
            {
                visitorLocation?.country &&
                <SlidableList params={{countrycode: visitorLocation.country, reverse: true}}
                listTitle={`Local stations from ${(countriesListJSON.filter(el => upperString(el.code) === upperString(visitorLocation.country)).pop()?.name || visitorLocation.country)}`}/>
            }
             <SlidableList params={{tag: getRandomList(), order: "random"}}
            />
            <Suggestions />
             <SlidableList params={{tag:  getRandomList(), order: "random"}}
            />
             <SlidableList params={{tag:  getRandomList(), order: "random"}}
            />
            <SlidableList params={{tag:  getRandomList(), order: "random"}}
            />
            
        </Auxiliary>
    )
};
const mapStateToProps = state => {
    return {
        visitorLocation: state[Consts.MAIN].visitorLocation
    }
}
export default connect(mapStateToProps)(memo(Home));