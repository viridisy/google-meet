import { initializedListeners } from "../server/peerConnection";
import { createOffer } from "../server/peerConnection";
import { ADD_PARTICIPANT, REMOVE_PARTICIPANT, SET_USER, SET_USERSTREAM } from "./actiontypes";

let initialState={
    currentUser:null,
    participants:{},
    mainStream: null,
};

const stunServers={
    iceServers:[
        {
            urls:[
                "stun:stun1.1.google.com:19302",
                "stun:stun2.1.google.com:19302",
                "stun:stun.1.google.com:19302",
                "stun:stun3.1.google.com:19302",
                "stun:stun4.1.google.com:19302",
                "stun:stun.services.mozilla.com",
            ]
        }
    ]
};

export const reducer=(state=initialState, action)=>{
    switch(action.type){
        case SET_USERSTREAM:{
            let {payload}=action;
            state={...state, ...payload};
            console.log("set userstream");
            return state;
        }
        case SET_USER:{
            let {payload}=action;
            state={...state, currentUser: {...payload.currentUser}};
            initializedListeners(Object.keys(payload.currentUser)[0]);
            return state;
        }
        
        case ADD_PARTICIPANT:{
            console.log("add participant");
            let {payload}=action;
            const currentUserId=Object.keys(state.currentUser)[0];
            const participantId=Object.keys(payload.participant)[0];
            console.log(currentUserId, participantId);
            if(currentUserId===participantId){
                payload.participant[participantId].currentUser=true;
            }
            else
                payload.participant[participantId].currentUser=false;
            console.log(state.mainStream);
            console.log(payload.participant[participantId].currentUser);
            console.log(state.mainStream && !payload.participant[participantId].currentUser);
            if(state.mainStream && !payload.participant[participantId].currentUser){
                addConnection(state.currentUser, payload.participant, state.mainStream);
            }
            payload.participant[participantId].avatarColor=`#${Math.floor(
                Math.random()*16777215
                ).toString(16)}`;
            let participants={...state.participants, ...payload.participant};
            state={...state, participants};
            return state;
        }
        case REMOVE_PARTICIPANT:{
            let {payload}=action;
            let participants={...state.participants};
            delete participants[payload.participantKey];
            state={...state, participants};
            return state;
        }
        default:{
            return state;
        }
    }
};

const addConnection=(currentUser, newUser, mediaStream)=>{
    console.log("connection added");
    const peerConnection=new RTCPeerConnection(stunServers);
    mediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, mediaStream);
    });

    const currentUserKey=Object.keys(currentUser)[0];
    const newUserKey=Object.keys(newUser)[0];

    const sortedIDs=[currentUserKey, newUserKey].sort((a, b)=>
        a.localeCompare(b)
    );

    newUser[newUserKey].peerConnection=peerConnection;

    if(sortedIDs[1]===currentUserKey){
        createOffer(peerConnection, sortedIDs[1], sortedIDs[0]);
    }
};