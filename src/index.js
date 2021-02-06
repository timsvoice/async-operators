/**
 * @description Pipe for async functions
 * @param  {functions} fns A list of pipeline functions
 * @returns {function(any)} The value produced by the pipeline
 * 
 * @example
 * 
 * const addOneAsync = async (x) => new Promise((resolve) => setTimeout(() => resolve(x + 1), 500))
 * const addTwoAsync = async (x) => new Promise((resolve) => setTimeout(() => resolve(x + 2), 500))
 * 
 * const pipeline = asyncPipe(
 *  addOneAsync,
 *  addTwoAsync,
 * )
 * 
 * await pipeline(1) // 4
 */
const asyncPipe = (...fns) => x => fns.reduce(async (y, f) => f(await y), x);

/**
 * @description Apply an async function to a list of arguments in sequence returning only the result of the final application
 * @param  {function} fn An async function to apply to each element in an list of arguments
 * @returns {function(any[]): any} A function to be applied in sequence to each element in a given list of arguments
 * 
 * @example
 * const addTwoAsync = asyncSeries(async (x) => new Promise(resolve => setTimeout(() => resolve(x + 2), 500)))
 *
 * await addTwoAsync([1,2,3]) // 5
 */
const asyncSeries = fn => xs => xs.reduce((x, y) => x.then(() => fn(y)), Promise.resolve())

/**
 * @description Generate a new list populated with the results of applying an async function to every element in the calling list
 * @param  {function} fn An async function that is called for every element of the list
 * @returns {function(any[]): any[]} A function to be applied to a given list of arguments
 * 
 * @example
 * const mapAddTwoAsync = asyncMap(async (x) => new Promise(resolve => setTimeout(() => resolve(x + 2), 500)))
 *
 * await mapAddTwoAsync([1,2,3]) // [3, 4, 5]
 */
const asyncMap = fn => xs => xs.reduce((y, x) => y.then((col) => fn(x).then(res => [...col, res])), Promise.resolve([]))

/**
 * @description Apply an async reducer function (that you provide) on each element of the list, resulting in single output value
 * @param  {function} fn An async reducer function to apply to a list of arguments
 * @param  {any} acc A reducer initial value
 * @returns {function(any[]): any} An async reducer function to be applied to a given list of arguments
 * 
 * @example
 * const asyncDouble = async x => new Promise((resolve) => { setTimeout(() => resolve(x + x), 500) })
 * const asyncDoubleSum = asyncReduce(async (prev, val) => prev + await asyncDouble(val), 0)
 *
 * await asyncDoubleSum([1,2,3]) // 12
 */
const asyncReduce = (fn, acc) => xs => xs.reduce((y, x) => y.then(res => fn(res, x)), Promise.resolve(acc))

module.exports = {
    asyncPipe,
    asyncSeries,
    asyncMap,
    asyncReduce
}