import React, { Fragment } from "react";
import "./About.scss";
import { ImGithub } from "react-icons/im";
import { MdEmail } from "react-icons/md";
import { AiFillInstagram, AiFillCodepenCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const About = () => {
    const { t } = useTranslation();
    const contactList = Object.freeze([
        {type: "github", title: "Github",url: "https://github.com/Mahmoud-farargy", icon: (<ImGithub style={{ fontSize: "30px" }} />), id: "github"},
        {type: "gmail", title: "Email",url: "mailto:mahmoudfarargy9@gmail.com", icon: (<MdEmail style={{ fontSize: "35px" }} />), id: "gmail"},
        {type: "instagram", title: "Instagram",url: "https://www.instagram.com/codepugilist", icon: (<AiFillInstagram style={{ fontSize: "35px" }} />), id: "instagram"},
        {type: "codepen", title: "Code Pen",url: "https://codepen.io/mahmoud-farargy/pens/public", icon: (<AiFillCodepenCircle style={{ fontSize: "35px" }} />), id: "codepen"},
    ]);
    
    return (
        <Fragment>
            <div id="about--container" className="flex-column">
                <div className="about--inner">
                    <div className="about-sub flex-column">
                        <div className="flex-column about-section-inner">
                            <h2>{t("self_introduction")} Mahmoud <br /> Farargy</h2>

                            <p>{t("about_me")} <a target="_blank" rel="noopener noreferrer" href="https://mahmoudportfolio.netlify.app">Portfolio.</a></p>
                            <ul className="flex-row socials--links">
                                {
                                    contactList && contactList.length > 0 &&
                                    contactList.map((contactItem, idx) => {
                                        return (
                                            <li title={contactItem.title} key={`${contactItem.id}${idx}`}>
                                                <a href={contactItem.url} rel="noopener noreferrer" target="_blank">
                                                    {contactItem.icon}
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default About;