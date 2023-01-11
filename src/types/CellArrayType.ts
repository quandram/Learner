import type { Cell } from "./CellType";
import type { SumOperator } from "./SumOperatorType";

export type CellArray = {
  n: number | undefined;
  o: SumOperator | undefined;
  cells: Array<Cell>;
};
