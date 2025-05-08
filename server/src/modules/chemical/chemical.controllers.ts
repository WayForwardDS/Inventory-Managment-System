import httpStatus from 'http-status';
import asyncHandler from '../../lib/asyncHandler';
import sendResponse from '../../lib/sendResponse';
import chemicalServices from './chemical.services';

class ChemicalControllers {
  services = chemicalServices;

  /**
   * Create a new chemical
   */
  create = asyncHandler(async (req, res) => {
    const result = await this.services.create(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Chemical created successfully!',
      data: result
    });
  });

  /**
   * Add stock to a chemical
   */
  addStock = asyncHandler(async (req, res) => {
    const result = await this.services.addToStock(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Chemical stock added successfully!',
      data: result
    });
  });

  /**
   * Get all chemicals of a user with query
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
      message: 'All chemicals retrieved successfully',
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
   * Get total chemicals
   */
  getTotalChemical = asyncHandler(async (req, res) => {
    const result = await this.services.countTotalChemical();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Count total chemicals successfully',
      data: result[0]
    });
  });

  /**
   * Get a single chemical of a user
   */
  readSingle = asyncHandler(async (req, res) => {
    const result = await this.services.read(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Chemical fetched successfully!',
      data: result
    });
  });

  /**
   * Update chemical
   */
  update = asyncHandler(async (req, res) => {
    const result = await this.services.updateChemical(req.params.id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Chemical updated successfully!',
      data: result
    });
  });

  /**
   * Delete a chemical
   */
  delete = asyncHandler(async (req, res) => {
    await this.services.delete(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Chemical deleted successfully!'
    });
  });

  /**
   * Delete multiple chemicals
   */
  bulkDelete = asyncHandler(async (req, res) => {
    await this.services.bulkDelete(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Selected chemicals deleted successfully!'
    });
  });
}

const chemicalControllers = new ChemicalControllers();
export default chemicalControllers;
