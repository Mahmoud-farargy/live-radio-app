import React from "react";
import { HiOutlineEmojiSad } from "react-icons/hi";
const EmptyResults = ({msg}) => {
    return (
        <div className="empty--box flex-row">
            <div className="empty--box--inner flex-row">
                <HiOutlineEmojiSad /> <h3>{msg}</h3>  
            </div>
        </div>
    )
};
export default EmptyResults;