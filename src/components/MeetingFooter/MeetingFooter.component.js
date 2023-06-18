import {
    faDesktop,
    faMicrophone,
    faVideo,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "./MeetingFooter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const MeetingFooter=()=>{
    return (
        <div className="meetingFooter">
            <div className="meetingIcons">
                <FontAwesomeIcon icon={faMicrophone} />
            </div>
            <div className="meetingIcons">
                <FontAwesomeIcon icon={faVideo}/>
            </div>
            <div className="meetingIcons">
                <FontAwesomeIcon icon={faDesktop}/>
            </div>
        </div>
    );
};