import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Consts from "../../utilities/consts";
import topTags from "../../info/topTags.json";
import { hashtigify } from "../../utilities/tools";
import { useTranslation } from "react-i18next";
import "./Suggestions.scss";

const Suggestions = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const [shuffledTags, setTagsArr] = useState();
    const list = Object.freeze([
        { name: "music", icon: "musical", id: "fhisofhoweq" },
        { name: "sports", icon: "sit-ups-skin", id: "fepjofefwfh" },
        { name: "news", icon: "news", id: "wofnkwggwwg" },
        { name: "movies", icon: "film-reel", id: "wf9u0ngpwgg" },
        { name: "comedy", icon: "comedy", id: "f0ufn0wgujy" },
        { name: "bbc", icon: "bbc", id: "fw9ufnwptgw" },
        { name: "motivation", icon: "effort", id: "9w8y9twg2lg" },
        { name: "health", icon: "heart-health", id: "fwu0wpgwgwi" },
    ]);
    useEffect(() => {
        if (topTags && topTags.length > 0) {
            function shuffleTags(array) {
                let currentIndex = array.length,  randomIndex;
                while (currentIndex !== 0) {
                  randomIndex = Math.floor(Math.random() * currentIndex);
                  currentIndex--;
                  [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
                }
                return array;
            }
            setTagsArr(shuffleTags(topTags?.slice(0,33) || []));
        }

    }, []);
    const openCategory = (name) => {
        if(name){
            history.push(`${Consts.CATEGORY}?tag=${name}&order=votes&reverse=true`);
        }
    }

    return (
        <Fragment>
            {/* Recommended */}
            <section id="suggestions">
                <div id="recommended">
                    <div className="suggestions--box--header flex-row">
                        <h4 className="list--name">{t("suggs.recommended_title")}</h4>
                    </div>
                    <ul className="remomended--list">
                        {
                            list && list.length > 0 &&
                            list.map((item, idx) => (
                                <li key={item.id || idx} onClick={() => openCategory(item.name)} className="recommended--item">
                                    <div className="recommended--item--inner flex-column">
                                        <img src={require(`../../desgin/Assets/Categories/${item.icon}.png`)?.default} loading="lazy" alt={`${item.name} category`} />
                                        <h5>{item.name}</h5>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>

                </div>
                <div id="featured">
                    <div className="suggestions--box--header flex-row">
                        <h4 className="list--name">{t("suggs.pop_tags_title")}</h4>
                        {/* <span className="see--all--btn">{t("titles.see_all")}</span> */}
                    </div>
                    {shuffledTags && shuffledTags.length > 0 &&
                        <ul className="pop--tags--list">

                            {shuffledTags.map((item, idx) => (
                                <li key={item.id || idx} onClick={() => openCategory(item)} className="pop--tags--list--item">
                                    <span className="pop--tag">{hashtigify(item)}</span>
                                </li>
                            ))
                            }
                        </ul>
                    }
                </div>
            </section>
        </Fragment>
    )
};

export default Suggestions;