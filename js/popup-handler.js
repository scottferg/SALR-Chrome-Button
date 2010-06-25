// Copyright (c) 2009, Scott Ferguson
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the software nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY SCOTT FERGUSON ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL SCOTT FERGUSON BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Fetch extension settings
var parentExtensionId = 'lbeflkohppahphcnpjfgffckhcmgelfo';
var settings = {};
var port = chrome.extension.connect(parentExtensionId);

port.onMessage.addListener(function(data) {
    settings = data;

    console.log(settings);
    
    populateMenu();    
});

port.postMessage({
    'message': 'GetForumsJumpList'
});

/**
 * Opens a link in a tab. 
 */
function openTab(tabUrl) {
    var button = event.button;
    if(button > 1)
        return;
    var selected = true;
    if(button == 1 || event.ctrlKey) // Middle Button or Ctrl click
        selected = false;
    chrome.tabs.create({ url: tabUrl, selected: selected });
}

/**
 * Populate the menu with forums.
 */
function populateMenu() {
    var forums = JSON.parse(settings.forumsList);
    var newHTML = '';
    var numSeps = 0;
    var color = '#ffffff';
    
    jQuery(forums).each( function() {
        var splitUp = this.name.match(/^(-*)(.*)/);
        
        var indent = splitUp[1].length;
        var title = splitUp[2];
        
        if (indent > 10) { // Separator
            if (numSeps > 0) {
                newHTML += '<hr/>';
            }
            numSeps ++;
        } else if (indent == 0) {
            newHTML += '<div class="header-link">';
            newHTML += '<a onclick="javascript:openTab(\'http://forums.somethingawful.com/forumdisplay.php?forumid=' + this.id + '\')" href="javascript:" class="link link'+ indent +'">' + title + '</a><br/>';
            newHTML += '</div>';
        
        } else {
            // Dynamically set the 10's digit for padding here, since we can have any number
            // of indentations
            newHTML += '<div class="forum-link" style="padding-left: ' + indent + '0px; background: ' + color + ';">';
            newHTML += '<a onclick="javascript:openTab(\'http://forums.somethingawful.com/forumdisplay.php?forumid=' + this.id + '\')" href="javascript:">' + title + '</a><br/>';
            newHTML += '</div>';
        }

        if (color == '#ffffff') {
            color = '#eeeeee';
        } else {
            color = '#ffffff';
        }
    });
    
    jQuery('div#forums-list').html(newHTML);
}
