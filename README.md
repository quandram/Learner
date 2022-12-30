# Learner

I'm learning stuff - the kids are learning stuff... all good

## Config

- Onus on config to limit use of isInteger to reasonable scenarios

## Activities

Description of the data config for each activity.

```x = {number of things to present to the user}```

### SelectX

```"from": [{list of words that x get selected from}]```

``` json
"data": { 
  "x": 30,
  "from": ["word", "list"]
}
```

### Sums

```"operators: [{array of operators available to use}]```

```"rows`: {min/max number of rows that can be in the sum}```

```"number`: {min/max number that can be in the sum}```

```"weight`: {weighting that this config should appear relative to others}```

``` json
"data": {
  "operators": ["+"],
  "rows": {
    "min": 2,
    "max": 2
  },
  "number": {
    "min": 1,
    "max": 99
  },
  "weight": 2
},
```

#### Type = "sum"

The default, a standard sum

```json
"data": {
  "type": "sum"
}
```

#### Type = "redacted

A complete sum with a single component (number or operator) missing

```json
"data": {
  "type": "redacted"
}
```
