import lodashStable from "lodash";

import { throttle } from '../src';
import { identity } from './utils';


describe('throttle', function () {

    it('should throttle a function', function (done) {
        var callCount = 0,
            throttled = throttle(function () { callCount++; }, 32);

        throttled();
        throttled();
        throttled();

        var lastCount = callCount;
        expect(callCount > 0).toBeTruthy();

        setTimeout(function () {
            expect(callCount > lastCount).toBeTruthy();
            done();
        }, 64);
    });


    it('subsequent calls should return the result of the first call', function (done) {
        var throttled = throttle(identity, 32),
            results = [throttled('a'), throttled('b')];

        expect(results).toEqual(['a', 'a']);

        setTimeout(function () {
            var results = [throttled('c'), throttled('d')];
            expect(results[0]).not.toBe('a');
            expect(results[0]).not.toBeUndefined();

            expect(results[0]).not.toBe('d');
            expect(results[0]).not.toBeUndefined();

            done();
        }, 64);
    });



    it('should not trigger a trailing call when invoked once', function (done) {
        var callCount = 0,
            throttled = throttle(function () { callCount++; }, 32);

        throttled();
        expect(callCount).toBe(1);

        setTimeout(function () {
            expect(callCount).toBe(1);
            done();
        }, 64);
    });


    lodashStable.times(2, function (index) {
        it('should trigger a call when invoked repeatedly' + (index ? ' and `leading` is `false`' : ''), function (done) {
            var callCount = 0,
                limit =  320,
                options = index ? { 'leading': false } : {},
                throttled = throttle(function () { callCount++; }, 32, options);

            var start = +new Date;
            while ((new Date as any - start) < limit) {
                throttled();
            }
            var actual = callCount > 1;
            setTimeout(function () {
                expect(actual).toBeTruthy();
                done();
            }, 1);
        });
    });

    it('should trigger a second throttled call as soon as possible', function (done) {
        var callCount = 0;

        var throttled = throttle(function () {
            callCount++;
        }, 128, { 'leading': false });

        throttled();

        setTimeout(function () {
            expect(callCount).toBe(1);
            throttled();
        }, 192);

        setTimeout(function () {
            expect(callCount).toBe(1);
        }, 254);

        setTimeout(function () {
            expect(callCount).toBe(2);
            done();
        }, 384);
    });

    it('should apply default options', function (done) {
        var callCount = 0,
            throttled = throttle(function () { callCount++; }, 32, {});

        throttled();
        throttled();

        expect(callCount).toBe(1);

        setTimeout(function () {
            expect(callCount).toBe(2);
            done();
        }, 128);
    });

    it('should support a `leading` option', function () {
        var withLeading = throttle(identity, 32, { 'leading': true });
        expect(withLeading('a')).toBe('a');

        var withoutLeading = throttle(identity, 32, { 'leading': false });
        expect(withoutLeading('a')).toBeUndefined();
    });

    it('should support a `trailing` option', function (done) {
        var withCount = 0,
            withoutCount = 0;

        var withTrailing = throttle(function (value) {
            withCount++;
            return value;
        }, 64, { 'trailing': true });

        var withoutTrailing = throttle(function (value) {
            withoutCount++;
            return value;
        }, 64, { 'trailing': false });

        expect(withTrailing('a')).toBe('a');
        expect(withTrailing('b')).toBe('a');

        expect(withoutTrailing('a')).toBe('a');
        expect(withoutTrailing('b')).toBe('a');

        setTimeout(function () {
            expect(withCount).toBe(2);
            expect(withoutCount).toBe(1);
            done();
        }, 256);
    });


    it('should not update `lastCalled`, at the end of the timeout, when `trailing` is `false`', function (done) {
        var callCount = 0;

        var throttled = throttle(function () {
            callCount++;
        }, 64, { 'trailing': false });

        throttled();
        throttled();

        setTimeout(function () {
            throttled();
            throttled();
        }, 96);

        setTimeout(function () {
            expect(callCount).toBeTruthy();
            done();
        }, 192);
    });

});