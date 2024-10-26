import { db } from "../lib/db.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await db.category.findMany({
      where: { isDeleted: false },
    });
    res.json(categories);
  } catch (error) {
    console.log("error on getCategories", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await db.category.findUnique({
      where: { id: parseInt(req.params.id), isDeleted: false },
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.json(category);
  } catch (error) {
    console.log("error on getCategoryById", error);
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const ifExistCategory = db.category.findFirst({
      where: { name, isDeleted: false },
    });

    const category = await db.category.create({
      data: { name, description },
    });
    res.json(category);
  } catch (error) {
    console.log("error on createCategory", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const ifExistCategory = db.category.findUnique({
      where: { id: parseInt(req.params.id), isDeleted: false },
    });

    if (!ifExistCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    const category = await db.category.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description },
    });
    res.json(category);
  } catch (error) {
    console.log("error on updateCategory", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = db.category.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    await db.category.update({
      where: { id: parseInt(req.params.id) },
      data: { isDeleted: true },
    });

    const allCategories = await db.category.findMany({
      where: { isDeleted: false },
    });
    res.json({ message: "Category deleted", data: allCategories });
  } catch (error) {
    console.log("error on deleteCategory", error);
    res.status(500).json({ message: error.message });
  }
};
