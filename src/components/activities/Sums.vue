<script setup lang="ts">
import { onBeforeMount, ref, computed, watch } from "vue";
import DocumentationIcon from "../icons/IconDocumentation.vue";

const props = defineProps<{
  userName: string;
  name: string;
  x: number;
  sumConfig: Object[];
  refresh: boolean;
}>();
const emit = defineEmits(["refreshCompleted"]);

let sums = ref([{ ok: false }]);
const maxCols = 6;
onBeforeMount(() => {
  createSums();
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
  for (let i = 0; i < props.x; i++) {
    const configForSum =
      props.sumConfig[Math.floor(Math.random() * props.sumConfig.length)];
    sums.value.push(constructSum(configForSum));
  }
  console.log(sums);
};

const constructSum = function (config) {
  //
  const rowsToAdd =
    Math.floor(Math.random() * (config.rows.max - config.rows.min)) +
    config.rows.min;
  const minNum = Math.pow(10, config.digits.min - 1);
  const maxNum = Math.pow(10, config.digits.max) - 1;

  const sumLines = [];
  for (let i = 0; i < rowsToAdd; i++) {
    if (i === 0) {
      sumLines.push({ n: Math.floor(Math.random() * (maxNum - minNum)) });
      continue;
    }
    const operator = Math.floor(Math.random() * config.operators.length);
    sumLines.push({
      n: Math.floor(Math.random() * (maxNum - minNum)),
      o: config.operators[operator],
    });
  }
  const sum = sumLines.reduce((prevValue, curValue) => {
    if (curValue.o === undefined) {
      return curValue.n;
    }
    return mathFunctions[curValue.o](prevValue, curValue.n);
  }, 0);
  if (validateSum(config, sum)) {
    return {
      sumLines,
      sum,
      total: Array(maxCols).fill(""),
      carry: Array(maxCols - 1).fill(false),
      ok: function () {
        return Number(this.total.join("")) === this.sum;
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
    console.log(`validate: ${sum} - false`);
    return false;
  }
  console.log(`validate: ${sum} true`);
  return true;
};

const mathFunctions = {
  "+": function (x: number, y: number) {
    return x + y;
  },
  "-": function (x: number, y: number) {
    return x - y;
  },
  "*": function (x: number, y: number) {
    return x * y;
  },
  "/": function (x: number, y: number) {
    return x / y;
  },
};

const allCorrect = computed(() => {
  return sums.value.every((x) => x.ok());
});

const numericalCellContents = function (n) {
  return n !== "-" ? n : "";
};
const getNumericalCellClass = function (
  digitsInNumber: number,
  columnIndex: number,
  isFirstLine: boolean
) {
  if (digitsInNumber + columnIndex - maxCols < -1) {
    return "cell-empty";
  }
  if (digitsInNumber + columnIndex - maxCols === -1) {
    return isFirstLine ? "cell-empty" : "cell-operator";
  }
  return "cell-number";
};
</script>

<template>
  <div>
    <div>
      <h3><DocumentationIcon /> Select X from... {{ props.name }}</h3>
    </div>
    <div class="selected">
      <div
        v-for="(s, sIndex) in sums"
        :key="sIndex"
        :class="`x ${s.ok() ? 'x-done' : ''} sum`"
      >
        <template v-for="(line, lIndex) in s.sumLines" :key="lIndex">
          <div
            :class="`cell ${getNumericalCellClass(
              String(line.n).length,
              nIndex,
              lIndex === 0
            )}`"
            v-for="(n, nIndex) in String(line.n).padStart(maxCols, '-')"
            :key="nIndex"
          >
            <span v-if="String(line.n).length + nIndex - maxCols < -1"></span>
            <span
              v-else-if="
                lIndex > 0 && String(line.n).length + nIndex - maxCols === -1
              "
            >
              {{ line.o }}
            </span>

            <span>{{ numericalCellContents(n) }}</span>
          </div>
        </template>
        <hr style="grid-column: 1/-1" />
        <input
          class="cell cell-total"
          v-for="(n, nIndex) in maxCols"
          :key="nIndex"
          v-model="s.total[nIndex]"
          maxlength="1"
          oninput="this.value=this.value.replace(/[^0-9]/g,'');"
        />
        <hr style="grid-column: 1/-1" />
        <div
          v-for="(c, cIndex) in s.carry"
          :key="cIndex"
          class="cell cell-carry"
          @click="s.carry[cIndex] = !c"
        >
          {{ c ? "1" : "" }}
        </div>
      </div>
    </div>
    <div v-show="allCorrect" class="congratulations">
      Well done {{ props.userName }}
    </div>
  </div>
</template>

<style scoped scss>
.selected {
  display: flex;
}
.x {
  border: 1px dashed;
  margin: 0.5rem;
  padding: 0.5rem;
}
.x-done {
  border: 1px solid;
}
.congratulations {
  font-size: 4rem;
}
.sum {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
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
  background-color: transparent;
  color: white;
  text-align: center;
}
.cell-carry {
  border-color: yellow;
  font-size: 1rem;
  min-height: 28px;
}
</style>