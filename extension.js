// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var frameOptions;

if(SIDEBAR_HTML_LOCATION) {
    frameOptions = new FrameOptions('frame-sidebar',
        SIDEBAR_HTML_LOCATION,
        chrome.extension.getURL(''));
} else {
    frameOptions = new FrameOptions('frame-sidebar',
        chrome.extension.getURL('app/assets/contents/sidebar.html'),
        chrome.extension.getURL(''));
}

var isOldTab = false;
var sidebarOptions = new SidebarOptions();

var currentPageBody;
var currentPageUrl;

//noinspection JSCheckFunctionSignatures
chrome.browserAction.onClicked.addListener(function (tab) {
    sendSidebarMessage(tab.id);
});

//noinspection JSCheckFunctionSignatures
chrome.tabs.onCreated.addListener(function (tab) {
    isOldTab = true;
});

//noinspection JSCheckFunctionSignatures
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        createSidebarFrame(tabId,!isOldTab);
        isOldTab = false;
    }
});

//noinspection JSCheckFunctionSignatures
chrome.tabs.onActivated.addListener(function (activeInfo) {
    sendSidebarMessage(activeInfo.tabId,true);
});

function createSidebarFrame(tabId,openOnInit) {
    chrome.tabs.sendMessage(tabId,
        new Message('add_frame', frameOptions, MESSAGE_WAITING_RESPONSE),
        function (response) {
            if (response) {
                console.log(response.status);
                if(response.pageBody)
                    currentPageBody = $(response.pageBody);
                if(response.pageUrl)
                    currentPageUrl = response.pageUrl;
                sidebarOptions.openOnInit = openOnInit;
                sidebarOptions.action = SIDEBAR_ACTION_INIT;
                sendSidebarMessage(tabId);
            }
        }
    );
}

function sendSidebarMessage(tabId,notSendSidebarOptions) {
    var messageContent = sidebarOptions;
    if(notSendSidebarOptions)
        messageContent = null;
    chrome.tabs.sendMessage(tabId,
        new Message('sidebar_control', messageContent, MESSAGE_WAITING_RESPONSE),
        function (response) {
            if (response) {
                sidebarOptions = response.content;
            }
        }
    );
}

// noinspection JSCheckFunctionSignatures
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    if(message.type==='sidebar_control') {
        sidebarOptions = message.content;
        message.status = 'options_updated';
        sendResponse(message);
    }
});

// function getCurrentTab(callback) {
//     var queryInfo = {
//         currentWindow: true
//     };
//     chrome.tabs.query(queryInfo, function (tabs) {
//         var tab;
//         for (var i in tabs) {
//             if (tabs[i].active) {
//                 tab = tabs[i];
//                 break;
//             }
//         }
//         callback(tab);
//     });
// }