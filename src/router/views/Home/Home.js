import React from "react";
import Auxiliary from "../../../components/HOC/Auxiliary";
import SlidableList from "../../../components/SlidableList/SlidableList";
import Suggestions from "../../../components/Suggestions/Suggestions";
import topTags from "../../../info/topTags.json";

const Home = () => {
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
             <SlidableList params={{tag: getRandomList(),order: "random"}}
            />
            <Suggestions />
             <SlidableList params={{tag:  getRandomList(), order: "random"}}
            />
            {/* languages & countries */}
             <SlidableList params={{tag:  getRandomList(), order: "random"}}
            />
            <SlidableList params={{tag:  getRandomList(), order: "random"}}
            />
            
        </Auxiliary>
    )
};

export default Home;