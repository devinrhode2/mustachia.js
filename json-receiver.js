/*
Mom called, she wants GHM renderind here.
*/
 
function firstKey(obj) {
  for (var key in obj) {
    return key;
  }
}



function receiveUpdate(update, prefix) {
  if (typeof prefix === 'undefined') {
    prefix = [];
  }
  for (var key in update) {
    if (typeof update[key] === 'number') {
      update[key] = update[key].toString();
    } else if (typeof update[key] === 'string') {
      if (prefix === []) {
        document.getElementById(prefix + key).innerHTML = update[key];
      } else {
        prefix = prefix.join('.') + key;
        console.log(prefix);
        document.getElementsByClassName(prefix)[0];
      }
    } else if (typeof update[key] === 'object') {
      receiveUpdate(update[key], prefix.push(key));
    } else if (typeof update[key] === 'array') {
      for (var i = 0; i < update[key].length; i++) {
        
      }
    }
  }
}
