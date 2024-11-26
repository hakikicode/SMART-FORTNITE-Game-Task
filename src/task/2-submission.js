import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function submission(roundNumber) {
  try {
    console.log(`Submitting data for round ${roundNumber}`);
    const gameData = await namespaceWrapper.storeGet(`round_${roundNumber}_fortnitePlaylists`);
    return gameData || "{}"; // Return stored data or an empty object
  } catch (error) {
    console.error("Submission error:", error);
  }
}
