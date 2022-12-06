new Promise((resolve) => {
    let resolvedPromise = Promise.resolve();
    resolve(resolvedPromise);
  }).then(() => {
    console.log("resolvePromise resolved");
  });
  
  Promise.resolve()
    .then(() => {
      console.log("promise1");
    })
    .then(() => {
      console.log("promise2");
    })
    .then(() => {
      console.log("promise3");
    });