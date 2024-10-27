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
      include: {
        contestCategory: {
          select: {
            id:true,
            category: {
              select: {
                name:true,
                id: true
              }
            }
          }
        }
      }
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
    const { name, location, organizer, startDate, endDate, status } = req.body;
    const contest = await db.contest.create({
      data: { name, location, organizer, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, status },  
    });
    res.json(contest);
  } catch (error) {
    console.log("error on createContest", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateContest = async (req, res) => {
  try {
    const { name, location, organizer, startDate, endDate, status } = req.body;
    const ifExistContest = db.contest.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!ifExistContest) {
      res.status(404).json({ message: "Contest not found" });
      return;
    }

    const contest = await db.contest.update({
      where: { id: parseInt(req.params.id) },
      data: { name, location, organizer, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, status },
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

export const addCategory = async (req, res) => {
  console.log("req ", req.params)
  try {
    const { id: contestId, categoryId } = req.params;
    const contest = await db.contestCategory.create({
      data: { contestId: parseInt(contestId), categoryId: parseInt(categoryId) },  
      include: {
        category: {
          select: {
            name:true,
            id: true
          }
        }
      }
    });
    res.json(contest);
  } catch (error) {
    console.log("error on createContestCategory", error);
    res.status(500).json({ message: error.message });
  }
};
export const removeCategory = async (req, res) => {
  const {id, categoryId} = req.params
  try {
    const category = db.contestCategory.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      res.status(404).json({ message: "Contest category not found" });
      return;
    }

    await db.contestCategory.delete({ where: { id: parseInt(categoryId) } });
    
    const contestCat = await db.contestCategory.findMany({
      where: { contestId: parseInt(id) },
      include: {
        category: {
          select: {
            name:true,
            id: true
          }
        }
      }
    });
    console.log("contestCAt ", contestCat)
    res.json({ message: "Contest category deleted", contestCat });
  } catch (error) {
    console.log("error on deleteContest", error);
    res.status(500).json({ message: error.message });
  }
};