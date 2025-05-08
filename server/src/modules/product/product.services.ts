/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import sortAndPaginatePipeline from '../../lib/sortAndPaginate.pipeline';
import BaseServices from '../baseServices';
import Product from './product.model';
import CustomError from '../../errors/customError';
import { IProduct } from './product.interface';

class ProductServices extends BaseServices<any> {
  constructor(model: any, modelName: string) {
    super(model, modelName);
  }

  /**
   * Create new product
   */
  async create(payload: IProduct, userId: string) {
    console.log(" Creating Product with payload:", payload);
  
    // Ensure `chemical` is present
    if (!payload.chemicals) {
      throw new CustomError(400, "Chemical is required to create a product.");
    }
  
    payload.user = new Types.ObjectId(userId);
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
      const [product] = await this.model.create([payload], { session });
      if (!product) {
        throw new CustomError(400, "Failed to create product.");
      }
      console.log("Product Created Successfully:", product);
  
      await session.commitTransaction();
      return product;
    } catch (error: unknown) {
      console.error("Product creation failed:", error);
      await session.abortTransaction();
      if (error instanceof Error) {
        throw new CustomError(400, `Product creation failed: ${error.message}`);
      }
    } finally {
      await session.endSession();
    }
  }

  /**
   * Count Total Product
   */
  async countTotalProduct() {
    return this.model.countDocuments({});
}
  /**
   * Get All product of user
   */
  async readAll(query: Record<string, unknown> = {}) {
    const sortPaginationPipeline = sortAndPaginatePipeline(query);

    const data = await this.model.aggregate([
        ...sortPaginationPipeline,
        {
            $lookup: {
                from: "chemicals", 
                localField: "chemical",
                foreignField: "_id",
                as: "chemical",
            },
        },
        {
            $project: {
                "chemical.__v": 0,
                "chemical.user": 0,
            },
        },
    ]);

    const totalCountResult = await this.model.aggregate([
        { $count: "total" },
    ]);

    const totalCount = totalCountResult[0]?.total || 0;

    return { data, totalCount };
}

  /**
   * Get Single product of user
   */
  async read(id: string, userId: string) {
    await this._isExists(id);
    return this.model.findOne({ user: new Types.ObjectId(userId), _id: id });
  }

  /**
   * Multiple delete
   */
  async bulkDelete(payload: string[]) {
    const data = payload.map((item) => new Types.ObjectId(item));

    return this.model.deleteMany({ _id: { $in: data } });
  }


}

const productServices = new ProductServices(Product, 'Product');
export default productServices;
