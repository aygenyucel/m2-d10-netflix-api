import fs from "fs-extra";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");

const mediasJSONPath = join(dataFolderPath, "medias.json");

export const getMedias = () => {
  return fs.readJson(mediasJSONPath);
};

export const writeMedias = (mediasArray) => {
  return fs.writeJson(mediasJSONPath, mediasArray);
};
