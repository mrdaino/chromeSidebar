

var SIDEBAR_HTML_LOCATION = null;
var outSidebarLocation = chrome.extension.getURL('sidebar/app/assets/contents/sidebar.html');
var locationResult = $.ajax({
    url: outSidebarLocation,
    type: 'GET',
    async: false,
    cache: false,
    timeout: 30000,
    error: function(){
        return false;
    },
    success: function(){
        return true;
    }
});
if(locationResult.status==200){
    SIDEBAR_HTML_LOCATION = outSidebarLocation;
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
        var result = $.ajax({
            url: chrome.extension.getURL(resource),
            type: 'POST',
            async: false,
            cache: false,
            timeout: 30000,
            data: JSON.stringify(sidebarOptions),
            contentType: "application/json; charset=utf-8",
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
        if(result.status==200) {
            return new Page(/<head.*?>([\s\S]*)<\/head>/.exec(result.responseText)[1],
                /<body.*?>([\s\S]*)<\/body>/.exec(result.responseText)[1]);
        }
    }
    return new Page("","<div>Nothing to show</div>");
}