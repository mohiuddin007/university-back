import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import config from "../config";


const auth = () => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization;
      //is the token is sent form the client
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      //check if the token is valid
      jwt.verify(
        token,
        config.jwt_secret_key as string,
        function (err, decoded) {
          if (err) {
            throw new AppError(
              httpStatus.UNAUTHORIZED,
              "You are not authorized!"
            );
          }

          req.user = decoded as JwtPayload;
        }
      );
      next();
    }
  );
};

export default auth;
