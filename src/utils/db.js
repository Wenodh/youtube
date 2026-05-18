import Dexie from "dexie";

export const db = new Dexie("youtubeCloneDB");
db.version(1).stores({
  downloads: "id, title, channelTitle, addedAt",
});
