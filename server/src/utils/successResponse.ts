import { Response } from "express";
import { StatusCodes } from "http-status-codes";

const successResponse = ({
  res,
  message = "success",
  data = {},
  statusCode = StatusCodes.OK,
}: {
  res: Response;
  message: string;
  data?: unknown;
  statusCode?: number;
}) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};

export default successResponse;
