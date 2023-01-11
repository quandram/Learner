import type { SumOperator } from "./SumOperatorType";
import type { PlaceHolder } from "./PlaceHolderType";
import type { NumberString } from "./NumberStringType";

export type CellValue = NumberString | SumOperator | undefined | PlaceHolder;
