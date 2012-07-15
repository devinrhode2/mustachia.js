var renderToMain = function renderToMain(name, template, data, expected) {
  var result = Mustache.render(template, data);

  console.log(data);

  var testing = false;
  if (testing) {
    //TESTING
    if (typeof expected !== 'undefined') {
      if (result === expected) {
        console.log(name + ' WORKING AS EXPECTED\n'.green);
      } else {
        console.error(result + '\nExpected:');
        console.error(expected + '\n---');
      }
    } else {
      console.log(result + '\n---');
    }
  } else {
    //USING
    console.log(result + '\n---');
  }
};
var render = renderToMain;