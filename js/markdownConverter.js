// Markdown preview (with highlighter.js)
function convertToMarkdown()
{

    var text = $('#sourceTA').val(),
    target = $('#targetDiv'),

    converter = new showdown.Converter(),
    html = converter.makeHtml(text);


    target.html(html);
    // target.innerHTML = html;

    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
}

// clears editor
function clearText()
{
    $('#sourceTA').val('');
    $('#targetDiv').html('');
}

function takeMeHome()
{
    window.location.assign('index.html');
}