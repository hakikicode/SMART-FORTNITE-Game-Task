import { namespaceWrapper, app } from "@_koii/namespace-wrapper";

export function routes() {
  // Route for retrieving leaderboard data
  app.get("/fortnite-leaderboard/:roundNumber", async (req, res) => {
    const roundNumber = req.params.roundNumber;
    const leaderboard = await namespaceWrapper.storeGet(`round_${roundNumber}_fortniteLeaderboard`);
    res.status(200).json({ leaderboard: JSON.parse(leaderboard || "{}") });
  });
}
