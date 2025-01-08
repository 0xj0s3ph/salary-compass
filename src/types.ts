export type SalaryFormInputs = {
  baseSalaryMin: number;
  baseSalaryMax: number;
  overtimeFixed: {
    hours: number;
    amountMin: number;
    amountMax: number;
  };
  overtimeAverage: {
    hours: number;
    amountMin: number;
    amountMax: number;
  };
  bonus: number;
};
