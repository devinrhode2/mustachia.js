var Hogan = require('hogan.js');
var Mustache = require('mustachia.js');
var colors = require('colors');
console.log('Starting'.magenta + '\n---');
var render = function render(name, template, data, expected) {
  //Hogan:
  //var result = Hogan.compile(template).render(data);
  
  //Official Mustache:
  var result = Mustache.render(template, data);
  
  var testing = false;
  if (testing) {
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
    console.log(result + '\n---');
  }
};


//single var!
render('single var', '<p>{{bean}}</p>', {bean: 'beanie'}, 'beanie');

//list! (classes are for lists)
render('lists',
'{{#repo}}\
<b>{{name}}</b>\
{{/repo}}',
{
  "repo": [
    { "name": "resque" },
    { "name": "hub" },
    { "name": "rip" },
  ]
},
'<b>resque</b>\
<b>hub</b>\
<b>rip</b>');


//lambdas (aka functions returning values)
//lambdas aren't working.
render('{{#wrapped}}{{name}} is awesome.{{/wrapped}}', {
  "name": "Willy",
  "wrapped": function() {
    return function(text) {
      return "<b>" + render(text) + "</b>"
    }
  }
}, '<b>Willy is awesome.</b>');

render('stepping into new context', '{{#person?}}\
Hi {{name}}!\
{{/person?}}', {
  "person?": { "name": "Jon" }
}, 'Hi Jon!');
//"person?": { "name": "Jon" }
//name: "Jon"

render('inverse/falsy sections', '{{#repo}}\
<b>{{name}}</b>\
{{/repo}}\
{{^repo}}\
No repos :(\
{{/repo}}', {
  "repo": []
}, 'No repos :(');

//comment
render('comments', '{{! ignore me }}', {}, '');

//partials
/*
render('partials', '<h2>Names</h2>{{#names}}\
<strong>{{name}}</strong>\
{{/names}}', {
  names: [
    {name: 'Devin'},
    {name: 'Suzie'}
  ]
}, '<h2>Names</h2><strong>Devin</strong><strong>Suzie</strong>');
*/