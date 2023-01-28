import type { SumConfigNumber } from "./SumConfigNumberType";
import type { SumOperatorConfig } from "./SumOperatorConfigType";

export type SumConfig = {
  weight: number;
  operatorConfig: Array<SumOperatorConfig>;
  rows: SumConfigNumber;
  isPositive: boolean;
  isInteger: boolean;
};
