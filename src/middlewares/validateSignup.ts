import { Request, Response, NextFunction } from 'express';

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export function validateSignup(req: Request, res: Response, next: NextFunction) {
  const { fullname, email, password, confirmPassword, gender, mobile } = req.body;

  if (!fullname || !email || !password || !confirmPassword || !gender || !mobile) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.' });
  }

  next();
} 