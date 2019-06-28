import lodashStable from 'lodash';
import _ from '../src';
import { noop } from './utils';

describe('debounce and throttle', function () {

    ['debounce', 'throttle'].forEach(function (methodName) {

        var func = _[methodName],
            isDebounce = methodName == 'debounce';

        it('`_.' + methodName + '` should not error for non-object `options` values', function () {
            func(noop, 32, 1);
            expect(true).toBeTruthy();
        });

        it('`_.' + methodName + '` should use a default `wait` of `0`', function (done) {
            var callCount = 0,
                funced = func(function () { callCount++; });

            funced();

            setTimeout(function () {
                funced();
                expect(callCount).toBe(isDebounce ? 1 : 2);
                done();
            }, 32);
        });

        it('`_.' + methodName + '` should invoke `func` with the correct `this` binding', function (done) {
            var actual = [],
                object = { 'funced': func(function () { actual.push(this as never); }, 32) },
                expected = lodashStable.times(isDebounce ? 1 : 2, lodashStable.constant(object));

            object.funced();
            if (!isDebounce) {
                object.funced();
            }
            setTimeout(function () {
                expect(actual).toEqual(expected);
                done();
            }, 64);
        });

        it('`_.' + methodName + '` supports recursive calls', function (done) {
            var actual = [],
                args = lodashStable.map(['a', 'b', 'c'], function (chr) { return [{}, chr]; }),
                expected = args.slice(),
                queue = args.slice();

            var funced = func(function () {
                var current = [this];
                Array.prototype.push.apply(current, arguments);
                actual.push(current as never);

                var next = queue.shift();
                if (next) {
                    funced.call(next[0], next[1]);
                }
            }, 32);

            var next = queue.shift();
            funced.call(next![0], next![1]);
            expect(actual).toEqual(expected.slice(0, isDebounce ? 0 : 1))

            setTimeout(function () {
                expect(actual).toEqual(expected.slice(0, actual.length));
                done();
            }, 256);
        });

        it('`_.' + methodName + '` should support cancelling delayed calls', function (done) {
            var callCount = 0;

            var funced = func(function () {
                callCount++;
            }, 32, { 'leading': false });

            funced();
            funced.cancel();

            setTimeout(function () {
                expect(callCount).toBe(0);
                done();
            }, 64);
        });

        it('`_.' + methodName + '` should reset `lastCalled` after cancelling', function (done) {
            var callCount = 0;

            var funced = func(function () {
                return ++callCount;
            }, 32, { 'leading': true });

            expect(funced()).toBe(1);
            funced.cancel();

            expect(funced()).toBe(2);
            funced();

            setTimeout(function () {
                expect(callCount).toBe(3);
                done();
            }, 64);
        });


        it('`_.' + methodName + '` should support flushing delayed calls', function (done) {
            var callCount = 0;

            var funced = func(function () {
                return ++callCount;
            }, 32, { 'leading': false });

            funced();
            expect(funced.flush()).toBe(1);

            setTimeout(function () {
                expect(callCount).toBe(1);
                done();
            }, 64);
        });

        it('`_.' + methodName + '` should noop `cancel` and `flush` when nothing is queued', function (done) {
            var callCount = 0,
                funced = func(function () { callCount++; }, 32);

            funced.cancel();
            expect(funced.flush()).toBeUndefined();

            setTimeout(function () {
                expect(callCount).toBe(0);
                done();
            }, 64);
        });

    });
});