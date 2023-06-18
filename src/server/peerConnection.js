import dbRef from "./firebase";
import { store } from "..";

const participantRef=dbRef.child("participants");

export const createOffer=async(peerConnection, createdId, receiverId)=>{
    const receiverRef=participantRef.child(receiverId);
    const offer = await peerConnection.createOffer();

    peerConnection.oncandidate=event=>{
        event.candidate &&
            receiverRef
            .child("offerCandidates")
            .push({...event.candidate.toJSON(), userId: createdId});
    };

    await peerConnection.setLocalDescription(offer);

    const offerPayload={
        sdp: offer.sdp,
        type: offer.type,
        userId: createdId,
    };

    await receiverRef.child("offers").push().set({offerPayload});
};

export const initializedListeners=async (currentUserId)=>{
    const receiverRef=participantRef.child(currentUserId);
    receiverRef.child("offers").on("child_added", async(snapshot)=>{
        const data=snapshot.val();
        if(data?.offerPayload){
            const createrId=data?.offerPayload.userId;
            const peerConnection=store.getState().participants[createrId].peerconnection;

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(data.offerPayload)
            );

            console.log("create answer");
            await createAnswer(currentUserId, createrId);
        }
    });

    receiverRef.child("offerCandidates").on("child_added", async(snapshot)=>{
        const data=snapshot.val();
        if(data.userId){
            const peerConnection=
                store.getState().participants[data?.userId].peerconnection;

            peerConnection.addIcecandidates(
                new RTCIceCandidate(data)
            );
        }
    });

    receiverRef.child("answers").on("child_added", async(snapshot)=>{
        const data=snapshot.val();
        if(data?.answerPayload){
            const createrId=data.answerPayload.userId;
            const peerConnection=
                store.getState().participants[createrId].peerconnection;

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(data?.answerPayload)
            );
        }
    });

    receiverRef.child("answerCandidates").on("child_added", async(snapshot)=>{
        const data=snapshot.val();
        if(data.userId){
            const peerConnection=
                store.getState().participants[data?.userId].peerconnection;

            peerConnection.addIcecandidates(
                new RTCIceCandidate(data)
            );
        }
    });

    const createAnswer=async (currentUserId, receiverId)=>{
        const peerConnection=store.getState().participants[receiverId].peerConnection;
        const receiverRef=participantRef.child(receiverId);
        const answer = await peerConnection.createAnswer();

        peerConnection.oncandidate=event=>{
            event.candidate &&
                receiverRef.child("answerCandidates")
                .push({...event.candidate.toJSON(), userId: currentUserId});
        };

        await peerConnection.setLocalDescription(answer);

        const answerPayload={
            sdp: answer.sdp,
            type: answer.type,
            userId: currentUserId,
        };

        await receiverRef.child("answers").push().set({answerPayload});
    };
};

