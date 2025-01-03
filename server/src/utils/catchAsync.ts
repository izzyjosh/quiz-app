import { NextFunction, Response, Request } from "express";

const catchAsync =
  (
    controller: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Awaited<void>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      controller(req, res, next);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error?.message);
      }

      return next(error);
    }
  };

export default catchAsync;