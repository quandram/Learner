import type { SumOperator } from "./SumOperatorType";
import type { SumConfigRow } from "./SumConfigRowType";
import type { SumConfigNumber } from "./SumConfigNumberType";

export type SumConfig = {
  weight: number;
  operators: Array<SumOperator>;
  rows: SumConfigRow;
  number: SumConfigNumber;
  isPositive: boolean;
  isInteger: boolean;
};
