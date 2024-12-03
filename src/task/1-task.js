import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import crypto from "crypto"; // For hashing
import { namespaceWrapper } from "@_koii/namespace-wrapper";

// Fortnite API Configuration
const FORTNITE_API_BASE = "https://fortnite-api.com/v1";
const API_KEY = process.env.FORTNITE_API_KEY;

if (!API_KEY) {
  console.warn("FORTNITE_API_KEY is missing. Skipping Fortnite integration.");
}

// Fetch Fortnite Playlists Data
async function fetchFortnitePlaylists() {
  if (!API_KEY) {
    console.warn("Skipping playlist fetch due to missing API key.");
    return [];
  }

  try {
    const response = await axios.get(`${FORTNITE_API_BASE}/playlists`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (response.data && response.data.data) {
      return preprocessFortnitePlaylists(response.data.data);
    } else {
      throw new Error("Invalid response structure from Fortnite API");
    }
  } catch (error) {
    console.error("Error fetching Fortnite playlists:", error.response?.data || error.message);
    return [];
  }
}

// Preprocess Fortnite Playlist Data
function preprocessFortnitePlaylists(rawData) {
  return rawData.map((playlist) => ({
    gameName: "Fortnite",
    playlistName: playlist?.name || "Unknown",
    description: playlist?.description || "No description available",
    isActive: playlist?.isActive || false,
    gameType: playlist?.gameType || "Unknown",
    maxPlayers: playlist?.maxPlayers || 0,
    timestamp: new Date().toISOString(),
    metadata: {
      category: playlist?.category || "General",
      subName: playlist?.subName || "N/A",
    },
  }));
}

// Generate Hash for Duplicate Detection
function hashData(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

// Deduplicate Data
function deduplicateData(data) {
  const seenHashes = new Set();
  return data.filter((item) => {
    const itemHash = hashData(item);
    if (seenHashes.has(itemHash)) {
      return false; // Duplicate found, skip
    }
    seenHashes.add(itemHash);
    return true;
  });
}

// Main Task Logic
export async function task(roundNumber) {
  try {
    console.log(`Executing SMART task for round ${roundNumber}...`);

    // Fetch playlists and preprocess
    let playlistsData = await fetchFortnitePlaylists();

    if (playlistsData.length === 0) {
      console.warn("No playlists data fetched. Storing an empty array.");
      await namespaceWrapper.storeSet(`round_${roundNumber}_fortnitePlaylists`, JSON.stringify([]));
      return;
    }

    // Deduplicate the data
    playlistsData = deduplicateData(playlistsData);

    // Generate hash for deduplicated data
    const playlistsHash = hashData(playlistsData);
    const existingHashes = JSON.parse(await namespaceWrapper.storeGet(`round_${roundNumber}_hashes`) || "[]");

    // Check for duplicates
    if (existingHashes.includes(playlistsHash)) {
      console.warn("Duplicate data detected for this round. Skipping storage.");
      return;
    }

    // Store the processed data and update hash record
    const storageKey = `round_${roundNumber}_fortnitePlaylists`;
    await namespaceWrapper.storeSet(storageKey, JSON.stringify(playlistsData));
    existingHashes.push(playlistsHash);
    await namespaceWrapper.storeSet(`round_${roundNumber}_hashes`, JSON.stringify(existingHashes));

    console.log("Fortnite playlists data stored successfully:", playlistsData);
  } catch (error) {
    console.error("Error executing SMART task:", error);
  }
}
