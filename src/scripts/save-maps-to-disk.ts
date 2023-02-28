import { saveLevelMapToDisk } from "../level-maps";

saveLevelMapToDisk({ mapName: "levelTwoMap" }).catch((err: unknown) =>
  console.error("Error saving file", err)
);
