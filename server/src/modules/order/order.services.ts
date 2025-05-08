import mongoose, { Types } from 'mongoose';
import sortAndPaginatePipeline from '../../lib/sortAndPaginate.pipeline';
import BaseServices from '../baseServices';
import Order from './order.model';
import CustomError from '../../errors/customError';
import { IOrder } from './order.interface';
import User from '../user/user.model';

class OrderServices extends BaseServices<any> {
  constructor(model: any, modelName: string) {
    super(model, modelName);
  }

  /**
   * Create a new order
   */
  async create(payload: IOrder, userId: string) {
    if (!payload.product) {
      throw new CustomError(400, 'Product is required to create an order.');
    }
    const user = await User.findById(userId).select('name');

    if (!user) {
      throw new CustomError(404, 'User not found.');
    }

    payload.createdBy = user.name;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const [order] = await this.model.create([payload], { session });

      if (!order) {
        throw new CustomError(400, 'Failed to create order.');
      }

      await session.commitTransaction();
      return order;
    } catch (error: unknown) {
      console.error('❌ Order creation failed:', error);
      await session.abortTransaction();
      if (error instanceof Error) {
        throw new CustomError(400, `Order creation failed: ${error.message}`);
      }
    } finally {
      await session.endSession();
    }
  }

  /**
   * Count Total Orders
   */
  async countTotalOrders(userId: string) {
    return this.model.countDocuments({
      createdBy: new Types.ObjectId(userId),
    });
  }

  /**
   * Get All orders of a user with query (e.g., filtering by status)
   */
  async readAll(query: Record<string, unknown> = {}) {
    const search = query.search ? query.search.toString() : '';
    const sortPaginationPipeline = sortAndPaginatePipeline(query);

    const data = await this.model.aggregate([
      ...sortPaginationPipeline,
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        },
      },
      ...(search ? [{
        $match: {
            'product.name': { $regex: search, $options: 'i' } 
        }
      }] : []),
      {
        $lookup: {
          from: 'chemicals',
          localField: 'chemicals.chemical',
          foreignField: '_id',
          as: 'chemicalDetails',
        },
      },
      {
        $project: {
          'product.__v': 0,
          'product.user': 0,
          'chemicalDetails.__v': 0,
          'chemicalDetails.user': 0,
        },
      },
    ]);

    const totalCountResult = await this.model.aggregate([
      { $count: 'total' },
    ]);

    const totalCount = totalCountResult[0]?.total || 0;

    return { data, totalCount };
  }

  /**
   * Get a single order by ID
   */
  async read(id: string, userId: string) {
    await this._isExists(id);
    return this.model.findOne({ createdBy: new Types.ObjectId(userId), _id: id });
  }

  /**
   * Update an order
   */
  async update(orderId: string, payload: Partial<IOrder>) {
    if (payload.status === 'completed') {
      payload.completedAt = new Date().toISOString(); 
    }

    if (payload.status === 'ready') {
      payload.readyDate = new Date().toISOString(); 
    }

    const order = await this.model.findByIdAndUpdate(orderId, payload, { new: true });
    if (!order) {
      throw new CustomError(404, 'Order not found.');
    }

    return order;
  }

  /**
   * Delete an order
   */
  async delete(orderId: string) {
    const order = await this.model.findByIdAndDelete(orderId);

    if (!order) {
      throw new CustomError(404, 'Order not found.');
    }

    return order;
  }

  /**
   * Delete multiple orders
   */
  async bulkDelete(payload: string[]) {
    const data = payload.map((item) => new Types.ObjectId(item));

    const result = await this.model.deleteMany({ _id: { $in: data } });

    if (result.deletedCount === 0) {
      throw new CustomError(404, 'No orders found to delete.');
    }

    return result;
  }


  /**
   * Get total order count (for dashboard)
   */
  async getTotalOrders() {
    return this.model.countDocuments();
  }


  /**
 * Get Ready total order count (for dashboard)
 */
  async getReadyOrders() {
    return this.model.countDocuments({ status: 'ready' });
  }


  /**
   * Get completed orders count (for dashboard)
   */
  async getCompletedOrders() {
    return this.model.countDocuments({ status: 'completed' });
  }

  /**
   * Get pending orders count (for dashboard)
   */
  async getPendingOrders() {
    return this.model.countDocuments({ status: 'pending' });
  }

  /**
   * Get total revenue from completed orders (for dashboard)
   */
  async getCompletedRevenue() {
    const result = await this.model.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    return result[0]?.total || 0;
  }


  /**
   * Get comprehensive order statistics (for dashboard)
   */
  async getOrderStats() {
    const [total, completed, pending, ready] = await Promise.all([
      this.getTotalOrders(),
      this.getCompletedOrders(),
      this.getPendingOrders(),
      this.getReadyOrders()
    ]);
    
    return {
      total,
      completed,
      pending,
      ready,
      cancelled: await this.model.countDocuments({ status: 'cancelled' })
    };
  }

  /**
   * Get monthly order trends (for dashboard)
   */
  async getMonthlyOrderTrends(months: number = 6, includeReady: boolean = false) {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    
    const matchStage: any = {
      createdAt: { $gte: date }
    };
  
    if (!includeReady) {
      matchStage.status = 'completed';
    }
  
    return this.model.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          totalQuantity: { $sum: '$quantity' },
          totalRevenue: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
          ...(includeReady && {
            readyCount: {
              $sum: {
                $cond: [{ $eq: ['$status', 'ready'] }, 1, 0]
              }
            }
          })
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      },
      {
        $project: {
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1
                }
              }
            }
          },
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1,
          ...(includeReady && { readyCount: 1 }),
          _id: 0
        }
      }
    ]);
  }
}

const orderServices = new OrderServices(Order, 'Order');
export default orderServices;