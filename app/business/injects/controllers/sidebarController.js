/**
 * Created by Lorenzo Daneo.
 * mail to lorenzo.daneo@coolsholp.it
 */

var SidebarController = function (sidebarOptions,postChange) {

    var self = this;
    self.sidebarOptions = sidebarOptions;

    var sidebarWrapperId = 'sidebar-wrapper';

    var resizerId = 'sidebar-resizer';
    var resizerProId = 'sidebar-resizer-pro';

    var beforeCollapseHeight = SIDEBAR_INIT_HEIGHT;
    var beforeCollapseWidth = SIDEBAR_INIT_WIDTH;

    var sidebar;

    this.doAction = function () {
        console.log('action ', self.sidebarOptions.action);
        switch (self.sidebarOptions.action) {
            case SIDEBAR_ACTION_INIT:
                initSidebar();
                break;
            case SIDEBAR_ACTION_OPEN:
                side();
                break;
            case SIDEBAR_ACTION_CLOSE:
                side();
                break;
        }
    };

    var initSidebar = function () {
        sidebar = document.getElementById(sidebarWrapperId);
        initPosition();
        initResizer();
        initButtons();
        initMouseEvent();
        restoreCollapseSidebarButtonRotation();
        restoreStatus();
        self.sidebarOptions.inited = true;
    };

    var initPosition = function(){
        $('#'+sidebarWrapperId).addClass(self.sidebarOptions.position);
        if(self.sidebarOptions.position==SIDEBAR_POSITION_BOTTOM)
            putSettingsDropdownUp();
    };

    var initMouseEvent = function(){
        var mouseon = function () {
            $('#'+sidebarWrapperId)
                .on('mouseleave.sidebar',mouseoff)
                .off('mouseenter.sidebar');
            self.sidebarOptions.mouse = SIDEBAR_MOUSE_ON;
            postChange(self.sidebarOptions);
            self.sidebarOptions.mouse = null;
        };

        var mouseoff = function () {
            closeDropdown();
            $('#'+sidebarWrapperId)
                .on('mouseenter.sidebar',mouseon)
                .off('mouseleave.sidebar');
            self.sidebarOptions.mouse = SIDEBAR_MOUSE_OFF;
            postChange(self.sidebarOptions);
            self.sidebarOptions.mouse = null;
        };

        $('#'+sidebarWrapperId).on('mouseenter.sidebar',mouseon);
    };

    var initButtons = function(){
        $('#'+sidebarWrapperId+' [data-toggle="tooltip"]').tooltip({
            placement: function (tip,el) {
                if(!$(el).parent().hasClass('dropdown-item')){
                    if(self.sidebarOptions.position==SIDEBAR_POSITION_BOTTOM) {
                        return 'top';
                    } else if(self.sidebarOptions.position==SIDEBAR_POSITION_RIGHT){
                        return 'left';
                    }
                } else {
                    return 'top';
                }
            }
        }).on('click',function () {
            $(this).tooltip('hide');
        });
        $(sidebar).on('click.close', '#close-sidebar', function () {
            side();
            self.sidebarOptions.mouse = SIDEBAR_MOUSE_ON;
            postChange(self.sidebarOptions);
            self.sidebarOptions.mouse = null;
        });
        $(sidebar).on('click.collapse', '#collapse-sidebar', function () {
            var isToOpen = false;
            if(self.sidebarOptions.position==SIDEBAR_POSITION_BOTTOM) {
                if(self.sidebarOptions.height>SIDEBAR_MIN_HEIGHT){
                    $('#'+resizerId).css({'display': 'none'});
                    beforeCollapseHeight = self.sidebarOptions.height;
                    $(sidebar).css({'height': SIDEBAR_MIN_HEIGHT+'px'});
                    self.sidebarOptions.height = SIDEBAR_MIN_HEIGHT;
                    $(this).find('.rotateble').css({'-webkit-transform': 'rotate(180deg)'});
                } else {
                    $('#'+resizerId).css({'display': 'block'});
                    self.sidebarOptions.height = beforeCollapseHeight;
                    $(sidebar).css({'height': self.sidebarOptions.height+'px'});
                    $(this).find('.rotateble').css({'-webkit-transform': 'rotate(0deg)'});
                    isToOpen = true;
                }
            } else if(self.sidebarOptions.position==SIDEBAR_POSITION_RIGHT){
                if(self.sidebarOptions.width>SIDEBAR_MIN_WIDTH){
                    $('#'+resizerId).css({'display': 'none'});
                    beforeCollapseWidth = self.sidebarOptions.width;
                    $(sidebar).css({'width': SIDEBAR_MIN_WIDTH+'px'});
                    self.sidebarOptions.width = SIDEBAR_MIN_WIDTH;
                    $(this).find('.rotateble').css({'-webkit-transform': 'rotate(90deg)'});
                } else {
                    $('#'+resizerId).css({'display': 'block'});
                    self.sidebarOptions.width = beforeCollapseWidth;
                    $(sidebar).css({'width': self.sidebarOptions.width+'px'});
                    $(this).find('.rotateble').css({'-webkit-transform': 'rotate(-90deg)'});
                    isToOpen = true;
                }
            }
            if(isToOpen)
                self.sidebarOptions.mouse = SIDEBAR_MOUSE_ON;
            postChange(self.sidebarOptions);
            self.sidebarOptions.mouse = null;
        });
        $(sidebar).on('click.dock.right', '#right-sidebar-button', function () {
            if(self.sidebarOptions.position!=SIDEBAR_POSITION_RIGHT) {
                self.sidebarOptions.position = SIDEBAR_POSITION_RIGHT;
                self.sidebarOptions.width = self.sidebarOptions.height;
                if(self.sidebarOptions.height==SIDEBAR_MIN_HEIGHT)
                    self.sidebarOptions.width = SIDEBAR_MIN_WIDTH;
                self.sidebarOptions.height = 0;
                restoreWidth();
                $(sidebar)
                    .removeClass(SIDEBAR_POSITION_BOTTOM)
                    .addClass(SIDEBAR_POSITION_RIGHT)
                    .css({
                        'height': '',
                        'width': self.sidebarOptions.width + 'px'
                    });
                restoreCollapseSidebarButtonRotation();
                putSettingsDropupDown();
            }
            self.sidebarOptions.mouse = SIDEBAR_MOUSE_ON;
            postChange(self.sidebarOptions);
            self.sidebarOptions.mouse = null;
        });
        $(sidebar).on('click.dock.bottom', '#bottom-sidebar-button', function () {
            if(self.sidebarOptions.position!=SIDEBAR_POSITION_BOTTOM) {
                self.sidebarOptions.position = SIDEBAR_POSITION_BOTTOM;
                self.sidebarOptions.height = self.sidebarOptions.width;
                if(self.sidebarOptions.width==SIDEBAR_MIN_WIDTH)
                    self.sidebarOptions.height = SIDEBAR_MIN_HEIGHT;
                self.sidebarOptions.width = 0;
                restoreHeihgt();
                $(sidebar)
                    .removeClass(SIDEBAR_POSITION_RIGHT)
                    .addClass(SIDEBAR_POSITION_BOTTOM)
                    .css({
                        'width': '',
                        'height': self.sidebarOptions.height + 'px'
                    });
                restoreCollapseSidebarButtonRotation();
                putSettingsDropdownUp();
            }
            self.sidebarOptions.mouse = SIDEBAR_MOUSE_ON;
            postChange(self.sidebarOptions);
            self.sidebarOptions.mouse = null;
        });
    };

    var initResizer = function () {
        var resizerPro = document.createElement('div');
        resizerPro.id = resizerProId;
        if((self.sidebarOptions.position==SIDEBAR_POSITION_BOTTOM
            && self.sidebarOptions.height==SIDEBAR_MIN_HEIGHT)
            || (self.sidebarOptions.position==SIDEBAR_POSITION_RIGHT
            && self.sidebarOptions.width==SIDEBAR_MIN_WIDTH)) {

            $('#'+resizerId).css({'display': 'none'});
        }
        $('body')
            .on('mousedown', '#' + resizerId, function () {
                $('#' + sidebarWrapperId)
                    .append($(resizerPro))
                    .css({
                        '-webkit-transition': 'height 0s, width 0s',
                        'transition': 'height 0s, width 0s'
                    });
                $('body').on('mousemove.resize', function (event) {
                    if(self.sidebarOptions.position==SIDEBAR_POSITION_BOTTOM) {
                        var height = sidebarOptions.parentHeight - event.clientY;
                        if(height>=SIDEBAR_MIN_HEIGHT) {
                            self.sidebarOptions.height = height;
                            $('body').css({
                                'cursor': 'ns-resize',
                                '-webkit-user-select': 'none'
                            });
                            $('#' + sidebarWrapperId).css({
                                'height': height + 'px'
                            });
                        }
                    } else if(self.sidebarOptions.position==SIDEBAR_POSITION_RIGHT){
                        var width = sidebarOptions.parentWidth - event.clientX;
                        if(width>=SIDEBAR_MIN_WIDTH) {
                            self.sidebarOptions.width = width;
                            $('body').css({
                                'cursor': 'ew-resize',
                                '-webkit-user-select': 'none'
                            });
                            $('#' + sidebarWrapperId).css({
                                'width': width + 'px'
                            });
                        }
                    }
                    self.sidebarOptions.mouse = SIDEBAR_MOUSE_ON;
                    postChange(self.sidebarOptions);
                    self.sidebarOptions.mouse = null;
                });
            })
            .on('mouseup', function () {
                $('body')
                    .off('mousemove.resize')
                    .css({
                        'cursor': '',
                        '-webkit-user-select': ''
                    });
                $('#' + sidebarWrapperId).css({
                    '-webkit-transition': 'height 0.5s, width 0.5s',
                    'transition': 'height 0.5s, width 0.5s'
                });
                $(resizerPro).remove();
            });
    };

    var restoreStatus = function () {
        console.log('restore ', self.sidebarOptions.open);
        if(self.sidebarOptions.openOnInit) {
            self.sidebarOptions.openOnInit = false;
            if (self.sidebarOptions.open) {
                self.sidebarOptions.action = SIDEBAR_ACTION_CLOSE;
                show();
            } else {
                self.sidebarOptions.action = SIDEBAR_ACTION_OPEN;
                hide();
            }
        } else {
            self.sidebarOptions.open = false;
            self.sidebarOptions.action = SIDEBAR_ACTION_OPEN;
            hide();
        }
    };

    var side = function () {
        console.log('side ', self.sidebarOptions.open);
        if (self.sidebarOptions.open) {
            self.sidebarOptions.open = false;
            self.sidebarOptions.action = SIDEBAR_ACTION_OPEN;
            hide();
        } else {
            self.sidebarOptions.open = true;
            self.sidebarOptions.action = SIDEBAR_ACTION_CLOSE;
            show();
        }
    };

    var show = function () {
        var $sidebarWrapper = $('#' + sidebarWrapperId);
        if(self.sidebarOptions.position==SIDEBAR_POSITION_BOTTOM) {
            restoreHeihgt();
            $sidebarWrapper.css({'height': self.sidebarOptions.height + 'px'});
        } else if(self.sidebarOptions.position==SIDEBAR_POSITION_RIGHT){
            restoreWidth();
            $sidebarWrapper.css({'width': self.sidebarOptions.width + 'px'});
        }
        $sidebarWrapper.css({'overflow': ''});
        console.log('show');
    };

    var hide = function () {
        var $sidebarWrapper = $('#' + sidebarWrapperId);
        if(self.sidebarOptions.position==SIDEBAR_POSITION_BOTTOM) {
            $sidebarWrapper.css({'height': ''});
        } else if(self.sidebarOptions.position==SIDEBAR_POSITION_RIGHT){
            $sidebarWrapper.css({'width': ''});
        }
        $sidebarWrapper.css({'overflow': 'hidden'});
        console.log('hide');
    };

    var restoreHeihgt = function () {
        if(self.sidebarOptions.height>=sidebarOptions.parentHeight)
            self.sidebarOptions.height = sidebarOptions.parentHeight - 30;
    };

    var restoreWidth = function () {
        if(self.sidebarOptions.width>=sidebarOptions.parentWidth)
            self.sidebarOptions.width = sidebarOptions.parentWidth -30;
    };

    var restoreCollapseSidebarButtonRotation = function () {
        if(self.sidebarOptions.position==SIDEBAR_POSITION_BOTTOM) {
            if (self.sidebarOptions.height > SIDEBAR_MIN_HEIGHT) {
                $('#collapse-sidebar').find('.rotateble').css({'-webkit-transform': 'rotate(0deg)'});
            } else {
                $('#collapse-sidebar').find('.rotateble').css({'-webkit-transform': 'rotate(180deg)'});
            }
        } else if(self.sidebarOptions.position==SIDEBAR_POSITION_RIGHT){
            if(self.sidebarOptions.width>SIDEBAR_MIN_WIDTH){
                $('#collapse-sidebar').find('.rotateble').css({'-webkit-transform': 'rotate(-90deg)'});
            } else {
                $('#collapse-sidebar').find('.rotateble').css({'-webkit-transform': 'rotate(90deg)'});
            }
        }
    };

    var putSettingsDropdownUp = function () {
        $('#settings-sidebar-wrapper')
            .removeClass('dropdown')
            .addClass('dropup');
    };

    var putSettingsDropupDown = function () {
        $('#settings-sidebar-wrapper')
            .removeClass('dropup')
            .addClass('dropdown');
    };

    // var putFirstMenuTooltipUpToLeft = function(){
    //     $('#menu-wrapper')
    //         .find('div > .menu-button[data-toggle="tooltip"]')
    //         .attr('data-placement','left');
    // };
    //
    // var putFirstMenuTooltipLeftToUp = function(){
    //     $('#menu-wrapper')
    //         .find('div > .menu-button[data-toggle="tooltip"]')
    //         .attr('data-placement','top');
    // };

    function closeDropdown() {
        var dropdowns = $('.dropdown-toggle');
        for(var i=0;i<dropdowns.length;i++){
            var $dropdown = $(dropdowns[i]);
            if($dropdown.parent() && $(dropdowns[i]).parent().hasClass('open')){
                $dropdown.dropdown('toggle');
            }
        }
    }

};