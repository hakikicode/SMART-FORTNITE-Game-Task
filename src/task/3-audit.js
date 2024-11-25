import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function audit(submission, roundNumber, submitterKey) {
  console.log(`Auditing submission for round ${roundNumber} from ${submitterKey}`);

  try {
    const parsedData = JSON.parse(submission);
    const isValid = parsedData.PlayerScore > 0;

    console.log("Audit result:", isValid ? "Valid" : "Invalid");
    return isValid;
  } catch (error) {
    console.error("Audit error:", error);
    return false;
  }
}
