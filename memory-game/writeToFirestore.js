export default async function writeToFirestore(collectionName, data) {
  try {
    const db = window.database;
    const collectionRef = window.collection(db, collectionName);

    const start = performance.now();

    await window.addDoc(collectionRef, {
      ...data,
      Date: window.serverTimestamp(),
    });

    const end = performance.now();
    console.log(`Write to Firestore took ${(end - start).toFixed(2)} ms`);

    return true;
  } catch (error) {
    console.error("Firestore error:", error);
    return false;
  }
}