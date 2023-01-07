import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

exports.createUser = functions.auth.user().onCreate((user) =>
  admin.firestore().collection("users").doc(user.uid).set({
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  })
);

exports.copyEventToUser = functions.firestore
  .document("events/{eventId}/members/{userId}")
  .onCreate(async (_, context) => {
    const { eventId, userId } = context.params;
    const eventRef = admin.firestore().collection("events").doc(eventId);
    const usersRef = admin.firestore().collection("users");
    const userRef = usersRef.doc(userId);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return null;
    }

    const usersEventsRef = usersRef.doc(userId).collection("events");
    const eventDoc = await eventRef.get();
    const event = eventDoc.data();
    if (!event) {
      return null;
    }
    return usersEventsRef.doc(eventId).set(event);
  });

exports.deleteEventFromUser = functions.firestore
  .document("events/{eventId}")
  .onDelete(async (_, context) => {
    const { eventId } = context.params;
    const usersRef = admin.firestore().collection("users");
    const eventRef = admin.firestore().collection("events").doc(eventId);
    const membersRef = eventRef.collection("members");
    const membersSnapshot = await membersRef.get();

    membersSnapshot.forEach(async (memberDoc) => {
      const userId = memberDoc.id;
      const userRef = usersRef.doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return;
      }

      const usersEventsRef = userRef.collection("events");
      usersEventsRef.doc(eventId).delete();
    });
  });
