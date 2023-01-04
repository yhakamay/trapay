import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

exports.createUser = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("users").doc(user.uid).set({
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  });
});

exports.copyEventToUser = functions.firestore
  .document("events/{eventId}/members/{userId}")
  .onCreate(async (snap, context) => {
    const { eventId, userId } = context.params;
    const event = snap.data();
    const usersRef = admin.firestore().collection("users");

    const userDoc = await usersRef.doc(userId).get();
    if (!userDoc.exists) {
      return null;
    }

    const usersEventsRef = usersRef.doc(userId).collection("events");
    return usersEventsRef.doc(eventId).set(event);
  });
