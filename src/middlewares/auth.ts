import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  username: string;
  email: string;
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET!, (err: null | jwt.VerifyErrors, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user as User;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}