/**
 * Created by Lorenzo Daneo.
 * mail to lorenzo.daneo@coolsholp.it
 */

/**@type {FrameOptions}*/
var frameOptions;

chrome.runtime.onMessage.addListener(handleExtensionMessage);
addEventListener('message', handleFrameMessage, false);

var sidebarInitTimeout;

function handleExtensionMessage(message, sender, sendResponse) {
    switch (message.type) {
        case 'add_frame':
            frameOptions = message.content;
            if ($('[src="' + frameOptions.url + '"]').length == 0) {
                var frame = document.createElement('iframe');
                frame.id = frameOptions.id;
                frame.src = encodeURI(frameOptions.url);
                document.body.appendChild(frame);
                message.status = 'frame_added';
            } else {
                message.status = 'frame_already_added';
            }
            message.pageBody = document.body.outerHTML;
            message.pageUrl = window.location.href;
            sendResponse(message);
            break;
        case 'sidebar_control':
            postFrameMessage(message);
            message.status = 'sidebar_control_send';
            sendResponse(message);
            break;
        default:
            sendResponse({
                status: 'no_case_found'
            });
            break;
    }
}

function handleFrameMessage(message) {
    if (message.data.type === 'sidebar_control') {
        if (sidebarInitTimeout) {
            clearTimeout(sidebarInitTimeout);
            sidebarInitTimeout = null;
        }
        if(message.data.content.mouse===SIDEBAR_MOUSE_ON){
            mouseon();
        } else {
            mouseout(message.data.content);
        }
        postChange(message.data);
    }
}

function postFrameMessage(message) {
    var frame = document.getElementById(frameOptions.id).contentWindow;
    if (message.content && message.content.action === SIDEBAR_ACTION_INIT) {
        var initSidebar = function () {
            mouseout(message.content);
            if (message.content.action === SIDEBAR_ACTION_INIT) {
                message.content.parentHeight = windowHeight(window);
                message.content.parentWidth = windowWidth(window);
                try {
                    frame.postMessage(message, frameOptions.origin);
                } catch(e) {
                    sidebarInitTimeout = setTimeout(initSidebar, 100);
                }
            }
        };
        sidebarInitTimeout = setTimeout(initSidebar, 100);
    } else {
        frame.postMessage(message, frameOptions.origin);
    }
}

function postChange(message) {
    chrome.runtime.sendMessage(message,
        function (response) {
            if (response) {
                console.log(response.status);
            }
        }
    );
}

function mouseon() {
    var $frame = $('#' + frameOptions.id);
    $frame.css({
        'bottom': '0',
        'right': '0',
        'top': '',
        'width': '100%',
        'height': '100%',
        '-webkit-transition': 'height 0s, width 0s',
        'transition': 'height 0s, width 0s'
    });
    resetFrameTransition($frame)
}

function mouseout(sidebarOptions) {
    var $frame = $('#' + frameOptions.id);
    var useFrameTransition;
    if (sidebarOptions.position == SIDEBAR_POSITION_BOTTOM) {
        useFrameTransition = parseInt($frame.css('height'))<sidebarOptions.height;
    } else if (sidebarOptions.position == SIDEBAR_POSITION_RIGHT) {
        useFrameTransition = parseInt($frame.css('width'))<sidebarOptions.width;
    }
    if(useFrameTransition) {
        $frame.css({
            '-webkit-transition': 'height 0s, width 0s',
            'transition': 'height 0s, width 0s'
        });
    }
    if (sidebarOptions.position == SIDEBAR_POSITION_BOTTOM) {
        var newHeight = sidebarOptions.height + 23;
        $frame.css({
            'bottom': '0',
            'right': '0',
            'top': '',
            'width': '100%'
        });
        if(sidebarOptions.open){
            $frame.css({
                'height': newHeight+'px'
            });
        } else {
            $frame.css({
                'height': '0'
            });
        }
    } else if (sidebarOptions.position == SIDEBAR_POSITION_RIGHT) {
        var newWidth = sidebarOptions.width + 23;
        $frame.css({
            'bottom': '0',
            'right': '0',
            'top': '',
            'height': '100%'
        });
        if(sidebarOptions.open){
            $frame.css({
                'width': newWidth+'px'
            });
        } else {
            $frame.css({
                'width': '0'
            });
        }
    }
    if(useFrameTransition){
        resetFrameTransition($frame);
    }
}

function resetFrameTransition($frame){
    setTimeout(function () {
        $frame.css({
            '-webkit-transition': 'height 0.5s, width 0.5s',
            'transition': 'height 0.5s, width 0.5s'
        });
    },500);
}