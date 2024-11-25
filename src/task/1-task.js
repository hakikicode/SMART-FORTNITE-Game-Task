import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { namespaceWrapper } from "@_koii/namespace-wrapper";

// Fortnite API Configuration
const FORTNITE_API_BASE = "https://fortnite-api.com/v2";
const API_KEY = process.env.FORTNITE_API_KEY;
if (!API_KEY) {
  throw new Error("Missing FORTNITE_API_KEY environment variable.");
}

// Preprocessing Fortnite Leaderboard Data
function preprocessFortniteData(rawData) {
  return rawData.map((player) => ({
    gameName: "Fortnite",
    playerName: player.name || "unknown",
    score: player.stats?.kills || 0, // Use 'kills' as the score
    timestamp: new Date().toISOString(),
    metadata: {
      platform: player.platform || "unknown",
      mode: player.mode || "Battle Royale",
      region: player.region || "global",
      matchId: player.matchId || "unknown",
    },
  }));
}

// Fetch Fortnite Leaderboard Data
async function fetchFortniteLeaderboard() {
  try {
    const response = await axios.get(`${FORTNITE_API_BASE}/leaderboards`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (response.data && response.data.data) {
      return preprocessFortniteData(response.data.data);
    } else {
      throw new Error("Invalid response structure from Fortnite API");
    }
  } catch (error) {
    console.error("Error fetching Fortnite leaderboard:", error);
    return [];
  }
}

// Main Task Logic
export async function task(roundNumber) {
  try {
    console.log(`Executing SMART task for round ${roundNumber}...`);

    // Fetch and preprocess Fortnite leaderboard data
    const leaderboardData = await fetchFortniteLeaderboard();

    if (leaderboardData.length === 0) {
      console.error("No leaderboard data fetched.");
      return;
    }

    // Store the processed data
    const storageKey = `round_${roundNumber}_fortniteLeaderboard`;
    await namespaceWrapper.storeSet(storageKey, JSON.stringify(leaderboardData));
    console.log("Fortnite leaderboard data stored successfully:", leaderboardData);
  } catch (error) {
    console.error("Error executing SMART task:", error);
  }
}
