import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateMonthlyPayment(principal: number, apr: number = 9.99, termMonths: number = 60): number {
  if (apr === 0) {
    return principal / termMonths;
  }
  const monthlyRate = apr / 100 / 12;
  const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                  (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.ceil(payment);
}

export function calculateReferralCredit(amount: number): number {
  if (amount >= 15000) return 1800;
  if (amount >= 10000) return 1200;
  if (amount >= 7500) return 800;
  if (amount >= 5000) return 600;
  if (amount >= 2500) return 400;
  return 0;
}

export function generateJobId(): string {
  return `job-${uuidv4()}`;
}

export function generateFinancingApplicationId(): string {
  return `fin-${uuidv4()}`;
}
