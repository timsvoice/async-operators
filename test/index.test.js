const { describe, Try } = require('riteway');
const { asyncPipe, asyncMap, asyncSeries, asyncReduce } = require('../src');

const asyncDouble = async x => new Promise((resolve) => {
    setTimeout(() => resolve(x + x), 500)
})

const brokenAsyncDouble = async x => new Promise((resolve, reject) => {
    setTimeout(() => reject('Failed'), 500)
})

describe('asyncPipe', async assert => {
    assert({
        given: 'A list of async functions and a value',
        should: 'Apply functions to value',
        actual: await asyncPipe(asyncDouble, asyncDouble)(1),
        expected: 4
    })

    assert({
        given: 'A list of async functions including a failing function and a value',
        should: 'Throw an error',
        actual: await Try(asyncPipe(asyncDouble, brokenAsyncDouble), 1),
        expected: 'Failed'
    })
})

describe('asyncSeries', async assert => {
    assert({
        given: 'An async function and a list of values',
        should: 'Apply function to values in series and return final result',
        actual: await asyncSeries(asyncDouble)([1,2,3]),
        expected: 6
    })

    assert({
        given: 'A throwing async function and a list of values',
        should: 'Throw an error',
        actual: await Try(asyncSeries(brokenAsyncDouble), [1,2,3]),
        expected: 'Failed'
    })
})

describe('asyncMap', async assert => {
    assert({
        given: 'An async function and a list of values',
        should: 'Apply function to values in series and return a list of results',
        actual: await asyncMap(asyncDouble)([1,2,3]),
        expected: [2,4,6]
    })

    assert({
        given: 'A throwing async function and a list of values',
        should: 'Throw an error',
        actual: await Try(asyncMap(brokenAsyncDouble), [1,2,3]),
        expected: 'Failed'
    })
})

describe('asyncReduce', async assert => {
    assert({
        given: 'An async function and a list of values',
        should: 'Apply function to values in series and return a list of results',
        actual: await asyncReduce(async (prev, val) => prev + await asyncDouble(val), 0)([1,2,3]),
        expected: 12
    })

    assert({
        given: 'A throwing async function and a list of values',
        should: 'Throw an error',
        actual: await Try(asyncReduce(brokenAsyncDouble), [1,2,3]),
        expected: 'Failed'
    })
})