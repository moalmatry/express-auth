import { NextFunction, Request, Response } from 'express';
import { createCategoryInput, deleteCategoryInput, updateCategoryInput } from '../schema/categories.schema';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../services/categories.service';
import catchAsync from '../utils/catchAsync';

/**@description get all categories */
export const getAllCategoriesHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await getCategories();

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

/**@description create new category */
export const createCategoryHandler = catchAsync(
  async (req: Request<object, object, createCategoryInput>, res, next) => {
    const { name } = req.body;
    const category = await createCategory(name);

    res.status(200).json({
      status: 'success',
      data: { category },
    });
  },
);

/**@description update existing category */
export const updateCategoryHandler = catchAsync(
  async (req: Request<object, object, updateCategoryInput>, res: Response, next: NextFunction) => {
    const { name, newName } = req.body;

    const updatedCategory = await updateCategory(name, newName);

    res.status(200).json({
      status: 'success',
      data: { updatedCategory },
    });
  },
);

/**@description delete existing category */
export const deleteCategoryHandler = catchAsync(
  async (req: Request<object, object, deleteCategoryInput>, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const deletedCategory = await deleteCategory(name);

    res.status(201).json({
      status: 'success',
      data: { deletedCategory },
    });
  },
);