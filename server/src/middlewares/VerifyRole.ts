import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { UserRole, TUserRole } from '../constant/userRole'; // Import user roles and types

/**
 * Middleware to verify if the user has the required role to access a route.
 * @param requiredRole - The role required to access the route.
 * @returns Middleware function.
 */
const verifyRole = (requiredRole: TUserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role; // Assuming user role is available in req.user

    // Check if the user has the required role
    if (userRole !== UserRole[requiredRole]) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: `You do not have permission to perform this action. Required role: ${requiredRole}`,
      });
    }

    next(); // Proceed to the next middleware or controller
  };
};

export default verifyRole;