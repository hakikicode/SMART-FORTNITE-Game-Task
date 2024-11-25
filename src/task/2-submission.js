import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function submission(roundNumber) {
  try {
    console.log(`Submitting data for round ${roundNumber}`);
    const gameData = await namespaceWrapper.storeGet(`round_${roundNumber}_fortniteLeaderboard`);
    return gameData; // Return stored data for validation/auditing
  } catch (error) {
    console.error("Submission error:", error);
  }
}
