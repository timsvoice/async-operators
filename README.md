# Async Operators

```
npm i --save @mighty-maker/async-operators
```

Utilities useful for composing pipelines of async functions. Many functions in this library have a synchronous analog such as Pipe, Map, and Reduce. These should be familiar and can be used like their synchronous counterparts.

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

