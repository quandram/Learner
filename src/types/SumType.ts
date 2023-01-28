import type { CellArray } from "./CellArrayType";

export type Sum = {
  sumLines: Array<CellArray>;
  carry: Array<number>;
  ok: () => boolean;
};
