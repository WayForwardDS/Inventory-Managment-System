/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import sortAndPaginatePipeline from '../../lib/sortAndPaginate.pipeline';
import BaseServices from '../baseServices';
import Chemical from './chemical.model';
import CustomError from '../../errors/customError';
import { IChemicals } from './chemical.interface';

class ChemicalServices extends BaseServices<any> {
  constructor(model: any, modelName: string) {
    super(model, modelName);
  }

  /**
   * Create new chemical
   */
  async create(payload: IChemicals) {
    type str = keyof IChemicals;

    (Object.keys(payload) as str[]).forEach((key: str) => {
      if (payload[key] === '') {
        delete payload[key];
      }
    });

    if (typeof payload.type === 'string') {
      payload.type = payload.type.trim();
    }

    payload.createdAt = new Date();
    payload.updatedAt = '-';
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const chemical = await this.model.create([payload], { session });

      await session.commitTransaction();

      return chemical[0];
    } catch (error) {
      await session.abortTransaction();
      throw new CustomError(400, 'Chemical creation failed');
    } finally {
      await session.endSession();
    }
  }

  /**
   * Count Total Chemicals
   */
  async countTotalChemical() {
    return this.model.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          totalQuantity: 1,
          _id: 0,
        },
      },
    ]);
  }

  /**
   * Get All chemicals
   */
  async readAll(query: Record<string, unknown> = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [
        ...sortAndPaginatePipeline(query),
        {
            $lookup: {
                from: 'chemicals',
                localField: 'chemical',
                foreignField: '_id',
                as: 'chemicalDetails',
            },
        },
        {
            $unwind: {
                path: '$chemicalDetails',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                'chemicalDetails.__v': 0,
                'chemicalDetails.user': 0,
            },
        },
    ];

    const data = await this.model.aggregate(pipeline);

    const countPipeline = [
        {
            $count: 'total',
        },
    ];

    const totalCount = await this.model.aggregate(countPipeline);

    return {
        data,
        totalCount: totalCount[0]?.total || 0,
    };
}
  /**
   * Get Single chemical
   */
  async read(id: string) {
    await this._isExists(id);
    return this.model.findOne({ _id: id });
  }

  /**
   * Multiple delete
   */
  async bulkDelete(payload: string[]) {
    const data = payload.map((item) => new Types.ObjectId(item));
    return this.model.deleteMany({ _id: { $in: data } });
  }

  /**
   * Add stock to a chemical
   */
  async addToStock(id: string, payload: Pick<IChemicals, 'quantity'>) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const chemical = await this.model.findByIdAndUpdate(
        id,
        {
          $inc: { quantity: payload.quantity },
          $set: { updatedAt: new Date().toISOString() },
        },
        { new: true, session }
      );

      await session.commitTransaction();

      return chemical;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw new CustomError(400, 'Chemical stock update failed');
    } finally {
      await session.endSession();
    }
  }

  /**
   * Update a chemical
   */
  async updateChemical(id: string, payload: Partial<IChemicals>) {
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      type str = keyof IChemicals;
      (Object.keys(payload) as str[]).forEach((key: str) => {
        if (payload[key] === '') {
          delete payload[key];
        }
      });
  
      if (typeof payload.type === 'string') {
        payload.type = payload.type.trim();
      }
  
      if (payload.price !== undefined) {
        payload.price = Number(payload.price);
      }
  
      const createdAtDate = new Date();
      const formattedCreatedAt = `${
        createdAtDate.getMonth() + 1 
      }/${createdAtDate.getDate()}/${createdAtDate.getFullYear()}`;
  
      const chemical = await this.model.findByIdAndUpdate(
        id,
        {
          $set: { ...payload, updatedAt: formattedCreatedAt },
        },
        { new: true, session } 
      );
  
      await session.commitTransaction();
  
      return chemical;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw new CustomError(400, 'Chemical update failed');
    } finally {
      await session.endSession();
    }
  }
}

const chemicalServices = new ChemicalServices(Chemical, 'Chemical');
export default chemicalServices;