# Async Operators

This library contains a collection of utilities useful for composing pipelines of async functions. Many functions in this library have a synchronous analog such as Pipe, Map, and Reduce. These should be familiar and can be used like their synchronous counterparts.

## Installation

```
npm i --save @mighty-maker/async-operators
```

## Usage

### asyncPipe

`asyncPipe` is the backbone of this library and is used to compose a list of async functions, making your program's flow easy to read and reason about. For example:

```javascript
const addOneAsync = async (x) => new Promise((resolve) => setTimeout(() => resolve(x + 1), 500))
const addTwoAsync = async (x) => new Promise((resolve) => setTimeout(() => resolve(x + 2), 500))
const addThree = (x) => x + 3

const pipeline = asyncPipe(
 addOneAsync,
 addTwoAsync,
 addThree
)

await pipeline(1) // 4
```

Here, we are creating a new function `pipeline` that is the result of compose three other functions. `addOneAsync` is applied to the value passed to `pipeline` and `addTwoAsync` is applied to the result of `addOneAsync`. Notice the inclusion of `addThree` in the pipeline. Not every function in the pipeline needs to be async, you can perform synchronous operations at any stage.

### asyncSeries

`asyncSeries` is a bit of an outlier in that it doesn't have a direct analog in JavaScript's built in array operators. Where it's useful is in running a series of async functions where you don't care about the individual results of the function calls, but simply that the series of functions ran. For convenience, `asyncSeries` will return the result of the final function call.

```javascript
 const addTwoAsync = asyncSeries(async (x) => new Promise(resolve => setTimeout(() => resolve(x + 2), 500)))
 const finalResult = await addTwoAsync([1,2,3]) // 5
```

Here the result of calling `addTwoAsync` on the last value in the list (3) is returned (5) even though `addTwoAsync` as applied all the numbers in the list.

Example use case: firing off a series of messages to a service that will process them in the background. Here the return value of the function is irrelevant, we just care that the message was sent without an error.

### asyncMap

`asyncMap` can be thought of as `Array.map()` but performed asynchronously. The results of applying the mapper function you provide to each element in the list are returned as a list.

```javascript
const mapAddTwoAsync = asyncMap(async (x) => new Promise(resolve => setTimeout(() => resolve(x + 2), 500))) 
const resultsList = await mapAddTwoAsync([1,2,3]) // [3, 4, 5]
```

### asyncReduce

`asyncReduce` can be thought of as `Array.reduce()` but performed asynchronously. The results of applying the reducer function to each element in the list are accumulated and returned as the final result.

```javascript
const asyncDouble = async x => new Promise((resolve) => { setTimeout(() => resolve(x + x), 500) })
const asyncDoubleSum = asyncReduce(async (prev, val) => prev + await asyncDouble(val), 0)
 
const accumulatedRestul = await asyncDoubleSum([1,2,3]) // 12
```

`asyncReduce` can be useful for retrieving paginated restults from an API.