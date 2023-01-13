import express from "express";
import multer from "multer";
import { getMedias, writeMedias } from "../../lib/fs-tools.js";
import httpError from "http-errors";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";

const filesRouter = express.Router();

/* filesRouter.post("/:id/poster", async (req, res, next) => {
  try {
    console.log("fdklhfsdl", req.file);
    
    const mediasArray = await getMedias();

    const index = getMedias.findIndex((media) => media.id === req.params.id);

    if (index !== -1) {
      const oldMedia = mediasArray[index];

      const updatedMedia = {
        ...oldMedia,
        Poster: url,
        updatedAt: new Date(),
      };
      mediasArray[index] = updatedMedia;
      await writeMedias(mediasArray);
      res.send("File Uploaded");
    } else {
      next(httpError.NotFound(`Media with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
}); */

filesRouter.get("/:id/pdf", async (req, res, next) => {
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${req.params.id}.pdf`
  );

  const mediasArray = await getMedias();
  const media = mediasArray.find((media) => media.id === req.params.id);

  if (media) {
    const source = getPDFReadableStream(media);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
      else console.log("Stream ended successfully!");
    });
  } else {
    next(httpError.NotFound(`Media with id ${req.params.id} not found!`));
  }
});

export default filesRouter;
