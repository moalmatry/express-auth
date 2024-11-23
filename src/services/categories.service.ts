import { db } from '../db';

/** @description return all categories  */
export const getCategories = async () => {
  const allCategories = await db.category.findMany({});

  return allCategories;
};

export const createCategory = async (name: string) => {
  const newCategory = await db.category.create({
    data: {
      name,
    },
  });

  return newCategory;
};

export const updateCategory = async (name: string, newName: string) => {
  const updatedCategory = await db.category.update({
    where: {
      name,
    },
    data: {
      name: newName,
    },
  });

  return updatedCategory;
};

export const deleteCategory = async (name: string) => {
  const deletedCategory = await db.category.delete({
    where: {
      name,
    },
  });

  return deletedCategory;
};
