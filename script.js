const options = [
  "Week 7 - First Session",
  "Week 7 - Second Session",
  "Week 8 - First Session",
  "Week 8 - Second Session",
  "Week 9 - First Session",
  "Week 9 - Second Session",
  "No Bedside Assignment",
  "No Bedside Assignment",
  "No Bedside Assignment",
  "No Bedside Assignment",
  "No Bedside Assignment",
  "No Bedside Assignment"
];

async function spin() {
  const id = document.getElementById("userId").value.trim();
  const wheel = document.getElementById("wheel");
  const resultBox = document.getElementById("result");

  if (!id) {
    alert("Enter ID first");
    return;
  }

  const userRef = db.collection("assignments").doc(id);
  const doc = await userRef.get();

  // already assigned
  if (doc.exists) {
    resultBox.innerHTML = "🎯 Your assignment: " + doc.data().value;
    return;
  }

  const poolRef = db.collection("system").doc("pool");
  const poolDoc = await poolRef.get();

  let pool = poolDoc.exists ? poolDoc.data().items : [...options];

  if (pool.length === 0) {
    resultBox.innerHTML = "No assignments left!";
    return;
  }

  const index = Math.floor(Math.random() * pool.length);
  const chosen = pool[index];

  // wheel animation
  const angle = 3600 + (index * 30);
  wheel.style.transform = `rotate(${angle}deg)`;

  setTimeout(async () => {

    pool.splice(index, 1);
    await poolRef.set({ items: pool });

    await userRef.set({
      value: chosen,
      timestamp: Date.now()
    });

    resultBox.innerHTML = "🎉 Your assignment: " + chosen;

  }, 4000);
}
