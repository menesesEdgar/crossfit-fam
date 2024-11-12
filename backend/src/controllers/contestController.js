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
            .filter((athleteEntry) => athleteEntry.user.role.name === "Athlete")
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

export const getPublicContest = async (_, res) => {
  try {
    const contests = await db.contest.findMany({
      where: {
        status: {
          in: ["Abierta", "En curso", "Finalizada"],
        },
      },
    });

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
            contestCategoryAthlete: {
              select: {
                id: true,
                userId: true,
                contestCategoryId: true,
              },
            },
            conCateConWod: {
              select: {
                id: true,
                contestCategoryId: true,
                contestWodId: true,
              },
            },
          },
        },
        contestWod: {
          select: {
            id: true,
            wod: {
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
        status: "Borrador",
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

export const setContextNextStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { step } = req.body;

    const steps = ["Borrador", "Abierta", "En curso", "Finalizada"];

    const getStepIndex = steps.indexOf(step);

    await db.contest.update({
      where: { id: parseInt(id) },
      data: {
        status: steps[getStepIndex + 1],
      },
    });

    const contestWithDetails = await db.contest.findUnique({
      where: { id: parseInt(id) },
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
            contestCategoryAthlete: {
              select: {
                id: true,
                userId: true,
                contestCategoryId: true,
              },
            },
            conCateConWod: {
              select: {
                id: true,
                contestCategoryId: true,
                contestWodId: true,
              },
            },
          },
        },
        contestWod: {
          select: {
            id: true,
            wod: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    res.json(contestWithDetails);
  } catch (error) {
    console.log("error on setContextNextStep", error);
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
            .filter((athleteEntry) => athleteEntry.user.role.name === "Athlete")
            .map((athleteEntry) => athleteEntry.user),
        }));

        return {
          ...contest,
          categories: categoriesWithAthletes,
        };
      })
    );
    res.json({ message: "Contest deleted", data: contestsWithDetails });
  } catch (error) {
    console.log("error on deleteContest", error);
    res.status(500).json({ message: error.message });
  }
};

export const addCategory = async (req, res) => {
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

// Wods for contest crud
export const addWod = async (req, res) => {
  try {
    const { id: contestId, wodId } = req.params;
    const contest = await db.contestWod.create({
      data: {
        contestId: parseInt(contestId),
        wodId: parseInt(wodId),
      },
      include: {
        wod: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    res.json(contest);
  } catch (error) {
    console.log("error on createContestWod", error);
    res.status(500).json({ message: error.message });
  }
};

export const addAllWodsToContest = async (req, res) => {
  try {
    const { id } = req.params;

    const wods = await db.wod.findMany({
      where: { isDeleted: false },
    });

    const existingContestwods = await db.contestWod.findMany({
      where: { contestId: parseInt(id) },
      select: { wodId: true },
    });

    const existingWodIds = new Set(
      existingContestwods.map((contestWod) => contestWod.wodId)
    );

    const uniqueWods = wods
      .filter((wod) => !existingWodIds.has(wod.id))
      .map((wod) => ({
        contestId: parseInt(id),
        wodId: wod.id,
      }));

    const contest = await db.contestWod.createMany({
      data: uniqueWods,
    });

    // get all categories for the contest
    const contestWod = await db.contestWod.findMany({
      where: { contestId: parseInt(id) },
      include: {
        wod: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    res.json({ message: "All wods added to contest", data: contestWod });
  } catch (error) {
    console.log("error on addAllWodsToContest", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeWod = async (req, res) => {
  const { id, wodId } = req.params;
  try {
    const wod = db.contestWod.findUnique({
      where: { id: parseInt(wodId) },
    });

    if (!wod) {
      res.status(404).json({ message: "Contest wod not found" });
      return;
    }

    await db.contestWod.delete({ where: { id: parseInt(wodId) } });

    const contestWod = await db.contestWod.findMany({
      where: { contestId: parseInt(id) },
      include: {
        wod: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    res.json({ message: "Contest wod deleted", contestWod });
  } catch (error) {
    console.log("error on deleteContestWod", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeAllWodsFromContest = async (req, res) => {
  try {
    const { id } = req.params;
    const contest = await db.contestWod.deleteMany({
      where: { contestId: parseInt(id) },
    });

    res.json(contest);
  } catch (error) {
    console.log("error on removeAllWodsFromContest", error);
    res.status(500).json({ message: error.message });
  }
};
// Wods to category
export const addWodToCategory = async (req, res) => {
  try {
    const { categoryId, wodId } = req.params;
    const contest = await db.conCateConWod.create({
      data: {
        contestCategoryId: parseInt(categoryId),
        contestWodId: parseInt(wodId),
      },
    });
    res.json(contest);
  } catch (error) {
    console.log("error on createContestWod", error);
    res.status(500).json({ message: error.message });
  }
};
export const removeWodToCategory = async (req, res) => {
  const { categoryId, wodId } = req.params; // categoryWodId
  try {
    const categoryWod = await db.conCateConWod.findMany({
      where: {
        contestCategoryId: parseInt(categoryId),
        contestWodId: parseInt(wodId),
      },
    });
    if (categoryWod?.length == 0) {
      res.status(404).json({ message: "Category wod not found" });
      return;
    }
    const categoryWodDeleted = await db.conCateConWod.delete({
      where: { id: parseInt(categoryWod[0].id) },
    });
    res.json({ message: "Category wod deleted", categoryWodDeleted });
  } catch (error) {
    console.log("error on deleteCategoryWod", error);
    res.status(500).json({ message: error.message });
  }
};

export const getWodsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const contest = await db.conCateConWod.findMany({
      where: { contestCategoryId: parseInt(categoryId) },
      // include: {
      //   contestCategory: {
      //     select: {
      //       id: true,
      //       category: {
      //         select: {
      //           name: true,
      //           id: true,
      //         },
      //       },
      //     },
      //   },
      //   contestWod: {
      //     select: {
      //       id: true,
      //       wod: {
      //         select: {
      //           name: true,
      //           id: true,
      //         },
      //       },
      //     },
      //   }
      // },
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

export const addAllCategoryWods = async (req, res) => {
  try {
    // categoryId = contestCategoryId
    const { categoryId, contestId } = req.params;

    const wods = await db.ContestWod.findMany({
      where: { contestId: parseInt(contestId) },
    });

    const existingCategoryWods = await db.conCateConWod.findMany({
      where: { contestCategoryId: parseInt(categoryId) },
      select: { contestWodId: true },
    });

    const existingWodIds = new Set(
      existingCategoryWods.map((categoryWod) => categoryWod.contestWodId)
    );
    const uniqueCategoryWods = wods
      .filter((wod) => !existingWodIds.has(wod.id))
      .map((wod) => ({
        contestCategoryId: parseInt(categoryId),
        contestWodId: wod.id,
      }));
    await db.conCateConWod.createMany({
      data: uniqueCategoryWods,
    });
    const contestWod = await db.conCateConWod.findMany({
      where: { 
        contestCategory: {
          contestId: {
            in: [parseInt(contestId)],
          },
       },
      }
    });
    res.json({ message: "All wods added to contest", data: contestWod });
  } catch (error) {
    console.log("error on addAllWodsToContest", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeAllWodsFromCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await db.conCateConWod.deleteMany({
      where: { contestCategoryId: parseInt(categoryId) },
    });

    res.json({ message: "All wods removed", data: categoryId });

  } catch (error) {
    console.log("error on removeAllWodsFromContest", error);
    res.status(500).json({ message: error.message });
  }
};
export const addAthleteToContest = async (req, res) => {
  try {
    const { userId, categoryId } = req.body;

    const contest = await db.contestCategoryAthlete.create({
      data: {
        userId: userId,
        contestCategoryId: parseInt(categoryId),
      },
      include: {
        contestCategory: {
          select: {
            contestId: true,
          }
        }
      }
    });
    res.json(contest);
  } catch (error) {
    console.log("error adding athlete to contest", error);
    res.status(500).json({ message: error.message });
  }
};
export const removeAthleteFromContest = async (req, res) => {
  const { id } = req.params;
  try {
    const athlete = await db.ContestCategoryAthlete.findUnique({
      where: { id: parseInt(id) },
      include: {
        contestCategory: {
          select: {
            contestId: true,
          },
        },
      },
    });
    if (!athlete) {
      res.status(404).json({ message: "Athlete not registered" });
      return;
    }
    // Remove the athlete
    await db.ContestCategoryAthlete.delete({ where: { id: parseInt(id) } });
    // Fetch existing athletes of the contest
    const athletes = await db.contestCategoryAthlete.findMany({
      where: {
        contestCategory: {
          contestId: {
            in: [athlete?.contestCategory?.contestId],
          },
        },
      },
    });
    res.json({ message: "Athlete removed", data: {athletes, contestId: athlete?.contestCategory?.contestId}});
  } catch (error) {
    console.log("error on deleteContest", error);
    res.status(500).json({ message: error.message });
  }
};

// where: {
//   contestCategoryAthlete: {
//       contestCategoryId: {
//         in: [parseInt(categoryId)]
//       }
//   }
// },
// include: {
//   contestCategoryAthlete: {
//     select: {
//       user: {
//         select: {
//           firstName: true,
//           lastName: true,
//           email: true,
//           phone: true,
//         },
//       },          }
//   },

// }
export const getAthletesByCategory = async (req, res) => {
  const { categoryId, contestId } = req.params;
  try {
    const contestAthletes = await db.contestCategoryAthlete.findMany({
      where: {
        contestCategoryId: {
          in: [parseInt(categoryId)],
        },
      },
      select: {
        id: true,
        contestCategoryId: true,
        userId:true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        score: {
          select: {
            id: true,
            score: true,
            measure: true,
            contestCategoryWodId: true,
            contestCategoryAthleteId: true
          }
        }
      },
    });
    const formattedData = contestAthletes.map((athlete) => {
      const newObj = {
        ...athlete,
        ...athlete.user,
      }
      delete newObj.user;
      return newObj
    })
    
    if (!formattedData) {
      res.status(404).json({ message: "Athletes not found for this category" });
      return;
    }

    res.json(formattedData);
  } catch (error) {
    console.log("error on getAthletesByCategory", error);
    res.status(500).json({ message: error.message });
  }
};export const addScoreToAthlete = async (req, res) => {
  try {
    const { athleteId, score, measure, wodId } = req.body;

    const contest = await db.score.create({
      data: {
        contestCategoryAthleteId: athleteId,
        score,
        measure: measure ? measure : 'reps',
        contestCategoryWodId: wodId
      },
    });
    res.json(contest);
  } catch (error) {
    console.log("error adding athlete to contest", error);
    res.status(500).json({ message: error.message });
  }
};
export const updateScoreToAthlete = async (req, res) => {
  try {
    const { id, score, measure } = req.body;

    const athleteScore = await db.score.update({
      where: { id: parseInt(id)},
      data: {
        score,
        measure: measure ? measure : 'reps',
      },
    });

    res.json(athleteScore);
  } catch (error) {
    console.log("error adding athlete to contest", error);
    res.status(500).json({ message: error.message });
  }
};