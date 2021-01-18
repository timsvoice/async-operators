/**
 * @description Pipe for async functions
 * @param  {functions} fns A list of pipeline functions
 * @returns {function(any)} The value produced by the pipeline
 * 
 * @example
 * const pipeline = asyncPipe(
 *  async (x) => new Promise((resolve) => setTimeout(() => resolve(x + 1), 500)),
 *  async (x) => new Promise((resolve) => setTimeout(() => resolve(x + 2), 500)),
 * )
 * 
 * await pipeline(1) // 4
 */
const asyncPipe = (...fns) => x => fns.reduce(async (y, f) => f(await y), x);

/**
 * @description Apply an async function to a list of arguments in sequence returning only the result of the final application
 * @param  {function} fn An async function to apply to an array of arguments
 * @returns {function(any[]): any} A function applied in sequence to a given list of arguments
 * 
 * @example
 * const asyncSeq = asyncSeries(async (x) => new Promise(resolve => setTimeout(() => resolve(x + 2), 500)))
 *
 * await asyncSeq([1,2,3]) // 5
 */
const asyncSeries = f => xs => xs.reduce((x, y) => x.then(() => f(y)), Promise.resolve())

/**
 * @description Apply an async function to a list of arguments in sequence collecting all the results and returning them in a list
 * @param  {function} fn An async function to apply to an array of arguments
 * @returns {function(any[]): any[]} A function applied in sequence to a given list of arguments
 * 
 * @example
 * const asyncSeq = asyncReduce(async (x) => new Promise(resolve => setTimeout(() => resolve(x + 2), 500)))
 *
 * await asyncSeq([1,2,3]) // [3, 4, 5]
 */
const asyncReduce = fn => xs => xs.reduce((y, x) => y.then((col) => fn(x).then(res => [...col, res])), Promise.resolve([]))

module.exports = {
    asyncPipe,
    asyncSeries,
    asyncReduce
}