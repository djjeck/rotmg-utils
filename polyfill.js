if (typeof Object.values !== 'function') {
  Object.values = function(obj) {
    const values = [];
    for (const key in obj) {
      values.push(obj[key]);
    }
    return values;
  }
}
