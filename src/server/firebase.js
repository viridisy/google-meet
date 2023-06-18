import firebase from "firebase/compat/app"
import "firebase/compat/database"

const firebaseConfig={
    apiKey:"AIzaSyCAKM97XZDH0z7S4NsgSm9nHaG_z-9bqxo",
    databaseURL:"https://webrtc-378901-default-rtdb.firebaseio.com/",
};

firebase.initializeApp(firebaseConfig);



let dbRef=firebase.database().ref();

export let connectedRef=firebase.database().ref(".info/connected");

export const userName=prompt("What's your name?");

const urlParams=new URLSearchParams(window.location.search);
const roomId=urlParams.get("id");

if(roomId){
    dbRef=dbRef.child(roomId);
}else{
    dbRef=dbRef.push();
    window.history.replaceState(null, "Meet", "?id="+dbRef.key);
}

export default dbRef;
