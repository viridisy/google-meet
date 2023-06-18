import React from "react";
import "./Participants.css";
import { Participant } from "./participant/Participant.component";
import { useSelector } from "react-redux";

export const Participants=()=>{
    const participants=useSelector((state)=>state.participants);
    return (
        <div className="participants">
                {Object.keys(participants).map((participantKey)=>{
                    const currentParticipant=participants[participantKey];
                    return (
                        <Participant participant={currentParticipant} key={participantKey}/>
                    );
                })}
        </div>
    );
};