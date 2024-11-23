/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { CreateProductInput } from '../schema/products.schema';
import { createNewProduct, getAllProducts } from '../services/products.service';

/** @description return all products */
export const getAllProductsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const products = await getAllProducts();

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
});

/** @description create new product */
export const createNewProductHandler = catchAsync(
  async (req: Request<object, object, CreateProductInput>, res: Response, next: NextFunction) => {
    const { categoryName, description, name, price, images, tags } = req.body;

    const product = await createNewProduct({
      categoryName,
      description,
      name,
      price,
      images,
      tags,
    });

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  },
);
