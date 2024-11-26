import crypto from "crypto"; // For hashing
import { namespaceWrapper } from "@_koii/namespace-wrapper";

// Generate Hash for Data
function hashData(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

// Handle Submission
export async function submission(roundNumber) {
  try {
    console.log(`Submitting data for round ${roundNumber}`);
    const gameData = await namespaceWrapper.storeGet(`round_${roundNumber}_fortnitePlaylists`);
    if (!gameData) {
      console.warn("No data available for submission.");
      return "{}";
    }

    const dataHash = hashData(gameData);
    const submittedHashes = JSON.parse(await namespaceWrapper.storeGet(`round_${roundNumber}_submittedHashes`) || "[]");

    if (submittedHashes.includes(dataHash)) {
      console.warn("Duplicate submission detected. Skipping.");
      return "{}"; // Skip submission
    }

    // Add hash to submitted hashes
    submittedHashes.push(dataHash);
    await namespaceWrapper.storeSet(`round_${roundNumber}_submittedHashes`, JSON.stringify(submittedHashes));

    console.log("Data submitted successfully:", gameData);
    return gameData;
  } catch (error) {
    console.error("Submission error:", error);
    return "{}";
  }
}
