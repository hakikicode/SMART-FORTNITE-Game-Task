import crypto from "crypto";
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

    // Generate a hash for the data
    const dataHash = hashData(gameData);
    const submittedHashes = JSON.parse(await namespaceWrapper.storeGet(`round_${roundNumber}_submittedHashes`) || "[]");

    if (submittedHashes.includes(dataHash)) {
      console.warn("Duplicate submission detected. Skipping.");
      return "{}"; // Skip submission
    }

    // Store the hash to prevent future duplicates
    submittedHashes.push(dataHash);
    await namespaceWrapper.storeSet(`round_${roundNumber}_submittedHashes`, JSON.stringify(submittedHashes));

    // Submit the hash instead of full data to reduce size
    console.log("Hash submitted successfully:", dataHash);
    return JSON.stringify({ hash: dataHash });
  } catch (error) {
    console.error("Submission error:", error.message);
    return "{}";
  }
}
