import { db } from "../lib/db.js";

export const getWods = async (req, res) => {
  try {
    const wods = await db.wod.findMany();
    res.json(wods);
  } catch (error) {
    console.log("error on getWods", error);
    res.status(500).json({ message: error.message });
  }
};

export const getWodById = async (req, res) => {
  try {
    const wod = await db.wod.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!wod) {
      res.status(404).json({ message: "Wod not found" });
      return;
    }

    res.json(wod);
  } catch (error) {
    console.log("error on getWodById", error);
    res.status(500).json({ message: error.message });
  }
};

export const createWod = async (req, res) => {
  try {
    const { name, description } = req.body;
    const wod = await db.wod.create({
      data: { name, description },
    });
    res.json(wod);
  } catch (error) {
    console.log("error on createWod", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateWod = async (req, res) => {
  try {
    const { name, description } = req.body;
    const ifExistWod = db.wod.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!ifExistWod) {
      res.status(404).json({ message: "Wod not found" });
      return;
    }

    const wod = await db.wod.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description },
    });
    res.json(wod);
  } catch (error) {
    console.log("error on updateWod", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteWod = async (req, res) => {
  try {
    const wod = db.wod.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!wod) {
      res.status(404).json({ message: "Wod not found" });
      return;
    }

    await db.wod.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Wod deleted" });
  } catch (error) {
    console.log("error on deleteWod", error);
    res.status(500).json({ message: error.message });
  }
};
