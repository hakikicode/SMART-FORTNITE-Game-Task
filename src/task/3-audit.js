import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function audit(submission, roundNumber, submitterKey) {
  console.log(`Auditing submission for round ${roundNumber} from ${submitterKey}`);

  try {
    const storedData = await namespaceWrapper.storeGet(`round_${roundNumber}_fortnitePlaylists`);
    const parsedStoredData = JSON.parse(storedData || "[]");
    const parsedSubmission = JSON.parse(submission);

    // Ensure submitted data matches stored data
    const isValid = JSON.stringify(parsedStoredData) === JSON.stringify(parsedSubmission);

    console.log("Audit result:", isValid ? "Valid" : "Invalid");
    return isValid;
  } catch (error) {
    console.error("Audit error:", error);
    return false;
  }
}
