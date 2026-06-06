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
  const resultBox = document.getElementById("result");

  if (!id) {
    alert("Enter ID first");
    return;
  }

  const userRef = db.collection("assignments").doc(id);

  // 1. Check if ID already used
  const doc = await userRef.get();

  if (doc.exists) {
    resultBox.innerHTML = "Your assignment: " + doc.data().value;
    return;
  }

  // 2. Get remaining pool
  const poolRef = db.collection("system").doc("pool");
  const poolDoc = await poolRef.get();

  let pool;

  if (!poolDoc.exists) {
    pool = [...options];
    await poolRef.set({ items: pool });
  } else {
    pool = poolDoc.data().items;
  }

  if (pool.length === 0) {
    resultBox.innerHTML = "No assignments left!";
    return;
  }

  // 3. Pick random
  const index = Math.floor(Math.random() * pool.length);
  const chosen = pool[index];

  // 4. Remove from pool
  pool.splice(index, 1);

  await poolRef.set({ items: pool });

  // 5. Save assignment
  await userRef.set({
    value: chosen,
    timestamp: Date.now()
  });

  // 6. Show result
  resultBox.innerHTML = "🎉 Your assignment: " + chosen;
}