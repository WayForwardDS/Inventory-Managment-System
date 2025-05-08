import httpStatus from 'http-status';
import asyncHandler from '../../lib/asyncHandler';
import sendResponse from '../../lib/sendResponse';
import orderServices from './order.services';

class OrderControllers {
  services = orderServices;

  /**
   * Create a new order (Manager)
   */
  create = asyncHandler(async (req, res) => {
    const result = await this.services.create(req.body, req.user._id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Order created successfully!',
      data: result,
    });
  });

  /**
   * Get all orders based on role and status
   */
  readAll = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.toString() || '';
    const status = req.query.status?.toString();
    const sortBy = req.query.sortBy?.toString() || 'createdAt';
    const sortOrder = req.query.sortOrder?.toString() === 'asc' ? 1 : -1;

    const queryParams = {
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder
    };

    const result = await this.services.readAll(queryParams);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Orders retrieved successfully',
        meta: {
            page,
            limit,
            total: result?.totalCount || 0,
            totalPage: Math.ceil((result?.totalCount || 0) / limit)
        },
        data: result?.data || [],
    });
  });

  /**
   * Get a single order by ID
   */
  readSingle = asyncHandler(async (req, res) => {
    const result = await this.services.read(req.params.id, req.user._id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Order fetched successfully!',
      data: result,
    });
  });

  /**
   * Update an order
   */
  update = asyncHandler(async (req, res) => {
    const result = await this.services.update(req.params.id, req.body);
    
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Order updated successfully!',
      data: result,
    });
  });

  /**
   * Delete an order
   */
  delete = asyncHandler(async (req, res) => {
    await this.services.delete(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Order deleted successfully!',
    });
  });

  /**
   * Delete multiple orders
   */
  bulkDelete = asyncHandler(async (req, res) => {
    await this.services.bulkDelete(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Selected orders deleted successfully!',
    });
  });

  /**
   * Get total order count for dashboard
   */
  getTotalOrders = asyncHandler(async (req, res) => {
    const result = await this.services.getTotalOrders();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Total orders count retrieved successfully',
      data: result,
    });
  });

  /**
   * Get completed orders count for dashboard
   */
  getCompletedOrders = asyncHandler(async (req, res) => {
    const result = await this.services.getCompletedOrders();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Completed orders count retrieved successfully',
      data: result,
    });
  });

  /**
   * Get pending orders count for dashboard
   */
  getPendingOrders = asyncHandler(async (req, res) => {
    const result = await this.services.getPendingOrders();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Pending orders count retrieved successfully',
      data: result,
    });
  });

  /**
   * Get total revenue from completed orders for dashboard
   */
  getCompletedRevenue = asyncHandler(async (req, res) => {
    const result = await this.services.getCompletedRevenue();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Completed orders revenue retrieved successfully',
      data: result,
    });
  });


  getReadyOrders = asyncHandler(async (req, res) => {
    const result = await this.services.getReadyOrders();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Ready orders count retrieved successfully',
      data: result,
    });
  });

  /**
   * Get order statistics for dashboard
   */
  getOrderStats = asyncHandler(async (req, res) => {
    const result = await this.services.getOrderStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Order statistics retrieved successfully',
      data: result,
    });
  });

  /**
   * Get monthly order trends for dashboard
   */
  getMonthlyOrderTrends = asyncHandler(async (req, res) => {
    const months = Number(req.query.months) || 6;
    const result = await this.services.getMonthlyOrderTrends(months);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Monthly order trends retrieved successfully',
      data: result,
    });
  });
}

const orderControllers = new OrderControllers();
export default orderControllers;