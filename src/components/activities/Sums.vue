<script setup lang="ts">
import { onBeforeMount, ref, computed, watch } from "vue";
import ActivityWrap from "./ActivityWrap.vue";
import OptionalInputCell from "../OptionalInputCell.vue";
import { evaluate } from "mathjs";

const props = defineProps<{
  userName: string;
  x: number;
  sumConfig: Object[];
  refresh: boolean;
}>();
const emit = defineEmits(["refreshCompleted", "progress", "setTitle"]);

let sums = ref([{ ok: false }]);
const maxCols = 6;
const placeHolderValue = "~";
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
    emit("refreshCompleted");
  }
);

const createSums = function () {
  sums.value = [];
  let weightedConfigs = [];
  props.sumConfig.map((x, index) => {
    for (let i = 0; i < (x.weight || 1); i++) {
      weightedConfigs.push(index);
    }
  });
  for (let i = 0; i < props.x; i++) {
    const configForSum =
      weightedConfigs[Math.floor(Math.random() * weightedConfigs.length)];
    sums.value.push(constructSum(props.sumConfig[configForSum]));
  }
};

const constructSum = function (config) {
  const rowsToAdd =
    Math.floor(Math.random() * (config.rows.max - config.rows.min + 1)) +
    config.rows.min;

  const getRandomNumberInRange = function () {
    return (
      Math.floor(Math.random() * (config.number.max - config.number.min + 1)) +
      config.number.min
    );
  };

  const sumLines = [];
  for (let i = 0; i < rowsToAdd; i++) {
    if (i === 0) {
      sumLines.push({
        n: getRandomNumberInRange(),
      });
      continue;
    }
    const operator = Math.floor(Math.random() * config.operators.length);
    sumLines.push({
      n: getRandomNumberInRange(),
      o: config.operators[operator],
    });
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
    sumLines.map((x) => {
      x.cells = [...String(x.n).padStart(maxCols, placeHolderValue)].map(
        (y) => {
          return {
            value: y,
            isShown: true,
            isCorrect: y === placeHolderValue ? true : false,
          };
        }
      );
      x.cells.push({
        value: x.o === undefined ? placeHolderValue : x.o,
        isShown: true,
        isCorrect: x.o === undefined ? true : false,
      });
    });
    return {
      sumLines,
      sum,
      totalCells: [...String(sum).padStart(maxCols, placeHolderValue)].map(
        (x) => {
          return {
            value: x,
            isShown: false,
            isCorrect: x === placeHolderValue ? true : false,
          };
        }
      ),
      carry: Array(maxCols - 1).fill(""),
      ok: function () {
        return (
          this.sumLines.every((x) =>
            x.cells.every((y) => y.isCorrect === true)
          ) && this.totalCells.every((x) => x.isCorrect === true)
        );
      },
    };
  } else {
    return constructSum(config);
  }
};

const validateSum = function (config, sum) {
  if (config.isInteger && !Number.isInteger(sum)) {
    return false;
  }
  if (config.isPositive && sum < 0) {
    return false;
  }
  return true;
};

const correctEntries = computed(() => {
  if (sums.value[0].ok === false) {
    return;
  }
  return sums.value.filter((x) => x.ok()).length;
});
watch(correctEntries, (correctEntries: number) => {
  emit("progress", correctEntries / props.x);
});
</script>

<template>
  <div>
    <ActivityWrap>
      <div
        v-for="(s, sIndex) in sums"
        :key="sIndex"
        :class="`x ${s.ok() ? 'x-done' : ''} sum`"
      >
        <template v-for="(line, lIndex) in s.sumLines" :key="lIndex">
          <template v-for="(n, nIndex) in line.cells" :key="nIndex">
            <span v-if="n.value === placeHolderValue"></span>
            <span
              v-else
              :class="`cell ${
                nIndex === maxCols
                  ? 'cell-operator'
                  : n.isShown
                  ? 'cell-number'
                  : 'cell-empty'
              }`"
            >
              <OptionalInputCell
                :value="n.value"
                :isValueShown="n.isShown"
                @isCorrect="n.isCorrect = $event"
            /></span>
          </template>
        </template>
        <hr style="grid-column: 1/-1" />
        <template v-for="(n, nIndex) in s.totalCells" :key="nIndex">
          <span v-if="n.value === placeHolderValue"></span>
          <span v-else class="cell cell-total">
            <OptionalInputCell
              :value="n.value"
              :isValueShown="n.isShown"
              @isCorrect="s.totalCells[nIndex].isCorrect = $event"
            />
          </span>
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
    </ActivityWrap>
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
