<div align="center">
    <a target="_blank" href="https://whackdevelopment.com/">
        <img target="_blank" style="border-radius:50%;" width="200" height="200" src="https://avatars.githubusercontent.com/u/110769913"/>
    </a>
</div>
<div align="center">
    <h1><a target="_blank" href="https://paypal.me/WhackDevelopment">@WhackDevelopment</a></h1>
    <a target="_blank" href="https://discord.gg/WhackDevelopment">
        <img src="https://img.shields.io/discord/1075538521340776489?style=for-the-badge&logo=discord">
    </a>
    <a target="_blank" href="https://paypal.me/WhackDevelopment">
        <img src="https://img.shields.io/badge/Donate-PayPal-blue?style=for-the-badge&logo=paypal" alt="PayPal">
    </a>
    <a target="_blank" href="https://github.com/WhackDevelopment/snowflakeid/issues">
        <img src="https://img.shields.io/github/issues/WhackDevelopment/snowflakeid.svg?style=for-the-badge&logo=github">
    </a>
    <br>
</div>

---

# NodeJS SnowflakeIds

## Installation

> npm install @whackdevelopment/snowflakeid

### generates unique 64-bit snowflake IDs inspired by Twitter and Discord IDs

#### NPMJS [@whackdevelopment/snowflakeid](https://www.npmjs.com/package/@whackdevelopment/snowflakeid)

---

## Usage

---

### Import Snowflake

#### Common NodeJS

```js
const { Snowflake, SnowflakeGenerator } = require('@whackdevelopment/snowflakeid'); /* nodejs only */
```

#### NodeJS ES Module

```js
import { Snowflake, SnowflakeGenerator } from '@whackdevelopment/snowflakeid';
```

---

### Create a new SnowflakeGenerator

```js
const flakeGenerator = new SnowflakeGenerator({
    machineId: 1, // optional, define machine id (defaults to 1)
    timeOffset: 0 // optional, define a offset time (defaults to 0)
});
```

#### Options

machineId: (Defaults to 1) A machine id or any random id. If you are generating id in distributed system, its highly advised to provide a proper machineId which is unique to different machines.

timeOffset: (Defaults to 0) Time offset will be subtracted from current time to get the first 42 bit of id. This help in generating smaller ids. ( not recommended )

---

### Generate a Snowflake

```js
const id1 = flakeGenerator.generate(); // returns something like 112867124767768576
const id2 = flakeGenerator.generate(); // returns something like 112867124784545792
```

---

### Create a new Snowflake from a Snowflake String

```js
const id1Clone = new Snowflake(id1.toString()); // or
const id2Clone = new Snowflake(id2);
```

---
