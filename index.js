"use strict";

class Chain extends Promise {
  constructor(params) {
    super((resolve, reject) => resolve(params));
    this.params = params;
    this.chain = [];
  }

  first() {
    const t = params =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("first done with params:", params);
          resolve(1);
        }, 200);
      });

    this.chain.push(t);

    return this;
  }

  second() {
    const t = params =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("second done with params:", params);
          resolve(2);
        }, 300);
      });

    this.chain.push(t);

    return this;
  }

  async then() {
    let result = this.params;
    for (const task of this.chain) {
      result = await task(result);
    }

    this.chain = [];

    const promise = Promise.resolve(result);

    return promise.then.apply(promise, arguments);
  }
}

const chain = new Chain("start");

async function run() {
  try {
    const result1 = await chain.second().first();
    console.log("result 1:", result1);
    
    console.log("---------------");

    const result2 = await chain.first().second();
    console.log("result 2:", result2);
  } catch (err) {
    console.error(err);
  }
}

run();
