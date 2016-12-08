

var SIDEBAR_HTML_LOCATION = null;
try {
    SIDEBAR_HTML_LOCATION = chrome.extension.getURL('sidebar/app/assets/contents/sidebar.html');
} catch (e){
    console.log('sidebar in default location');
}

var Page = function (head, body) {
    this.head = head;
    this.body = body;
};

var canLoadPageToInject = false;
var resource = null;
try {
    $.when(
        $.get(chrome.extension.getURL('sidebar_injector.json'), function (data) {
            resource = JSON.parse(data).web_resource;
        }).then(function () {
            canLoadPageToInject = true;
        })
    );
} catch(e){
    canLoadPageToInject = true;
    console.log('can\'t load sidebar_injector web resource');
}

/**
 * TODO rendere richiesta asincrona
 * @returns {Page}
 */
function loadPageToInject() {
    var page = null;
    while (!canLoadPageToInject) {} //aspetto che la risorsa sia stata caricata
    if (resource != null) {
        var result;
        try {
            result = $.ajax({
                url: chrome.extension.getURL(resource),
                type: 'GET',
                async: false,
                cache: false,
                timeout: 30000,
                error: function(){
                    return false;
                },
                success: function(pageData){
                    page = new Page("","");
                    page.head = /<head.*?>([\s\S]*)<\/head>/.exec(pageData)[1];
                    page.body = /<body.*?>([\s\S]*)<\/body>/.exec(pageData)[1];
                    return true;
                }
            });
        } catch (e) {
            console.log('can\'t get or post page web resource');
        }
        return new Page(/<head.*?>([\s\S]*)<\/head>/.exec(result.responseText)[1],
            /<body.*?>([\s\S]*)<\/body>/.exec(result.responseText)[1]);
    }
    return new Page("","<h1>Nothing to show</h1>");
}