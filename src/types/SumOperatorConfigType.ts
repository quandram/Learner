import type { SumOperator } from "./SumOperatorType";

export type SumOperatorConfig = {
  operator: SumOperator;
  number: {
    min: number;
    max: number;
  };
};
