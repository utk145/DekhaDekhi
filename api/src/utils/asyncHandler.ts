import { Request, Response, NextFunction } from 'express';

const asyncHandler = (functionToPerform: (req: Request, res: Response, next: NextFunction) => any) => {
    /*    `any` allows function, to return any type of value (including a promise, object, etc.). */
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(functionToPerform(req, res, next))
            .catch((err: Error) => next(err));
    };
};

export { asyncHandler };
