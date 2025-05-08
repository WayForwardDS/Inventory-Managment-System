import httpStatus from 'http-status';
import asyncHandler from '../../lib/asyncHandler';
import sendResponse from '../../lib/sendResponse';
import productServices from './product.services';

class ProductControllers {
  services = productServices;

  /**
   * create new product
   */
  create = asyncHandler(async (req, res) => {
    const result = await this.services.create(req.body, req.user._id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Product created successfully!',
      data: result
    });
  });

  /**
   * Get all product of user with query
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
      message: 'All products retrieved successfully',
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
 * Get total product
 */
getTotalProduct = asyncHandler(async (req, res) => {
  const result = await this.services.countTotalProduct();
  const totalProductCount = result || { totalQuantity: 0 };

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Count total products successfully',
    data: totalProductCount
  });
});

  /**
   * Get single product of user
   */
  readSingle = asyncHandler(async (req, res) => {
    const result = await this.services.read(req.params.id, req.user._id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Product fetched successfully!',
      data: result
    });
  });

  /**
   * update product
   */
  update = asyncHandler(async (req, res) => {
    const result = await this.services.update(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Product updated successfully!',
      data: result
    });
  });

  /**
   * delete product
   */
  delete = asyncHandler(async (req, res) => {
    await this.services.delete(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Product delete successfully!'
    });
  });

  /**
   * delete multiple product
   */
  bulkDelete = asyncHandler(async (req, res) => {
    await this.services.bulkDelete(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Delete Selected Product successfully!'
    });
  });
}

const productControllers = new ProductControllers();
export default productControllers;
