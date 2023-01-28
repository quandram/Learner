<script setup lang="ts">
import { onBeforeMount, ref, computed, watch } from "vue";
import ActivityStructureWrap from "../activityStructure/ActivityStructureWrap.vue";
import OptionalInputCell from "../OptionalInputCell.vue";
import { evaluate } from "mathjs";
import { ConfigTypes } from "../../types/ConfigTypes";
import type { SumOperator } from "../../types/SumOperatorType";
import type { CellValue } from "../../types/CellValueType";
import type { SumConfig } from "../../types/SumConfigType";
import type { Sum } from "../../types/SumType";
import type { Cell } from "../../types/CellType";
import type { CellArray } from "../../types/CellArrayType";
import { CellType } from "../../types/CellTypeType";

const props = withDefaults(
  defineProps<{
    userName: string;
    x: number;
    type: string;
    config: SumConfig[];
    refresh: boolean;
  }>(),
  {
    type: ConfigTypes.sum,
  }
);
const emit = defineEmits(["refreshCompleted", "progress", "setTitle"]);

let sums = ref<Array<Sum>>([
  {
    sumLines: [],
    carry: [],
    ok() {
      return false;
    },
  },
]);
const maxCols = 6;
let refreshCount = ref<number>(0);
onBeforeMount(() => {
  createSums();
  emit("setTitle", "Complete the sums");
});

watch(
  () => props.refresh,
  (isRefreshing: boolean) => {
    if (!isRefreshing) {
      return;
    }
    createSums();
    refreshCount.value++;
    emit("refreshCompleted");
  }
);

const createSums = function () {
  sums.value = [];
  let weightedConfigs: number[] = [];
  props.config.map((x, index) => {
    for (let i = 0; i < (x.weight || 1); i++) {
      weightedConfigs.push(index);
    }
  });
  for (let i = 0; i < props.x; i++) {
    const configForSum =
      weightedConfigs[Math.floor(Math.random() * weightedConfigs.length)];
    sums.value.push(constructSum(props.config[configForSum]));
  }
};
const getBullshitArray = function (x: number | undefined): CellValue[] {
  const a = String(x);
  const c = a.padStart(maxCols, "~");
  const d = [...c];
  const e = d.map((x: string) => x as CellValue);
  return e;
};
const constructSum = function (config: SumConfig): Sum {
  const rowsToAdd =
    Math.floor(Math.random() * (config.rows.max - config.rows.min + 1)) +
    config.rows.min;

  const getRandomNumberInRange = function () {
    return (
      Math.floor(Math.random() * (config.number.max - config.number.min + 1)) +
      config.number.min
    );
  };

  const getSumLineObject = function (operator?: SumOperator): CellArray {
    const cellArray: Cell[] = [];
    return {
      n: getRandomNumberInRange(),
      o: operator,
      cells: cellArray,
    };
  };

  const sumLines: CellArray[] = [];
  for (let i = 0; i < rowsToAdd; i++) {
    if (i === 0) {
      sumLines.push(getSumLineObject());
      continue;
    }
    const operator = Math.floor(Math.random() * config.operators.length);
    sumLines.push(getSumLineObject(config.operators[operator]));
  }
  const sum = evaluate(
    sumLines.reduce((prevValue, curValue) => {
      if (curValue.o === undefined) {
        return `${curValue.n}`;
      }
      return `${prevValue} ${curValue.o} ${curValue.n}`;
    }, "")
  );

  if (validateSum(config, sum)) {
    let cellIds: number[][] = [];
    sumLines.map((x, xIndex) => {
      x.cells = getBullshitArray(x.n).map((y, yIndex) => {
        if (y === "~") {
          return {
            value: undefined,
            isShown: false,
            isCorrect: true,
            type: CellType.empty,
          };
        }
        cellIds.push([xIndex, yIndex]);
        return {
          value: y,
          isShown: true,
          isCorrect: false,
          type: CellType.number,
        };
      });
      if (x.o === undefined) {
        x.cells.push({
          value: undefined,
          isShown: true,
          isCorrect: true,
          type: CellType.empty,
        });
      } else {
        cellIds.push([xIndex, maxCols]);
        x.cells.push({
          value: x.o,
          isShown: true,
          isCorrect: false,
          type: CellType.operator,
        });
      }
    });
    sumLines.push({
      n: undefined,
      o: undefined,
      cells: getBullshitArray(sum).map((x: CellValue, xIndex) => {
        if (x === "~") {
          return {
            value: undefined,
            isShown: false,
            isCorrect: true,
            type: CellType.empty,
          };
        }
        cellIds.push([sumLines.length, xIndex]);
        return {
          value: x,
          isShown: props.type == ConfigTypes.redacted ? true : false,
          isCorrect: false,
          type: CellType.total,
        };
      }),
    });
    if (props.type == ConfigTypes.redacted) {
      const redactedCell = Math.floor(Math.random() * cellIds.length);
      sumLines[cellIds[redactedCell][0]].cells[
        cellIds[redactedCell][1]
      ].isShown = false;
    }
    return {
      sumLines,
      carry: Array(maxCols - 1).fill(""),
      ok: function () {
        return this.sumLines.every((x) =>
          x.cells.every((y) => y.isCorrect === true)
        );
      },
    };
  } else {
    return constructSum(config);
  }
};

const validateSum = function (config: SumConfig, sum: number): boolean {
  if (config.isInteger && !Number.isInteger(sum)) {
    return false;
  }
  if (config.isPositive && sum < 0) {
    return false;
  }
  return true;
};

const correctEntries = computed(() => {
  if (sums.value[0].sumLines.length === 0) {
    return 0;
  }
  return sums.value.filter((x) => x.ok()).length;
});
watch(correctEntries, (correctEntries: number) => {
  emit("progress", correctEntries / props.x);
});

const getCellTypeCSSClass = function (type: number) {
  switch (type) {
    case CellType.empty:
      return "cell-empty";
    case CellType.number:
      return "cell-number";
    case CellType.operator:
      return "cell-operator";
    case CellType.total:
      return "cell-total";
    default:
      break;
  }
};
</script>

<template>
  <div>
    <ActivityStructureWrap>
      <div
        v-for="(s, sIndex) in sums"
        :key="sIndex"
        :class="`x ${s.ok() ? 'x-done' : ''} sum`"
      >
        <template v-for="(line, lIndex) in s.sumLines" :key="lIndex">
          <hr
            v-if="lIndex === s.sumLines.length - 1"
            style="grid-column: 1/-1"
          />
          <template v-for="(n, nIndex) in line.cells" :key="nIndex">
            <span v-if="n.value === undefined"></span>
            <span v-else :class="`cell ${getCellTypeCSSClass(n.type)}`">
              <OptionalInputCell
                :key="refreshCount"
                :value="n.value"
                :isValueShown="n.isShown"
                @isCorrect="n.isCorrect = $event"
            /></span>
          </template>
        </template>
        <hr style="grid-column: 1/-1" />
        <input
          class="cell cell-carry"
          v-for="(c, cIndex) in s.carry"
          :key="cIndex"
          v-model="s.carry[cIndex]"
          maxlength="1"
          oninput="this.value=this.value.replace(/[^0-9]/g,'');"
        />
      </div>
    </ActivityStructureWrap>
  </div>
</template>

<style scoped scss>
.x {
  border: 1px dashed;
  margin: 0.5rem;
  padding: 0.5rem;
}
.x-done {
  border: 1px solid;
}
.sum {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 5px;
}
.cell {
  align-items: center;
  border: 1px solid red;
  display: flex;
  font-size: 2rem;
  justify-content: center;
  min-width: 40px;
  min-height: 55px;
}
.cell-empty {
  border: 0px;
}
.cell-operator {
  border-color: orange;
}
.cell-total {
  border-color: pink;
}
.cell-carry {
  border-color: yellow;
  font-size: 1rem;
  min-height: 28px;
  text-align: center;
}
</style>
