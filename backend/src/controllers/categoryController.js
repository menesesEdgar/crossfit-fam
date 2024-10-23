import { db } from "../lib/db.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await db.category.findMany();
    res.json(categories);
  } catch (error) {
    console.log("error on getCategories", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await db.category.findUnique({
      where: { id: parseInt(req.params.id) },
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
    const { name, division } = req.body;
    const category = await db.category.create({ data: { name, division } });
    res.json(category);
  } catch (error) {
    console.log("error on createCategory", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, division } = req.body;
    const ifExistCategory = db.category.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!ifExistCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    const category = await db.category.update({
      where: { id: parseInt(req.params.id) },
      data: { name, division },
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

    await db.category.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Category deleted" });
  } catch (error) {
    console.log("error on deleteCategory", error);
    res.status(500).json({ message: error.message });
  }
};
