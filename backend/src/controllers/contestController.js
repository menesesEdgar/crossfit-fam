import { db } from "../lib/db.js";

export const getContests = async (req, res) => {
  try {
    const contests = await db.contest.findMany({
      where: { isDeleted: false },
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
        isDeleted: false,
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
      where: { id: parseInt(req.params.id), isDeleted: false },
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
      where: { id: parseInt(req.params.id), isDeleted: false },
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

    const categories = await db.contestCategory.findMany({
      where: { contestId: parseInt(req.params.id) },
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
    const newContestData = {
      ...contest,
      categories: categoriesWithAthletes,
    };
    //   return {
    //     ...contest,
    //     categories: categoriesWithAthletes,
    //   };
    // })

    res.json(newContestData);
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
      where: { id: parseInt(id), isDeleted: false },
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
      where: { id: parseInt(req.params.id), isDeleted: false },
    });

    if (!contest) {
      res.status(404).json({ message: "Contest not found" });
      return;
    }

    await db.contest.update({
      where: { id: parseInt(req.params.id) },
      data: {
        isDeleted: true,
      },
    });

    const contests = await db.contest.findMany({
      where: {
        isDeleted: false,
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

    // check if the category has been used in any category
    const categoryWod = await db.conCateConWod.findMany({
      where: { contestCategoryId: parseInt(categoryId) },
    });

    if (categoryWod.length > 0) {
      res.status(400).json({
        message: "La categoría no puede ser eliminada porque está en uso",
      });
      console.log("error on deleteContestCategory");
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
      res.status(404).json({ message: "El WOD no fue encontrado" });
      return;
    }

    // check if the wod has been used in any category
    const categoryWod = await db.conCateConWod.findMany({
      where: { contestWodId: parseInt(wodId) },
    });

    if (categoryWod.length > 0) {
      res.status(400).json({
        message: "El WOD no puede ser eliminado porque está en uso",
      });
      console.log("error on deleteContestWod");
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
  console.log("entre aqui");
  try {
    const contest = await db.conCateConWod.findMany({
      where: { contestCategoryId: parseInt(categoryId) },
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
      },
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
          },
        },
      },
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
    res.json({
      message: "Athlete removed",
      data: { athletes, contestId: athlete?.contestCategory?.contestId },
    });
  } catch (error) {
    console.log("error on deleteContest", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAthletesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { wodId, sortOrder = "desc", filterValue } = req.query; // Nuevos parámetros de consulta

  try {
    // Obtén a los atletas
    const contestAthletes = await db.contestCategoryAthlete.findMany({
      where: {
        contestCategoryId: parseInt(categoryId),
      },
      select: {
        id: true,
        contestCategoryId: true,
        userId: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        score: {
          where: wodId ? { contestCategoryWodId: parseInt(wodId) } : {}, // Filtrar por WOD si se especifica
          select: {
            id: true,
            quantity: true,
            time: true,
            contestCategoryWodId: true,
            contestCategoryAthleteId: true,
          },
        },
      },
    });

    // Formatea los datos
    const formattedData = contestAthletes.map((athlete) => {
      const newObj = {
        ...athlete,
        name: `${athlete.user.firstName} ${athlete.user.lastName}`,
        scores: athlete.score.reduce((acc, item) => {
          acc[item.contestCategoryWodId] = item;
          return acc;
        }, {}),
      };
      delete newObj.user;
      delete newObj.score;
      return newObj;
    });

    if (!formattedData) {
      res.status(404).json({ message: "Athletes not found for this category" });
      return;
    }

    // Procesar los atletas
    let athletes = formattedData.map((athlete) => ({
      ...athlete,
      totalScore: Object.values(athlete?.scores || []).reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      ),
    }));

    // Filtrar por valor específico si se especifica `filterValue`
    if (filterValue) {
      athletes = athletes.filter((athlete) =>
        Object.values(athlete.scores).some(
          (score) => score.quantity === filterValue
        )
      );
    }

    // Ordenar por `quantity`
    athletes = athletes.sort((a, b) => {
      const scoreA = parseFloat(
        a.scores[wodId]?.quantity ||
          (sortOrder === "asc" ? Infinity : -Infinity)
      );
      const scoreB = parseFloat(
        b.scores[wodId]?.quantity ||
          (sortOrder === "asc" ? Infinity : -Infinity)
      );
      return sortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
    });

    // Asignar posiciones
    athletes = athletes.map((athlete, index) => ({
      ...athlete,
      position: index + 1,
    }));

    res.json(athletes);
  } catch (error) {
    console.error("error on getAthletesByCategory", error);
    res.status(500).json({ message: error.message });
  }
};

export const addScoreToAthlete = async (req, res) => {
  try {
    const { athleteId, scores } = req.body;
    const scoresData = [];
    const updateData = [];
    for (const [key, value] of Object.entries(scores)) {
      const scoreObj = {
        contestCategoryAthleteId: parseInt(athleteId),
        quantity: value.quantity || "",
        time: value.time || "",
        contestCategoryWodId: parseInt(key),
      };
      const score = await db.score.findMany({
        where: {
          contestCategoryAthleteId: parseInt(athleteId),
          contestCategoryWodId: parseInt(key),
        },
        select: {
          id: true,
        },
      });
      if (score?.length > 0 || value?.id) {
        updateData.push({
          ...scoreObj,
          id: value?.id || score[0]?.id,
        });
      } else {
        scoresData.push(scoreObj);
      }
    }
    const score = await db.$transaction(async (prisma) => {
      await prisma.score.createMany({
        data: scoresData,
      });
      if (updateData && updateData.length > 0) {
        await Promise.all(
          updateData.map((val) =>
            prisma.score.update({
              where: { id: val.id },
              data: {
                time: val?.time || "",
                quantity: val?.quantity || "",
              },
            })
          )
        );
      }
    });

    res.json(score);
  } catch (error) {
    console.log("error updating score", error);
    res.status(500).json({ message: error.message });
  }
};
