export async function setup() {
  console.log("CUSTOM SETUP: Verifying environment and API readiness");

  // Check API Key availability
  if (!process.env.FORTNITE_API_KEY) {
    throw new Error("Missing FORTNITE_API_KEY environment variable");
  }

  console.log("Setup complete. API key verified.");
}
