const db = firebase.firestore();

function submitLostProduct(product) {
  db.collection("lostProducts")
    .add(product)
    .then((docRef) => {
      console.log("Lost product submitted with ID: ", docRef.id);
      alert("Lost item reported successfully");
    })
    .catch((error) => {
      console.error("Error adding lost product: ", error);
      alert("Error reporting lost item");
    });
}
