import express from "express";
import uniqid from "uniqid";
import { getMedias, writeMedias } from "./../../lib/fs-tools.js";
import httpError from "http-errors";

const mediasRouter = express.Router();

mediasRouter.post("/", async (req, res, next) => {
  try {
    const newMedia = { ...req.body, createdAt: new Date(), id: uniqid() };
    const mediasArray = await getMedias();
    mediasArray.push(newMedia);
    writeMedias(mediasArray);
    res.status(201).send({ id: newMedia.id });
  } catch (error) {
    next(error);
  }
});

mediasRouter.get("/", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    res.send(mediasArray);
  } catch (error) {
    next(error);
  }
});

mediasRouter.get("/:id", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    const media = mediasArray.find((media) => media.id === req.params.id);

    if (media) {
      res.send(media);
    } else {
      next(httpError.NotFound(`Media with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

mediasRouter.put("/:id", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();

    const index = mediasArray.findIndex((media) => media.id === req.params.id);

    if (index !== -1) {
      const oldMedia = mediasArray[index];
      const updatedMedia = { ...oldMedia, ...req.body, updatedAt: new Date() };
      mediasArray[index] = updatedMedia;
      writeMedias(mediasArray);
      res.send(updatedMedia);
    } else {
      next(httpError.NotFound(`Media with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

mediasRouter.delete("/:id", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    const remainingMedias = mediasArray.filter(
      (media) => media.id !== req.params.id
    );

    if (mediasArray.length !== remainingMedias.length) {
      await writeMedias(remainingMedias);
      res.status(204).send();
    } else {
      next(httpError.NotFound(`Book with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
