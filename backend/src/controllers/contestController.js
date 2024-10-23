import { db } from "../lib/db.js";

export const getContests = async (req, res) => {
  try {
    const contests = await db.contest.findMany();
    res.json(contests);
  } catch (error) {
    console.log("error on getContests", error);
    res.status(500).json({ message: error.message });
  }
};

export const getContestById = async (req, res) => {
  try {
    const contest = await db.contest.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!contest) {
      res.status(404).json({ message: "Contest not found" });
      return;
    }

    res.json(contest);
  } catch (error) {
    console.log("error on getContestById", error);
    res.status(500).json({ message: error.message });
  }
};

export const createContest = async (req, res) => {
  try {
    const { name, location, organizer, startDate, endDate } = req.body;
    const contest = await db.contest.create({
      data: { name, location, organizer, startDate, endDate },
    });
    res.json(contest);
  } catch (error) {
    console.log("error on createContest", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateContest = async (req, res) => {
  try {
    const { name, location, organizer, startDate, endDate } = req.body;
    const ifExistContest = db.contest.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!ifExistContest) {
      res.status(404).json({ message: "Contest not found" });
      return;
    }

    const contest = await db.contest.update({
      where: { id: parseInt(req.params.id) },
      data: { name, location, organizer, startDate, endDate },
    });
    res.json(contest);
  } catch (error) {
    console.log("error on updateContest", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteContest = async (req, res) => {
  try {
    const contest = db.contest.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!contest) {
      res.status(404).json({ message: "Contest not found" });
      return;
    }

    await db.contest.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Contest deleted" });
  } catch (error) {
    console.log("error on deleteContest", error);
    res.status(500).json({ message: error.message });
  }
};
