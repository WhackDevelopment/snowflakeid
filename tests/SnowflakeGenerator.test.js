import { SnowflakeGenerator } from '../Snowflake.js';

let snowflakeGenerator;

test('instantiate snowflake', () => {
    snowflakeGenerator = new SnowflakeGenerator({
        machineId: 420,
        timeOffset: 0
    });

    expect(snowflakeGenerator).not.toBe(null);
});

const flakes = [];
const length = 5000;

test('snowflake generation', () => {
    for (let i = 0; i < length; i++) flakes.push(snowflakeGenerator.generate().toString());
    expect(flakes.length).toBe(length);
});

test('snowflake unique', () => {
    let tmp = [];

    for (let flake of flakes) {
        if (!tmp.includes(flake)) tmp.push(flake);
    }

    expect(tmp.length).toBe(length);
});
