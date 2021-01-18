const { describe, Try } = require('riteway');
const { asyncPipe, asyncSeries, asyncReduce } = require('../src');

const fn = async x => new Promise((resolve) => {
    setTimeout(() => resolve(x + 1), 500)
})

const brokenFn = async x => new Promise((resolve, reject) => {
    setTimeout(() => reject('Failed'), 500)
})

describe('asyncPipe', async assert => {
    assert({
        given: 'A list of async functions and a value',
        should: 'Apply functions to value',
        actual: await asyncPipe(fn, fn)(1),
        expected: 3
    })

    assert({
        given: 'A list of async functions including a failing function and a value',
        should: 'Throw an error',
        actual: await Try(asyncPipe(fn, brokenFn), 1),
        expected: 'Failed'
    })
})

describe('asyncSeries', async assert => {
    assert({
        given: 'An async function and a list of values',
        should: 'Apply function to values in series and return final result',
        actual: await asyncSeries(fn)([1,2,3]),
        expected: 4
    })

    assert({
        given: 'A throwing async function and a list of values',
        should: 'Throw an error',
        actual: await Try(asyncSeries(brokenFn), [1,2,3]),
        expected: 'Failed'
    })
})

describe('asyncReduce', async assert => {
    assert({
        given: 'An async function and a list of values',
        should: 'Apply function to values in series and return a list of results',
        actual: await asyncReduce(fn)([1,2,3]),
        expected: [2,3,4]
    })

    assert({
        given: 'A throwing async function and a list of values',
        should: 'Throw an error',
        actual: await Try(asyncReduce(brokenFn), [1,2,3]),
        expected: 'Failed'
    })
})