import { namespaceWrapper, app } from "@_koii/namespace-wrapper";

export function routes() {
  app.get("/fortnite-playlists/:roundNumber", async (req, res) => {
    const roundNumber = req.params.roundNumber;
    const playlists = await namespaceWrapper.storeGet(`round_${roundNumber}_fortnitePlaylists`);
    res.status(200).json({ playlists: JSON.parse(playlists || "[]") });
  });
}
