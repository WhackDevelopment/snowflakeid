/**
 * This is a class that generates unique 64-bit snowflake IDs
 */
export class SnowflakeGenerator {
    // Define some constants
    static EPOCH = 1627833600000; // epoch time in milliseconds (set to 2021-08-01 00:00:00 UTC)
    // static EPOCH = (new Date().getFullYear() - 1966) * 1000 * 60 * 60 * 24 * 30 * 12;
    static SEQUENCE_BITS = 12; // number of bits reserved for the sequence number
    static MACHINE_BITS = 10; // number of bits reserved for the machine ID
    static MAX_SEQUENCE = 2 ** SnowflakeGenerator.SEQUENCE_BITS - 1; // maximum sequence number
    static MAX_MACHINE_ID = 2 ** SnowflakeGenerator.MACHINE_BITS - 1; // maximum machine ID

    /**
     * Constructor for the SnowflakeGenerator class
     *
     * @param {Object} config - Configuration object for the SnowflakeGenerator instance
     * @param {Number} config.machineId - Optional machine ID to use for the SnowflakeGenerator instance
     * @param {Number} config.timeOffset - Optional time offset (in milliseconds) to use for the SnowflakeGenerator instance
     * @throws {Error} If the provided machine ID is invalid (not between 0 and MAX_MACHINE_ID) or if the provided time offset is not a number
     */
    constructor(config = {}) {
        // Initialize the sequence number and last timestamp to 0
        this.sequence = 0;
        this.lastTimestamp = 0;

        // Generate a random machine ID if none is provided, or use the provided one
        this.machineId = config.machineId || Math.floor(Math.random() * SnowflakeGenerator.MAX_MACHINE_ID);
        // Check if the machine ID is valid (between 0 and MAX_MACHINE_ID)
        if (this.machineId > SnowflakeGenerator.MAX_MACHINE_ID || this.machineId < 0) {
            throw new Error(`Invalid machine ID: ${this.machineId}, MAX: ${SnowflakeGenerator.MAX_MACHINE_ID}`);
        }

        // Set the time offset (in milliseconds) from the epoch time, or use 0 if none is provided
        const timeOffset = config.timeOffset || 0;
        if (isNaN(timeOffset)) {
            throw new Error(`Invalid time offset: ${config.timeOffset}`);
        }
        this.timeOffset = timeOffset;
    }

    /**
     * Method to generate a new snowflake ID
     *
     * @returns {Snowflake} A new Snowflake object representing the generated ID
     * @throws {Error} If the clock moves backwards (i.e. the timestamp is earlier than the last timestamp)
     */
    generate() {
        // Get the current timestamp in milliseconds since the epoch, and add the time offset
        const timestamp = Date.now() - SnowflakeGenerator.EPOCH + this.timeOffset;
        // Check if the clock has moved backwards
        if (timestamp < this.lastTimestamp) {
            throw new Error('Clock moved backwards, waiting for the next millisecond');
        }
        // If the timestamp is the same as the last timestamp, increment the sequence number
        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & SnowflakeGenerator.MAX_SEQUENCE;
            // If the sequence number overflows, wait until the next millisecond
            if (this.sequence === 0) {
                while (Date.now() - SnowflakeGenerator.EPOCH + this.timeOffset <= this.lastTimestamp) {}
            }
        } else {
            // If the timestamp is different from the last timestamp, reset the sequence number to 0
            this.sequence = 0;
        }
        // Update the last timestamp to the current timestamp
        this.lastTimestamp = timestamp;
        // Convert the timestamp, machine ID, and sequence number to binary strings
        const timeBinary = timestamp.toString(2).padStart(42, '0');
        const machineBinary = this.machineId.toString(2).padStart(10, '0');
        const sequenceBinary = this.sequence.toString(2).padStart(12, '0');
        // Concatenate the binary strings to form the 64-bit snowflake ID
        const binary = timeBinary + machineBinary + sequenceBinary;
        // Convert the binary string to a BigInt and return a new Snowflake object
        const flake = BigInt('0b' + binary);
        return new Snowflake(flake);
    }
}

/**
 * A class that extends the built-in String class to represent a Snowflake ID.
 * Snowflake is a unique identifier used in distributed systems, particularly in Twitter's distributed messaging system.
 */
export class Snowflake extends String {
    /**
     * Creates a new Snowflake instance from a string.
     *
     * @param {string | Snowflake} flake - The Snowflake string to create an instance from.
     */
    constructor(flake) {
        super(flake.toString()); // Convert flake to a string and pass it to the String constructor
        this.timestamp = this.extractTimestamp(); // Extract timestamp from the Snowflake string and store it as a Date object
        this.machineId = this.extractMachineId(); // Extract machine ID from the Snowflake string and store it as a number
        this.timeOffset = this.extractTimeOffset(); // Extract time offset from the Snowflake string and store it as a number
    }

    /**
     * Extracts the timestamp from the Snowflake string and returns it as a Date object.
     *
     * @returns {Date} The timestamp as a Date object.
     */
    extractTimestamp() {
        const binary = this.toString(2).padStart(64, '0'); // Convert the Snowflake string to binary and pad with zeroes to 64 bits
        const timeBinary = binary.substring(0, 42); // Extract the first 42 bits, which represent the timestamp
        const timestamp = parseInt(timeBinary, 2) + SnowflakeGenerator.EPOCH; // Convert the binary timestamp to a number and add the epoch time to get the timestamp in milliseconds since Unix epoch
        return new Date(timestamp); // Convert the timestamp to a Date object and return it
    }

    /**
     * Extracts the machine ID from the Snowflake string and returns it as a number.
     *
     * @returns {number} The machine ID as a number.
     */
    extractMachineId() {
        const binary = this.toString(2).padStart(64, '0'); // Convert the Snowflake string to binary and pad with zeroes to 64 bits
        const machineBinary = binary.substring(42, 52); // Extract the bits from 42 to 52, which represent the machine ID
        return parseInt(machineBinary, 2); // Convert the binary machine ID to a number and return it
    }

    /**
     * Extracts the time offset from the Snowflake string and returns it as a number.
     *
     * @returns {number} The time offset as a number.
     */
    extractTimeOffset() {
        const binary = this.toString(2).padStart(64, '0'); // Convert the Snowflake string to binary and pad with zeroes to 64 bits
        const offsetBinary = binary.substring(52, 64); // Extract the bits from 52 to 64, which represent the time offset
        let offset = parseInt(offsetBinary, 2); // Convert the binary time offset to a number
        return offset; // If the offset is not a number, return 0; otherwise, return the offset
    }

    /**
     * Returns a new instance of SnowflakeGenerator with default configuration.
     *
     * @returns {SnowflakeGenerator} A new SnowflakeGenerator instance with default configuration.
     */
    getGenerator() {
        return new SnowflakeGenerator({ machineId: extractMachineId(), timeOffset: extractTimeOffset() }); // Create a new SnowflakeGenerator instance with default config and return it
    }
}

export default { Snowflake, SnowflakeGenerator };
