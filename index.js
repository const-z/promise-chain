"use strict";

class Chain extends Promise {
  constructor() {
    super((() => null, () => null));
    this.tasks = [];
  }

  first() {
    const t = (params) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("first done with params:", params);
          resolve(1);
        }, 200);
      });

    this.tasks.push(t);

    return this;
  }

  second() {
    const t = (params) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("second done with params:", params);
          resolve(2);
        }, 300);
      });

    this.tasks.push(t);

    return this;
  }

  async then() {
    let result = null;
    for (const task of this.tasks) {
      result = await task(result);
    }

    const promise = Promise.resolve(result);
    return promise.then.apply(promise, arguments);
  }
}

const chain = new Chain();

async function run() {
  try {
    const v = await chain.second().first();
    console.log("v = ", v);
  } catch (err) {
    console.error(err);
  }
}

run();
