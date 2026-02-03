import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Consts from "../../utilities/consts";
import topTags from "../../info/topTags.json";
import { hashtigify } from "../../utilities/tools";
import { useTranslation } from "react-i18next";
import "./Suggestions.scss";

const Suggestions = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [shuffledTags, setTagsArr] = useState();
    const list = Object.freeze([
        { name: "music", icon: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="M16 9V7h-4v5.5c-.42-.31-.93-.5-1.5-.5A2.5 2.5 0 0 0 8 14.5a2.5 2.5 0 0 0 2.5 2.5a2.5 2.5 0 0 0 2.5-2.5V9zm-4-7a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2"/></svg>), id: "fhisofhoweq" },
        { name: "sports", icon: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="M2.34 14.63c.6-.22 1.22-.33 1.88-.33q2.01 0 3.51 1.26L4.59 18.7a10.6 10.6 0 0 1-2.25-4.07M15.56 9.8c1.97 1.47 4.1 1.83 6.38 1.08c.03.21.06.59.06 1.12c0 1.03-.25 2.18-.72 3.45c-.47 1.26-1.05 2.28-1.73 3.05l-6.33-6.31zm-6.79 6.84c1.06 1.53 1.28 3.2.65 5.02c-1.42-.41-2.69-1.05-3.75-1.93zm3.42-3.42l6.31 6.33c-2.17 1.9-4.72 2.7-7.62 2.39c.21-.66.32-1.38.32-2.16c0-.62-.14-1.35-.42-2.18s-.61-1.51-.98-2.04zM8.81 14.5a6.7 6.7 0 0 0-3.23-1.59c-1.22-.23-2.39-.16-3.52.22c-.03-.22-.06-.6-.06-1.13c0-1.03.25-2.18.72-3.45c.47-1.26 1.05-2.28 1.73-3.05l6.66 6.69zm6.75-6.77c-1.34-1.65-1.65-3.45-.93-5.39c.62.16 1.33.46 2.13.92c.79.45 1.44.9 1.94 1.33zm6.1 1.65c-.6.21-1.22.32-1.88.32c-1.09 0-2.14-.32-3.14-.98l3.09-3.05c.88 1.1 1.52 2.33 1.93 3.71m-9.47 1.73L5.5 4.45c2.17-1.9 4.72-2.7 7.63-2.39q-.33.99-.33 2.16c0 .72.16 1.53.49 2.44c.33.9.71 1.62 1.21 2.15z"/></svg>), id: "fepjofefwfh" },
        { name: "news", icon: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="M4 7v12h15v2H4c-2 0-2-2-2-2V7zm17-2v10H8V5zm.3-2H7.7C6.76 3 6 3.7 6 4.55v10.9c0 .86.76 1.55 1.7 1.55h13.6c.94 0 1.7-.69 1.7-1.55V4.55C23 3.7 22.24 3 21.3 3M9 6h3v5H9zm11 8H9v-2h11zm0-6h-6V6h6zm0 3h-6V9h6z"/></svg>), id: "wofnkwggwwg" },
        { name: "movies", icon: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="M4 6H2v14a2 2 0 0 0 2 2h14v-2H4zm16-4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2M10 15H8v-2h2zm0-4H8V9h2zm0-4H8V5h2zm10 8h-2v-2h2zm0-4h-2V9h2zm0-4h-2V5h2z"/></svg>), id: "wf9u0ngpwgg" },
        { name: "comedy", icon: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="M8.11 19.45a6.95 6.95 0 0 1-4.4-5.1L2.05 6.54c-.24-1.08.45-2.14 1.53-2.37l9.77-2.07l.03-.01c1.07-.21 2.12.48 2.34 1.54l.35 1.67l4.35.93h.03c1.05.24 1.73 1.3 1.51 2.36l-1.66 7.82a6.993 6.993 0 0 1-8.3 5.38a6.9 6.9 0 0 1-3.89-2.34M20 8.18L10.23 6.1l-1.66 7.82v.03c-.57 2.68 1.16 5.32 3.85 5.89s5.35-1.15 5.92-3.84zm-4 8.32a2.96 2.96 0 0 1-3.17 1.39a2.97 2.97 0 0 1-2.33-2.55zM8.47 5.17L4 6.13l1.66 7.81l.01.03c.15.71.45 1.35.86 1.9c-.1-.77-.08-1.57.09-2.37l.43-2c-.45-.08-.84-.33-1.05-.69c.06-.61.56-1.15 1.25-1.31h.25l.78-3.81c.04-.19.1-.36.19-.52m6.56 7.06c.32-.53 1-.81 1.69-.66c.69.14 1.19.67 1.28 1.29c-.33.52-1 .8-1.7.64c-.69-.13-1.19-.66-1.27-1.27m-4.88-1.04c.32-.53.99-.81 1.68-.66c.67.14 1.2.68 1.28 1.29c-.33.52-1 .81-1.69.68c-.69-.17-1.19-.7-1.27-1.31m1.82-6.76l1.96.42l-.16-.8z"/></svg>), id: "f0ufn0wgujy" },
        { name: "bbc", icon: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="M20 3H4c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2M5 7h5v6H5zm14 10H5v-2h14zm0-4h-7v-2h7zm0-4h-7V7h7z"/></svg>), id: "fw9ufnwptgw" },
        { name: "motivation", icon: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="m13.16 22.19l-1.66-3.84c1.6-.58 3.07-1.35 4.43-2.27l-2.78 6.11m-7.5-9.69l-3.84-1.65l6.11-2.78a20 20 0 0 0-2.27 4.43M21.66 2.35S23.78 7.31 18.11 13c-2.2 2.17-4.58 3.5-6.73 4.34c-.74.28-1.57.1-2.12-.46l-2.13-2.13c-.56-.56-.74-1.38-.47-2.13C7.5 10.5 8.83 8.09 11 5.89C16.69.216 21.66 2.35 21.66 2.35M6.25 22H4.84l4.09-4.1c.3.21.63.36.97.45zM2 22v-1.41l4.77-4.78l1.43 1.42L3.41 22zm0-2.84v-1.41l3.65-3.65c.09.35.24.68.45.97zM16 6a2 2 0 1 0 0 4c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"/></svg>), id: "9w8y9twg2lg" },
        { name: "health", icon: (<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="M7.5 4A5.5 5.5 0 0 0 2 9.5c0 .5.09 1 .22 1.5H6.3l1.27-3.37c.3-.8 1.48-.88 1.86 0L11.5 13l.59-1.42c.13-.33.48-.58.91-.58h8.78c.13-.5.22-1 .22-1.5A5.5 5.5 0 0 0 16.5 4c-1.86 0-3.5.93-4.5 2.34C11 4.93 9.36 4 7.5 4M3 12.5a1 1 0 0 0-1 1a1 1 0 0 0 1 1h2.44L11 20c1 .9 1 .9 2 0l5.56-5.5H21a1 1 0 0 0 1-1a1 1 0 0 0-1-1h-7.6l-.93 2.3c-.4 1.01-1.55.87-1.92.03L8.5 9.5l-.96 2.33c-.15.38-.49.67-.94.67z"/></svg>), id: "fwu0wpgwgwi" },
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
            navigate(`${Consts.CATEGORY}?tag=${name}&order=votes&reverse=true`);
        }
    }

    return (
        <div className="fluid-container">
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
                                        {item.icon}
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
        </div>
    )
};

export default Suggestions;