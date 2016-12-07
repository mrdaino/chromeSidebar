// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var frameOptions = new FrameOptions('frame-sidebar',
    chrome.extension.getURL('app/assets/contents/sidebar.html'),
    chrome.extension.getURL(''));

var sidebarOptions = new SidebarOptions();

var currentPageBody;
var currentPageUrl;
var currentTabId;

//noinspection JSCheckFunctionSignatures
chrome.browserAction.onClicked.addListener(function (tab) {
    sendSidebarMessage(tab.id);
});

// noinspection JSCheckFunctionSignatures
// chrome.tabs.onCreated.addListener(function (tab) {
//     createSidebarFrame(tabId, function () {
//         sidebarOptions.action = SIDEBAR_ACTION_INIT;
//         sendSidebarMessage(tabId);
//     });
// });

//noinspection JSCheckFunctionSignatures
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        currentTabId = tabId;
        createSidebarFrame(tabId);
    }
});

function createSidebarFrame(tabId) {
    chrome.tabs.sendMessage(tabId,
        new Message('add_frame', frameOptions, MESSAGE_WAITING_RESPONSE),
        function (response) {
            if (response) {
                console.log(response.status);
                if(response.pageBody)
                    currentPageBody = $(response.pageBody);
                if(response.pageUrl)
                    currentPageUrl = response.pageUrl;
                sidebarOptions.action = SIDEBAR_ACTION_INIT;
                sendSidebarMessage(tabId);
            }
        }
    );
}

function sendSidebarMessage(tabId) {
    chrome.tabs.sendMessage(tabId,
        new Message('sidebar_control', sidebarOptions, MESSAGE_WAITING_RESPONSE),
        function (response) {
            if (response) {
                sidebarOptions = response.content;
            }
        }
    );
}


// //noinspection JSCheckFunctionSignatures
// chrome.tabs.onActivated.addListener(function (activeInfo) {
//     currentTabId = activeInfo.tabId;
// });

// noinspection JSCheckFunctionSignatures
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    if(message.type==='sidebar_control') {
        sidebarOptions = message.content;
        message.status = 'options_updated';
        sendResponse(message);
    }
});

// function getPageDocument(tabId,send){
//     chrome.tabs.sendMessage(tabId, new Message('get_document', sidebarOptions),
//         function (response) {
//             if (response) {
//                 send(response.document);
//             }
//         }
//     );
// }

// function updateTabsIds(tabId) {
//     for(var i=0;i<tabsIds.length;i++) {
//         if (tabsIds[i]==tabId){
//             tabsIds.push(tabId);
//             break;
//         }
//     }
// }

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