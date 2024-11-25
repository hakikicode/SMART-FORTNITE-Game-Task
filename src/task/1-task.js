import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function task(roundNumber) {
  try {
    console.log(`Executing task for round ${roundNumber}`);

    // Fetch game data, e.g., player scores
    const gameData = await fetchGameData();

    // Store data for submission and audit
    await namespaceWrapper.storeSet(`round_${roundNumber}_gameData`, JSON.stringify(gameData));
    console.log("Game data stored for submission:", gameData);
  } catch (error) {
    console.error("Error in task execution:", error);
  }
}

// Simulated game data function
async function fetchGameData() {
  return {
    TG_Username: "hakikitech",
    PlayerScore: Math.floor(Math.random() * 1000), // Simulated score
  };
}
