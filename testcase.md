# Hello World!
This is a test

## Live Preview
Having a live preview is a ultra powerful thing in reddit, to make sure that everything will work the way it was inteneded

## Code Preview
Since we are also using highlighter.js, we can implement different code. For example:

```javascript
function convertToMarkdown()
{

    var text = $('#sourceTA').val(),
    target = $('#targetDiv'),
    target = document.getElementById('targetDiv'),

    converter = new showdown.Converter(),
    html = converter.makeHtml(text);

    target.innerHTML = html;

    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
}
```