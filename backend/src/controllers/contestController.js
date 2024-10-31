import { db } from "../lib/db.js";

export const getContests = async (req, res) => {
  try {
    const contests = await db.contest.findMany();

    const contestsWithDetails = await Promise.all(
      contests.map(async (contest) => {
        const categories = await db.contestCategory.findMany({
          where: { contestId: contest.id },
          include: {
            category: {
              select: {
                name: true,
                id: true,
              },
            },
            contestCategoryAthlete: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    role: true,
                  },
                },
              },
            },
          },
        });

        const categoriesWithAthletes = categories.map((cat) => ({
          ...cat,
          athletes: cat.contestCategoryAthlete
            .filter((athleteEntry) => athleteEntry.user.role === "athlete")
            .map((athleteEntry) => athleteEntry.user),
        }));

        return {
          ...contest,
          categories: categoriesWithAthletes,
        };
      })
    );

    res.json(contestsWithDetails);
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
            id: true,
            category: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
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
      data: {
        name,
        location,
        organizer,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
      },
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
      data: {
        name,
        location,
        organizer,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
      },
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
  console.log("req ", req.params);
  try {
    const { id: contestId, categoryId } = req.params;
    const contest = await db.contestCategory.create({
      data: {
        contestId: parseInt(contestId),
        categoryId: parseInt(categoryId),
      },
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    res.json(contest);
  } catch (error) {
    console.log("error on createContestCategory", error);
    res.status(500).json({ message: error.message });
  }
};

export const addAllCategoriesToContest = async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await db.category.findMany({
      where: { isDeleted: false },
    });

    const existingContestCategories = await db.contestCategory.findMany({
      where: { contestId: parseInt(id) },
      select: { categoryId: true },
    });

    const existingCategoryIds = new Set(
      existingContestCategories.map(
        (contestCategory) => contestCategory.categoryId
      )
    );

    const uniqueCategories = categories
      .filter((category) => !existingCategoryIds.has(category.id))
      .map((category) => ({
        contestId: parseInt(id),
        categoryId: category.id,
      }));

    const contest = await db.contestCategory.createMany({
      data: uniqueCategories,
    });

    // get all categories for the contest
    const contestCat = await db.contestCategory.findMany({
      where: { contestId: parseInt(id) },
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    res.json({ message: "All categories added to contest", data: contestCat });
  } catch (error) {
    console.log("error on addAllCategoriesToContest", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeCategory = async (req, res) => {
  const { id, categoryId } = req.params;
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
            name: true,
            id: true,
          },
        },
      },
    });
    res.json({ message: "Contest category deleted", contestCat });
  } catch (error) {
    console.log("error on deleteContest", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeAllCategoriesFromContest = async (req, res) => {
  try {
    const { id } = req.params;
    const contest = await db.contestCategory.deleteMany({
      where: { contestId: parseInt(id) },
    });

    res.json(contest);
  } catch (error) {
    console.log("error on removeAllCategoriesFromContest", error);
    res.status(500).json({ message: error.message });
  }
};
