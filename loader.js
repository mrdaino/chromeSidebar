

var SIDEBAR_HTML_LOCATION = null;
try {
    SIDEBAR_HTML_LOCATION = chrome.extension.getURL('sidebar/app/assets/contents/sidebar.html');
} catch (e){
    console.log('sidebar in default location');
}