import { db } from '../db';

export interface productDataProps {
  categoryName: string;
  description?: string;
  name: string;
  price: number;
  images?: string[];
  tags?: string[];
}

export const getAllProducts = async () => {
  const allProducts = db.product.findMany({});

  return allProducts;
};

export const createNewProduct = async (productData: productDataProps) => {
  const newProduct = await db.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      categoryName: productData.categoryName,
      price: productData.price,
      images: productData.images,
      tags: productData.tags,
    },
  });

  return newProduct;
};
