const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

async function validateRequired(resolvedValue, options = {}) {
    const result = { aborted: false, continued: false, errors: [] };
    const attributes = new Map([['required', '']]);
    const field = {
        value: '$query(#cluster-object-id).getValue()',
        willValidate: true,
        validationMessage: '',
        hasAttribute: name => attributes.has(name),
        setAttribute: (name, value) => attributes.set(name, value),
        closest: () => null,
        matches: selector => selector === ':disabled' && !!options.disabled,
        checkValidity: () => options.nativeValid !== false,
        getValue: async () => {
            if (options.failure) throw options.failure;
            return resolvedValue;
        }
    };
    const form = {
        noValidate: options.noValidate,
        matches: () => false,
        querySelectorAll: () => [],
        elements: [field]
    };
    const action = {
        form,
        element: {},
        abort: () => { result.aborted = true; },
        end: () => { result.continued = true; }
    };
    const source = readFileSync(join(__dirname, '../src/index.js'), 'utf8');
    const code = source.slice(source.indexOf('const validations'), source.indexOf('actions.init('));
    const context = vm.createContext({
        action, matches() {}, unique() {}, value() {}, clearError() {},
        errorTargets: () => [],
        renderErrors: ({ data }) => result.errors.push(...data),
        render: ({ data }) => result.errors.push(...data)
    });
    await vm.runInContext(`${code}\nvalidate(action);`, context);
    result.invalid = attributes.get('aria-invalid');
    return result;
}

test('required validates the resolved value even when the raw expression is nonempty', async t => {
    for (const value of ['', null, undefined, []]) {
        await t.test(String(value), async () => {
            const result = await validateRequired(value);
            assert.equal(result.aborted, true);
            assert.equal(result.continued, false);
            assert.equal(result.invalid, 'true');
            assert.equal(result.errors[0].message, 'A value is required.');
        });
    }
});

test('valid resolved values retain normal required semantics', async t => {
    for (const value of ['65f8cb447b39a3c1a8904e22', 0, false, ['selected']]) {
        await t.test(String(value), async () => {
            const result = await validateRequired(value);
            assert.equal(result.aborted, false);
            assert.equal(result.continued, true);
            assert.equal(result.invalid, 'false');
        });
    }
});

test('native constraint failures still abort even when the resolved value is present', async () => {
    assert.equal((await validateRequired('value', { nativeValid: false })).aborted, true);
});

test('a rejected value lookup aborts validation', async () => {
    const result = await validateRequired(null, { failure: new Error('Lookup failed') });
    assert.equal(result.aborted, true);
    assert.equal(result.continued, false);
    assert.equal(result.errors[0].message, 'Lookup failed');
});

test('disabled fields and forms opting out of native validation retain their behavior', async () => {
    for (const options of [{ disabled: true }, { noValidate: true }]) {
        const result = await validateRequired('', options);
        assert.equal(result.aborted, false);
        assert.equal(result.continued, true);
    }
});
