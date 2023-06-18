import React from "react";
import "./MainScreen.css";
import { MeetingFooter } from "../MeetingFooter/MeetingFooter.component";
import { Participants } from "../Participants/Participants.component";

export const MainScreen=()=>{
    return (
        <div className="wrapper">
            <div className="mainScreen">
                <Participants />
            </div>
            <div className="footer">
                <MeetingFooter />    
            </div>
        </div>
    );
};