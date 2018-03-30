var rendererMD = new marked.Renderer()
    marked.setOptions({
        renderer: rendererMD,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: true
})

var editor = ace.edit('markdown-edit')
editor.setTheme('ace/theme/twilight')
editor.getSession().setMode('ace/mode/markdown')
editor.renderer.setShowPrintMargin(false)
$("#markdown-edit").keyup(function() {
    $("#markdown-content").html(marked(editor.getValue()))
})
