import { Types } from 'mongoose';

interface QueryParams {
  minPrice?: string | number;
  maxPrice?: string | number;
  productName?: string; // Changed from 'name' to 'productName' to match the schema
  status?: string; // Added status filter
}

const matchStagePipeline = (query: QueryParams, userId: string) => {
  // Parse minPrice and maxPrice
  const minPrice = query.minPrice ? Number(query.minPrice) : 0;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : Number.MAX_VALUE;

  // Validate price range
  if (isNaN(minPrice)) throw new Error('minPrice must be a valid number');
  if (isNaN(maxPrice)) throw new Error('maxPrice must be a valid number');
  if (minPrice > maxPrice) throw new Error('minPrice cannot be greater than maxPrice');

  // Build the field query
  const fieldQuery: Record<string, unknown>[] = [
    { createdBy: new Types.ObjectId(userId) }, // Filter by user ID (createdBy in the schema)
    { totalPrice: { $gte: minPrice, $lte: maxPrice } }, // Filter by totalPrice range
  ];

  // Add product name filter if provided
  if (query.productName) {
    fieldQuery.push({ 'product.name': { $regex: new RegExp(query.productName, 'i') } }); // Case-insensitive regex search for product name
  }

  // Add status filter if provided
  if (query.status) {
    fieldQuery.push({ status: query.status }); // Filter by order status
  }

  // Return the $match stage for the aggregation pipeline
  return [
    {
      $match: {
        $and: fieldQuery, // Combine all conditions with $and
      },
    },
  ];
};

export default matchStagePipeline;