## mustachia.js - mustache templates with some live updating spice.

mustachia.js is a fork of [mustache.js](http://github.com/janl/mustache.js) that sets up your logic-less mustache templates with a hook and client side file to update your templates data in real-time with [socket.io](http://socket.io/)

I heard all the craze about backbone and knockout, and after viewing their homepage, I realized there are many many pages to documentation to learn.

Mustache templates are a one-time operation to load the data into the page.

I realized this doesn't have a to be, and having them auto-update is *extremely trivial*

So, we have this mustache:

<p>Hello, {{username}}</p>

Instead of just outputting:

<p>Hello, Bob</p>

We could do:

<p>Hello, <span> id="username">Bob</span></p>

Got new data for the view? Don't refresh the page, we just need the new JSON for the view: */

    function receiveUpdate(update){ //update is the new JSON for the view.
      for (var key in update) { //for each data item that needs to be updated.
        document.getElementById(key).innerHTML = update[key]; //get that data item by id, and update it!
      }
    });

We don't have to reload the page to refill the template with the updated data. All we have to do is get the updated data.
Based on the mustache protocal, we know what dom elements need the new data.

..but the implementation isn't quite as simple... (but it's still amazingly simple)

_If you really end up digging in_, below I'm going to document the json value identification system below. Basically, for any given mustache json, we need to generate a unique `id` or `class` so we can then do `getElementById` or `getElementsByClassName` to update that data.

<h2><em>Here, take a journey with me</em></h2>

`getElementByClassName` can handle one array index. It doesn't make sense to accept two indices. But what if you have purely array based JSON like below?

    {
      [
        ['a', 'adf'],
        ['b', 'adf'],
        ['c', 'adf'],
        ['d', 'adf'],
      ]
    }

...how do you identify some given array? Hold that thought, does it work for this JSON?

    {
      [
        ['a', 'adf'],
        ['b', 'adf'],
        ['c', 'adf'],
        [
          ['a', 'adf'],
          ['b', 'adf'],
          ['c', 'adf'],
        ],
      ]
    }

If such magic as mustachia.js is going to be applied, it needs to accept ALL and ANY JSON structure. I think. Perhaps mustache can't handle any json structure, perhaps this doesn't either. But it can, it's not impossible. The goal is transparent life html, not a beautiful API. Namely, the span id's and class's don't need exactly need to be pretty.

The way to accept any JSON is to translate the array indices into the class and id attributes. 

Then everything is unique and there are no need for classes. Perhaps this works for you.

Perhaps you're more like me, and itch to be more elegant. Well, `getElementsByClassName` can accept one of those array indices. So, you can effectively drop off the last array index. 

You probably want to push all this JSON path data onto an array, so you don't get throw by someone starting an json key with a number and a dot. 

An simple example of all this mumbo jumbo:

    {
      devin: {
        isDeveloper: true,
        languages: [
          'php', 'html', 'css', 'judge me, the only other essential language is:', 'javascript'
        ]
      }
    }

These data items would have the following identifiers generated for them:

    id: devin.isDeveloper
    class: devin.langauges

To get any given language, the array index is handled by getElementsByClassName.

A full advanced example, based on StackOverflow:

    {
      question: {
       author: 'devinrhode2',
       content: 'der how does all dat shiz get identified?!!?!'
      },
      answers: [
        {
          author: '',
          content: '',
          time: '',
          comments: [
            { ... },
            { ... },
            { ... },
          ]
        },
        {
          author: '',
          content: '',
          time: '',
          comments: [
            { ... },
            { ... },
            { ... },
          ]
        },
        {
          author: '',
          content: '',
          time: '',
          comments: [
            { content: 'you stupid brain!' },
            { ... },
            { ... },
          ]
        }
      ]
    }
    
I'm going to go straight to the meat of the problem, the answers and questions:

..But for completeness, let's say we have this template:

    <body>
      <div id="question"></div>
      {{#answers}}
        <div class="answer">
          <p>{{author}} .. {{content}}</p>
          {{#comments}}
            <p>{{content}}</p>
          {{/comments}}
        </div>
      {{/answers}}
    </body>
    
Each array index needs to be embedded into the identifier. Classes can handle one index, so we drop the last one. 
Here's the gist:

    class: answers.0.comments //answer one comments
    class: answers.1.comments //answer two comments
    class: answers.2.comments.content //....?

How do we update a given comments content?

    answers.2.comments.content[0] //content of comment 1

This immediately becomes more and more weird the further away your last array index is from the bottom of the JSON...

Consider this:

    answers.2.comments.author.lastname[1] //who's lastname? the 2nd commens author's lastname. On the 3rd answer of course.

The idea to embed all array indices works in theory, but in practice can get strange as you see.


Here's the rest of the mustache.js readme
---------------

[Mustache](http://mustache.github.com/) is a logic-less template syntax. It can
be used for HTML, config files, source code - anything. It works by expanding
tags in a template using values provided in a hash or object.

We call it "logic-less" because there are no if statements, else clauses, or for
loops. Instead there are only tags. Some tags are replaced with a value, some
nothing, and others a series of values.

For a language-agnostic overview of Mustache's template syntax, see the
`mustache(5)` [manpage](http://mustache.github.com/mustache.5.html).

## Where to use mustache.js?

You can use mustache.js to render templates in many various scenarios where you
can use JavaScript. For example, you can render templates in a browser,
server-side using [node](http://nodejs.org/), in [CouchDB](http://couchdb.apache.org/)
views, or in almost any other environment where you can use JavaScript.

## Who uses mustache.js?

An updated list of mustache.js users is kept [on the Github wiki](http://wiki.github.com/janl/mustache.js/beard-competition).
Add yourself or your company if you use mustache.js!

## Usage

Below is quick example how to use mustache.js:

    var view = {
      title: "Joe",
      calc: function () {
        return 2 + 4;
      }
    };

    var output = Mustache.render("{{title}} spends {{calc}}", view);

In this example, the `Mustache.render` function takes two parameters: 1) the
[mustache](http://mustache.github.com/) template and 2) a `view` object that
contains the data and code needed to render the template.

### CommonJS

mustache.js is usable without any modification in both browsers and [CommonJS](http://www.commonjs.org/)
environments like [node.js](http://nodejs.org/). To use it as a CommonJS module,
simply require the file, like this:

    var Mustache = require("mustache");

## Templates

A [mustache](http://mustache.github.com/) template is a string that contains
any number of mustache tags. Tags are indicated by the double mustaches that
surround them. `{{person}}` is a tag, as is `{{#person}}`. In both examples we
refer to `person` as the tag's key.

There are several types of tags available in mustache.js.

### Variables

The most basic tag type is a simple variable. A `{{name}}` tag renders the value
of the `name` key in the current context. If there is no such key, nothing is
rendered.

All variables are HTML-escaped by default. If you want to render unescaped HTML,
use the triple mustache: `{{{name}}}`. You can also use `&` to unescape a
variable.

Template:

    * {{name}}
    * {{age}}
    * {{company}}
    * {{{company}}}
    * {{&company}}

View:

    {
      "name": "Chris",
      "company": "<b>GitHub</b>"
    }

Output:

    * Chris
    *
    * &lt;b&gt;GitHub&lt;/b&gt;
    * <b>GitHub</b>
    * <b>GitHub</b>

JavaScript's dot notation may be used to access keys that are properties of
objects in a view.

Template:

    * {{name.first}} {{name.last}}
    * {{age}}

View:

    {
      "name": {
        "first": "Michael",
        "last": "Jackson"
      },
      "age": "RIP"
    }

Output:

    * Michael Jackson
    * RIP

### Sections

Sections render blocks of text one or more times, depending on the value of the
key in the current context.

A section begins with a pound and ends with a slash. That is, `{{#person}}`
begins a `person` section, while `{{/person}}` ends it. The text between the two
tags is referred to as that section's "block".

The behavior of the section is determined by the value of the key.

#### False Values or Empty Lists

If the `person` key exists and has a value of `null`, `undefined`, or `false`,
or is an empty list, the block will not be rendered.

Template:

    Shown.
    {{#person}}
    Never shown!
    {{/person}}

View:

    {
      "person": false
    }

Output:

    Shown.

#### Non-Empty Lists

If the `person` key exists and is not `null`, `undefined`, or `false`, and is
not an empty list the block will be rendered one or more times.

When the value is a list, the block is rendered once for each item in the list.
The context of the block is set to the current item in the list for each
iteration. In this way we can loop over collections.

Template:

    {{#stooges}}
    <b>{{name}}</b>
    {{/stooges}}

View:

    {
      "stooges": [
        { "name": "Moe" },
        { "name": "Larry" },
        { "name": "Curly" }
      ]
    }

Output:

    <b>Moe</b>
    <b>Larry</b>
    <b>Curly</b>

When looping over an array of strings, a `.` can be used to refer to the current
item in the list.

Template:

    {{#musketeers}}
    * {{.}}
    {{/musketeers}}

View:

    {
      "musketeers": ["Athos", "Aramis", "Porthos", "D'Artagnan"]
    }

Output:

    * Athos
    * Aramis
    * Porthos
    * D'Artagnan

If the value of a section variable is a function, it will be called in the
context of the current item in the list on each iteration.

Template:

    {{#beatles}}
    * {{name}}
    {{/beatles}}

View:

    {
      "beatles": [
        { "firstName": "John", "lastName": "Lennon" },
        { "firstName": "Paul", "lastName": "McCartney" },
        { "firstName": "George", "lastName": "Harrison" },
        { "firstName": "Ringo", "lastName": "Starr" }
      ],
      "name": function () {
        return this.firstName + " " + this.lastName;
      }
    }

Output:

    * John Lennon
    * Paul McCartney
    * George Harrison
    * Ringo Starr

#### Functions

If the value of a section key is a function, it is called with the section's
literal block of text, un-rendered, as its first argument. The second argument
is a special rendering function that uses the current view as its view argument.
It is called in the context of the current view object.

Template:

    {{#bold}}Hi {{name}}.{{/bold}}

View:

    {
      "name": "Tater",
      "bold": function () {
        return function (text, render) {
          return "<b>" + render(text) + "</b>";
        }
      }
    }

Output:

    <b>Hi Tater.</b>

### Inverted Sections

An inverted section opens with `{{^section}}` instead of `{{#section}}`. The
block of an inverted section is rendered only if the value of that section's tag
is `null`, `undefined`, `false`, or an empty list.

Template:

    {{#repos}}<b>{{name}}</b>{{/repos}}
    {{^repos}}No repos :({{/repos}}

View:

    {
      "repos": []
    }

Output:

    No repos :(

### Comments

Comments begin with a bang and are ignored. The following template:

    <h1>Today{{! ignore me }}.</h1>

Will render as follows:

    <h1>Today.</h1>

Comments may contain newlines.

### Partials

Partials begin with a greater than sign, like {{> box}}.

Partials are rendered at runtime (as opposed to compile time), so recursive
partials are possible. Just avoid infinite loops.

They also inherit the calling context. Whereas in ERB you may have this:

    <%= partial :next_more, :start => start, :size => size %>

Mustache requires only this:

    {{> next_more}}

Why? Because the `next_more.mustache` file will inherit the `size` and `start`
variables from the calling context. In this way you may want to think of
partials as includes, or template expansion, even though it's not literally true.

For example, this template and partial:

    base.mustache:
    <h2>Names</h2>
    {{#names}}
      {{> user}}
    {{/names}}

    user.mustache:
    <strong>{{name}}</strong>

Can be thought of as a single, expanded template:

    <h2>Names</h2>
    {{#names}}
      <strong>{{name}}</strong>
    {{/names}}

In mustache.js an object of partials may be passed as the third argument to
`Mustache.render`. The object should be keyed by the name of the partial, and
its value should be the partial text.

### Set Delimiter

Set Delimiter tags start with an equals sign and change the tag delimiters from
`{{` and `}}` to custom strings.

Consider the following contrived example:

    * {{ default_tags }}
    {{=<% %>=}}
    * <% erb_style_tags %>
    <%={{ }}=%>
    * {{ default_tags_again }}

Here we have a list with three items. The first item uses the default tag style,
the second uses ERB style as defined by the Set Delimiter tag, and the third
returns to the default style after yet another Set Delimiter declaration.

According to [ctemplates](http://google-ctemplate.googlecode.com/svn/trunk/doc/howto.html),
this "is useful for languages like TeX, where double-braces may occur in the
text and are awkward to use for markup."

Custom delimiters may not contain whitespace or the equals sign.

## Plugins for JavaScript Libraries

By default mustache.js may be used in any browser or [CommonJS](http://www.commonjs.org/)
environment, including [node](http://nodejs.org/). Additionally, mustache.js may
be built specifically for several different client libraries and platforms,
including the following:

  - [jQuery](http://jquery.com/)
  - [MooTools](http://mootools.net/)
  - [Dojo](http://www.dojotoolkit.org/)
  - [YUI](http://developer.yahoo.com/yui/)
  - [RequireJS](http://requirejs.org/)
  - [qooxdoo](http://qooxdoo.org/)

These may be built using [Rake](http://rake.rubyforge.org/) and one of the
following commands:

    $ rake jquery
    $ rake mootools
    $ rake dojo
    $ rake yui
    $ rake requirejs
    $ rake qooxdoo

## Testing

The mustache.js test suite uses the [vows](http://vowsjs.org/) testing
framework. In order to run the tests you'll need to install [node](http://nodejs.org/)
first. Once it's installed, you can install vows using [npm](http://npmjs.org/).

    $ npm install -g vows

Then, run the tests.

    $ vows --spec

The test suite consists of both unit and integration tests. If a template isn't
rendering correctly for you, you can make a test for it by doing the following:

  1. Create a template file named `mytest.mustache` in the `test/_files`
     directory. Replace `mytest` with the name of your test.
  2. Create a corresponding view file named `mytest.js` in the same directory.
     This file should contain a JavaScript object literal enclosed in
     parentheses. See any of the other view files for an example.
  3. Create a file with the expected output in `mytest.txt` in the same
     directory.

Then, you can run the test with:

    $ TEST=mytest vows test/render_test.js

## Thanks

Mustache.js wouldn't kick ass if it weren't for these fine souls:

  * Chris Wanstrath / defunkt
  * Alexander Lang / langalex
  * Sebastian Cohnen / tisba
  * J Chris Anderson / jchris
  * Tom Robinson / tlrobinson
  * Aaron Quint / quirkey
  * Douglas Crockford
  * Nikita Vasilyev / NV
  * Elise Wood / glytch
  * Damien Mathieu / dmathieu
  * Jakub Kuźma / qoobaa
  * Will Leinweber / will
  * dpree
  * Jason Smith / jhs
  * Aaron Gibralter / agibralter
  * Ross Boucher / boucher
  * Matt Sanford / mzsanford
  * Ben Cherry / bcherry
  * Michael Jackson / mjijackson

## License

The MIT License

Copyright (c) 2012 Devin Rhode (Mustachia.js modification)

Forked from these guys:
Copyright (c) 2009 Chris Wanstrath (Ruby)
Copyright (c) 2010 Jan Lehnardt (JavaScript)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
 
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
