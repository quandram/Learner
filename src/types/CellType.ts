import type { CellValue } from "./CellValueType";
import type { CellType } from "./CellTypeType";

export type Cell = {
  value: CellValue;
  isShown: boolean;
  isCorrect: boolean;
  type: CellType;
};
