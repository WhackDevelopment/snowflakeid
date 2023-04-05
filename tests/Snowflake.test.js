import { Snowflake, SnowflakeGenerator } from '../Snowflake.js';

let snowflakeGenerator;
let generatedFlake;
let additionalFlake;

test('instantiate snowflake', () => {
    snowflakeGenerator = new SnowflakeGenerator({
        machineId: 420,
        timeOffset: 0
    });

    expect(snowflakeGenerator).not.toBe(null);
});

for (let i = 0; i < 20; i++) {
    test(i + ',) generatedFlake generation', () => {
        generatedFlake = snowflakeGenerator.generate();
        expect(generatedFlake).not.toBe(null);
    });

    test(i + '.) additionalFlake generation', () => {
        additionalFlake = snowflakeGenerator.generate();
        expect(additionalFlake).not.toBe(null);
    });

    test(i + '.) snowflake compare additionalFlake with generatedFlake', () => {
        additionalFlake = new Snowflake(generatedFlake.toString());
        expect(additionalFlake.extractMachineId()).toEqual(generatedFlake.extractMachineId());
        expect(additionalFlake.extractTimeOffset()).toEqual(generatedFlake.extractTimeOffset());
        expect(additionalFlake.extractTimestamp()).toEqual(additionalFlake.extractTimestamp());
    });
}
