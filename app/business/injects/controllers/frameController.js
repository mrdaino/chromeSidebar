/**
 * Created by Lorenzo Daneo.
 * mail to lorenzo.daneo@coolsholp.it
 */

var sidebarController,
    lastMessageEvent;

addEventListener('message', handleTabMessage, false);

function handleTabMessage(messageEvent) {
    lastMessageEvent = messageEvent;
    switch (messageEvent.data.type){
        case 'sidebar_control':
            if(messageEvent.data.content) {
                if (!sidebarController)
                    sidebarController = new SidebarController(messageEvent.data.content, postChange);
                else
                    sidebarController.sidebarOptions = messageEvent.data.content;
                sidebarController.doAction();
            }
            postChange(sidebarController.sidebarOptions);
            break;
    }
}

function postChange(sidebarOptions) {
    lastMessageEvent.data.content = sidebarOptions;
    lastMessageEvent.data.status = 'post_frame_change';
    lastMessageEvent.source.postMessage(lastMessageEvent.data,lastMessageEvent.origin);
}