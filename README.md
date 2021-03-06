Smarty4Js (Smarty For Javascript)
======================================

## what?

- Javascript template engine
- Support smarty template grammar
- Used in nodejs
- Simple and powerful way to creat and render a template

## why?

- Powerful
- Don't want to have two or more template in your project.
- Deep love smarty

## when?

- When your Synchronous template is Smarty ,and your ajax template will use the same template.
- When you want to write smarty template with JavaScript anywhere.
- When you want to put a lot of logic in JavaScript template
- When you like smarty very much
    
## how?

- single
- with grunt
- with gulp
- with edp
- with all nodejs web subject


### useage

#### install
```bash
    [sudo] npm install -g smarty4Js [not publish yet, you can `git clone + npm link` now]
```

#### grammar
```
    most like smarty template grammar
```

#### command line
 ```bash
    smarty4Js a.tpl [a.json] [asset_dir] [-o]
``` 

- if have json data, return html(`demo.tpl.html`), if no json data, return jsTpl(`demo.tpl.js`)
- jsTpl is closure, hava a `render` method, you can use it like

```javascript
    
    // amd and cmd
    var template = require('demo.tpl');
    template.render(data);

    // also could by <script>

```

#### used in nodejs
```javascript
    // get Smarty class
    var Smarty = require('smarty4Js');

    // create a smarty object
    var s = new Smarty();

    // get compiler
    var compiler = s.compile(tpl);

    // get ast
    var ast = s.ast;

    // get js code
    var js = compiler.getJsTpl();

    // render smarty with data (3 methods)
    var html = compiler.render(data);
    var html = s.render(tpl, data);
    var html = (new Function('return ' + js)()).render(data);
```

