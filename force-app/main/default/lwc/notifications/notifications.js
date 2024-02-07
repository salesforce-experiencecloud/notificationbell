/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track, wire } from 'lwc';

// Client-side store for notifications
import * as notificationsStore from "c/notificationsStore";

// Streaming API support
import * as empApi from "lightning/empApi";

// Navigation support
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { getPageReferenceObject } from "c/notificationsNavigation";

import isGuest from '@salesforce/user/isGuest';


import getNotifications from '@salesforce/apex/NotificationsTrayController.getNotifications';
import markNotificationsSeen from '@salesforce/apex/NotificationsTrayController.markNotificationsSeen';
import markNotificationsRead from '@salesforce/apex/NotificationsTrayController.markNotificationsRead';
import getOlderNotifications from '@salesforce/apex/NotificationsTrayController.getOlderNotifications';
import markNotificationReadUnread from '@salesforce/apex/NotificationsTrayController.markNotificationReadUnread';
import getObjectAPINameByRecordId from '@salesforce/apex/NotificationsTrayController.getObjectAPINameByRecordId';



const PREVIEW_NOTIFICATIONS_DISABLED = 'Notifications preview disabled.';
const UNSUPPORTED_COMMUNITIES_NAVIGATION_TARGET = 'Unsupported navigation target.';

const NOTIFICATIONS_CHANNEL = "/s/notifications/notification";
const READ_STATE_CHANNEL = "/s/notifications/readstate";

const MARGIN = {
    center: "auto",
    left: "auto auto auto 0",
    right: "auto 0 auto auto",
};

const dummyData = '[{"url":"/connect/notifications/47561173624dc73424bea994a6147167","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":false,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-23T17:52:35.782Z","image":"/img/notificationsEmail/custom_notification.png","id":"47561173624dc73424bea994a6147167","count":1,"communityId":"all"},{"url":"/connect/notifications/ebcf16271f9d0229ad094804cb575073","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":false,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-23T17:43:55.454Z","image":"/img/notificationsEmail/custom_notification.png","id":"ebcf16271f9d0229ad094804cb575073","count":1,"communityId":"all"},{"url":"/connect/notifications/36567939ba392f50f09311fb9a9672ff","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":false,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-23T17:41:23.302Z","image":"/img/notificationsEmail/custom_notification.png","id":"36567939ba392f50f09311fb9a9672ff","count":1,"communityId":"all"},{"url":"/connect/notifications/53e26dabcd0ebce13e56b361299c10e8","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":true,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-23T17:34:50.710Z","image":"/img/notificationsEmail/custom_notification.png","id":"53e26dabcd0ebce13e56b361299c10e8","count":1,"communityId":"all"},{"url":"/connect/notifications/ec066bd7b235d45c8578112af3caa46d","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":true,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-23T17:32:34.721Z","image":"/img/notificationsEmail/custom_notification.png","id":"ec066bd7b235d45c8578112af3caa46d","count":1,"communityId":"all"},{"url":"/connect/notifications/b5fc6cfb8efbf8c0ce21aeaf45f7536","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":true,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-22T20:04:02.166Z","image":"/img/notificationsEmail/custom_notification.png","id":"b5fc6cfb8efbf8c0ce21aeaf45f7536","count":1,"communityId":"all"},{"url":"/connect/notifications/bfa08d321b7311df2096f8e9e375f73b","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":true,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-22T19:36:57.513Z","image":"/img/notificationsEmail/custom_notification.png","id":"bfa08d321b7311df2096f8e9e375f73b","count":1,"communityId":"all"},{"url":"/connect/notifications/dfc70a252df2bca598e2b83d18e1a31d","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":true,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-22T19:09:28.298Z","image":"/img/notificationsEmail/custom_notification.png","id":"dfc70a252df2bca598e2b83d18e1a31d","count":1,"communityId":"all"}]';

export default class Notifications extends NavigationMixin(LightningElement) {
    isPanelVisible = false;
    @track _notifications = [];
    @track _unseenCount = 0;
    @track _unreadCount = 0;
    @track _maxNumNotifications = 50;
    @track _numDays = 30;

    
    notificationsEnabled = !isGuest;
    canNavigateWithTargetPageRef = false;
    _hasMoreNotifications = true;
    _showError = false;
    _isCommunitiesSite = true;


    // reference variable for a notification to be navigated to
    _notificationToNavigate;


    /**
     * Wire adapter to get Record details from notificationId ie recordId
     * @param error
     * @param data
     */
    // eslint-disable-next-line lwc-core/valid-offline-wire
    /*@wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full']})
    getRecordWire({error, data}) {
        if (error) {
            // Errors are expected, such as records that aren't supported by the wire. eg FeedItem
            // In this case, if we are in Communities context we display a toast message
            // In case of LEX or non-CLWR context we navigate to the record,
            // since there is no hard requirement of objectApiName like in the case of Communities
            if (this._isCommunitiesSite) {
                this.updateToast(UNSUPPORTED_COMMUNITIES_NAVIGATION_TARGET, true);
            } else {
                this.navigateToFetchedRecord(null, true);
            }
        } else if (data) {
            this.navigateToFetchedRecord(data, false);
        }
        this.recordId = "";
    }
*/
    // local variables for toast notification: to be removed once we have lightning toast support in CLWR
    @track showToast = false;
    @track toastMessage = "";

    @wire(CurrentPageReference) _pageRef;

    /**
     * Interval in milliseconds to poll for notifications updates if polling is
     * enabled.
     */
    pollingInterval;
    _hasLoaded = false;

    /*
     * The following variables and getters/setters are only used for component customization in Experience Builder.
     */
    _imageUrl;
    
    get imageUrl() {
        return this._imageUrl;
    }
    set imageUrl(url) {
        this._imageUrl = url;
    }

    get customNotificationTypesFilter() {
        if(this.configurationJSON !== undefined)
        {
            return this.configurationJSON?.generalNotificationConfig?.customNotificationType;
        }
        return null;
    }

    get notificationHeaderText() {
        if(this.configurationJSON !== undefined && this.configurationJSON?.panelHeader?.notificationHeaderText !== undefined && this.configurationJSON?.panelHeader?.notificationHeaderText !== null
            && this.configurationJSON?.panelHeader?.notificationHeaderText.trim() !== '')
        {
            return this.configurationJSON?.panelHeader?.notificationHeaderText;
        }
        return 'Notifications';
    }

    get notificationHeaderMarkAllRead() {
        if(this.configurationJSON !== undefined && this.configurationJSON?.panelHeader?.notificationHeaderMarkAllRead !== undefined && this.configurationJSON?.panelHeader?.notificationHeaderMarkAllRead !== null
            && this.configurationJSON?.panelHeader?.notificationHeaderMarkAllRead.trim() !== '')
        {
            return this.configurationJSON?.panelHeader?.notificationHeaderMarkAllRead;
        }
        return 'Mark All Read';
    }

    get notificationMarkReadText() {
        if(this.configurationJSON !== undefined && this.configurationJSON?.notification?.notificationMarkReadText !== undefined && this.configurationJSON?.notification?.notificationMarkReadText !== null
            && this.configurationJSON?.notification?.notificationMarkReadText.trim() !== '')
        {
            return this.configurationJSON?.notification?.notificationMarkReadText;
        }
        return 'Mark Read';
    }

    get notificationMarkUnreadText() {
        if(this.configurationJSON !== undefined && this.configurationJSON?.notification?.notificationMarkUnreadText !== undefined && this.configurationJSON?.notification?.notificationMarkUnreadText !== null
            && this.configurationJSON?.notification?.notificationMarkUnreadText.trim() !== '')
        {
            return this.configurationJSON?.notification?.notificationMarkUnreadText;
        }
        return 'Mark Unread';
    }

    get notificationImageHide() {
        if(this.configurationJSON !== undefined && this.configurationJSON?.notification?.notificationImageHide !== undefined && this.configurationJSON?.notification?.notificationImageHide !== null)
        {
            return this.configurationJSON?.notification?.notificationImageHide;
        }
        return false;
    }

    get notificationImageOverride() {
        if(this.configurationJSON !== undefined && this.configurationJSON?.notification?.notificationImageOverride !== undefined && this.configurationJSON?.notification?.notificationImageOverride !== null)
        {
            return this.configurationJSON?.notification?.notificationImageOverride;
        }
        return false;
    }

    get notificationImageOverrideUrl() {
        if(this.configurationJSON !== undefined && this.configurationJSON?.notification?.notificationImageOverrideUrl !== undefined && this.configurationJSON?.notification?.notificationImageOverrideUrl !== null
            && this.configurationJSON?.notification?.notificationImageOverrideUrl.trim() !== '')
        {
            return this.configurationJSON?.notification?.notificationImageOverrideUrl;
        }
        return '/img/notificationsEmail/custom_notification.png';
    }

    @api get isInSitePreview() {
        
        return (this._pageRef?.state?.app === "commeditor" || this._pageRef?.state?.view === "editor");
    }

    @api get alignment() {
        if(this.configurationJSON !== undefined)
        {
            return this.configurationJSON.bellIcon.alignment;
        }
        return 'right';
    }

    @api configurationJSONString;
    @api get configurationJSON() {
        if(this.configurationJSONString !== undefined && this.configurationJSONString !== null && this.configurationJSONString.trim() !== '')
        {
            return JSON.parse(this.configurationJSONString);
        }
        return undefined;
    }
    configurationJSONDefault = {
        "counterColor": "#EA001E",
        "counterNumberColor": "#FFFFFF",
        "imageUrl": "",
        "size": 24,
        "defaultIconColor": "",
        "iconHoverColor": "",
        "iconFocusColor": "",
        "iconActiveColor": "",
        "trayHeaderColor": "",
        "notifLabelTextColor": "",
        "notifLabelTextStyle": "Heading2",
        "markAllReadTextColor": "",
        "markAllReadLabelTextStyle": "Paragraph1",
        "trayBodyColor": "",
        "notificationHoverColor": "",
        "notificationUnreadColor": "",
        "bodyDropdownAlign": "left",
        "notificationTitleColor": "",
        "notificationTitleTextStyle": "Heading3",
        "notificationTitleHoverColor": "",
        "notificationTitleUnreadColor": "",
        "notificationBodyColor": "",
        "notificationBodyTextStyle": "Heading4",
        "notificationBodyHoverColor": "",
        "notificationBodyUnreadColor": "",
        "notificationDateTimeColor": "",
        "notificationDateTimeTextStyle": "Paragraph1",
        "notificationDateTimeHoverColor": "",
        "notificationDateTimeUnreadColor": "",
        "notificationMarkReadColor": "",
        "notificationMarkReadTextStyle": "Paragraph1",
        "notificationMarkReadUnreadColor": ""
      }

    @api get customStyles() {
        
        if(this.configurationJSON !== undefined )
        {

            return {
                "counterColor": this.configurationJSON?.bellIcon?.counterColor,
                "counterNumberColor": this.configurationJSON?.bellIcon?.counterNumberColor,
                "imageUrl": this.configurationJSON?.bellIcon?.imageUrl,
                "size": this.configurationJSON?.bellIcon?.size,
                "defaultIconColor": this.configurationJSON?.bellIcon?.defaultIconColor,
                "iconHoverColor": this.configurationJSON?.bellIcon?.iconHoverColor,
                "iconFocusColor": this.configurationJSON?.bellIcon?.iconFocusColor,
                "iconActiveColor": this.configurationJSON?.bellIcon?.iconActiveColor,
                "trayHeaderColor": this.configurationJSON?.panelHeader?.trayHeaderColor,
                "notifLabelTextColor": this.configurationJSON?.panelHeader?.notifLabelTextColor,
                "notifLabelTextStyle": this.configurationJSON?.panelHeader?.notifLabelTextStyle,
                "markAllReadTextColor": this.configurationJSON?.panelHeader?.markAllReadTextColor,
                "markAllReadLabelTextStyle": this.configurationJSON?.panelHeader?.markAllReadLabelTextStyle,
                "trayBodyColor": this.configurationJSON?.panelBody?.trayBodyColor,
                "notificationHoverColor": this.configurationJSON?.panelBody?.notificationHoverColor,
                "notificationUnreadColor": this.configurationJSON?.panelBody?.notificationUnreadColor,
                "bodyDropdownAlign": this.configurationJSON?.panelBody?.bodyDropdownAlign,
                "notificationTitleColor": this.configurationJSON?.notification?.notificationTitleColor,
                "notificationTitleTextStyle": this.configurationJSON?.notification?.notificationTitleTextStyle,
                "notificationTitleHoverColor": this.configurationJSON?.notification?.notificationTitleHoverColor,
                "notificationTitleUnreadColor": this.configurationJSON?.notification?.notificationTitleUnreadColor,
                "notificationBodyColor": this.configurationJSON?.notification?.notificationBodyColor,
                "notificationBodyTextStyle": this.configurationJSON?.notification?.notificationBodyTextStyle,
                "notificationBodyHoverColor": this.configurationJSON?.notification?.notificationBodyHoverColor,
                "notificationBodyUnreadColor": this.configurationJSON?.notification?.notificationBodyUnreadColor,
                "notificationDateTimeColor": this.configurationJSON?.notification?.notificationDateTimeColor,
                "notificationDateTimeTextStyle": this.configurationJSON?.notification?.notificationDateTimeTextStyle,
                "notificationDateTimeHoverColor": this.configurationJSON?.notification?.notificationDateTimeHoverColor,
                "notificationDateTimeUnreadColor": this.configurationJSON?.notification?.notificationDateTimeUnreadColor,
                "notificationMarkReadColor": this.configurationJSON?.notification?.notificationMarkReadColor,
                "notificationMarkReadTextStyle": this.configurationJSON?.notification?.notificationMarkReadTextStyle,
                "notificationMarkReadUnreadColor": this.configurationJSON?.notification?.notificationMarkReadUnreadColor
            };

        }
        else 
        {
            return this.configurationJSONDefault;
        }

    }

    /**
     * The network ID to use for streaming connections when using the component
     * in a communities context.
     */
    @api communityNetworkId = "";

    /**
     * Boolean indicating if polling should be used to update notifications in
     * the case where the streaming API is either disabled or unavailable.
     */
    @track fallbackPollingEnabled = false;

    /**
     * Maximum number of milliseconds to wait while checking if streaming is
     * available.
     */
    @api streamingEnabledTimeoutMilliseconds = 5000;

    /**
     * Boolean indicating if we should use the streaming API to update
     * notifications. If this is `false` or the streaming API is not available,
     * we will fall back to polling if it's enabled.
     */ /* TODO Add code to populate this value from configs*/
    @api useStreaming = false;

    // Handles to our subscriptions if streaming support is enabled. The
    // handles can then be used to unsubscribe when we clean up.
    _streamingSubscriptionNotificationsHandle;
    _streamingSubscriptionReadStateHandle;

    // Handle to the timer used to poll for notification updates.
    _pollingHandle = null;

    // Flag indicating that polling should be stopped. This is used in
    // conjunction with `_pollingHandle` to ensure that polling can be stopped
    // in all cases.
    _pollingStopped = false;

    // array of permissions passed to the component
    @api perms;

    get labels() {
        return {
            PREVIEW_NOTIFICATIONS_DISABLED
        };
    }

    get rootClass() {
        return `slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open notif-horizontal-align`;
    }

    /**
     * This is created to pass the reference of handler function to addEventListener(),
     * this reference can also be used for cleanup
     */
    refreshNotifications = () => {
        this.loadNotifications();
    };

    renderedCallback() {
        const alignment = this.alignment;
        const alignmentClass = this.template.querySelector(".notif-horizontal-align");
        if (alignmentClass && alignment) {
            alignmentClass.style.setProperty("--dxp-c-notification-margin", MARGIN[alignment]);
        }
    }

    async connectedCallback() {

        // metrics tracking to log duration of the component load
        try {
            
            // get initial configuration values
            await this.fetchAndUpdateConfigValues();

            // load initial notification data and update the counter
            await this.loadNotifications();

            // streaming API support
            if (await this.canEnableStreaming()) {
                await this.enableStreaming();
            } else if (this.fallbackPollingEnabled) {
                this.enablePolling();
            }

            // expose refresh notifications event
            document.addEventListener("refreshNotifications",  this.refreshNotifications);

        } catch (e) {
           // activity.error(e);
        } finally {
           // activity.stop();
        }
    }

    /**
     * Clean up
     */
    disconnectedCallback() {
        this.stopStreaming();
        this.stopPolling();

        document.removeEventListener("refreshNotifications",  this.refreshNotifications);
    }

    /**
     * Determine if the streaming API is enabled in the current environment.
     *
     * This function will time out after `streamingEnabledTimeoutMilliseconds`
     * milliseconds and return `false`. This provides a better failure mechanism
     * when running off-core where there is no handler for the API call being
     * made. Without the timeout, the call would just spin forever.
     *
     * @returns A promise that resolves to a boolean indicating if streaming is
     * available in the current environment.
     */
    async canEnableStreaming() {
        // If streaming was disabled via component property, we can early exit
        // without an API call.
        if (!this.useStreaming) {
            return false;
        }

        let timeoutHandle;
        const timeout = new Promise(resolve => {
            // The async operation is used to bound an API call that could
            // otherwise run forever.
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            timeoutHandle = setTimeout(
                () => resolve(false),
                this.streamingEnabledTimeoutMilliseconds,
            );
        });

        try {
            return await Promise.race([timeout, empApi.isEmpEnabled()]);
        } catch (_) {
            // Ignore error. Assume it just means streaming isn't available.
        } finally {
            // Clean up the timeout. Clearing a timer that has already resolved
            // is a no-op, so we don't have to check if the API call won the
            // race.
            clearTimeout(timeoutHandle);
        }

        return false;
    }

    /**
     * Use the streaming API to subscribe to notification updates.
     *
     * @returns A promise that resolves once we have subscribed to the
     * appropriate notification update channels.
     */
    async enableStreaming() {

        empApi.onError(this.handleStreamingError.bind(this));

        const notificationsChannelParts = [NOTIFICATIONS_CHANNEL];
        if (this.communityNetworkId) {
            notificationsChannelParts.push(this.communityNetworkId);
        }

        this._streamingSubscriptionNotificationsHandle = await empApi.subscribe(
            notificationsChannelParts.join("/"),
            -1,
            this.handleNotificationMessage.bind(this)
        );
        this._streamingSubscriptionReadStateHandle = await empApi.subscribe(
            READ_STATE_CHANNEL,
            -1,
            this.handleReadStateMessage.bind(this)
        );
    }

    /**
     * Unsubscribe from any streaming channels that we currently have a
     * subscription to.
     */
    stopStreaming() {
        if (this._streamingSubscriptionNotificationsHandle) {
            empApi.unsubscribe(this._streamingSubscriptionNotificationsHandle);
        }

        if (this._streamingSubscriptionReadStateHandle) {
            empApi.unsubscribe(this._streamingSubscriptionReadStateHandle);
        }
    }

    /**
     * Handler for errors from the streaming API.
     *
     * If the error indicates that we have reached the subscription limit, we
     * fall back to polling if it's available.
     *
     * @param {*} response - The error sent by the EMP API.
     */
    handleStreamingError(response) {
        if (!response) {
            return;
        }

        const isNotificationsSub = response?.subscription === NOTIFICATIONS_CHANNEL;
        const isProtocolChannel = !["/meta/subscribe", "/meta/unsubscribe"].includes(response?.channel);

        if (!response?.successful && (isNotificationsSub || isProtocolChannel)) {
            this.stopStreaming();

            if (this.fallbackPollingEnabled) {
                this.enablePolling();
            }
        }
    }

    handleNotificationMessage(message) {
        const payload = this.decodeMessage(message);
        if (payload) {
            notificationsStore.upsert([payload]);
            this.updateUIParams();
        }
    }

    handleReadStateMessage(message) {
        const payload = this.decodeMessage(message);
        if (payload) {
            switch (payload.reason) {
                case "MarkRead":
                    notificationsStore.markAllRead(payload.status.oldestUnread);
                    break;
                case "MarkSeen":
                    notificationsStore.markAllSeen(payload.status.oldestUnseen);
                    break;
                default:
                // We would log here, but `console.*` statements are banned,
                // and omitting a `default` case is also banned, so instead
                // we have this comment.
            }
            this.updateUIParams();
        }
    }

    /**
     * Decode a message that contains a JSON-encoded payload as a field.
     *
     * @param {*} message - The message containing the payload to decode.
     *
     * @returns The decoded payload from the message or `undefined` if the
     * payload was invalid.
     */
    decodeMessage(message) {
        try {
            return JSON.parse(message.data.payload);
        } catch (_) {
            return undefined;
        }
    }

    /**
     * Enable polling for notifications updates. The polling interval is
     * dictated by {@link pollingInterval}.
     *
     * If polling has already been enabled, this is a no-op.
     */
    enablePolling() {

        this._pollingStopped = false;

        // Don't set up another polling timer if one is already running.
        if (this._pollingHandle !== null) {
            return;
        }

        // We already load notifications when the component is mounted, so we
        // should wait for the polling interval before polling for the first
        // update.
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._pollingHandle = setTimeout(
            this._pollNotifications.bind(this),
            this.pollingInterval,
        );
    }

    async _pollNotifications() {
        await this.loadNotifications();

        // If polling was stopped in between this method being entered and the
        // `loadNotifications` call resolving, we need an explicit check to bail
        // out without setting another timer.
        if (this._pollingStopped) {
            return;
        }

        // This is set up as a recursive `setTimeout` rather than using
        // `setInterval` because it means we will wait for the specified polling
        // interval no matter how long the `loadNotifications` call takes.
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._pollingHandle = setTimeout(
            this._pollNotifications.bind(this),
            this.pollingInterval,
        );
    }

    /**
     * Stop polling for notifications updates.
     *
     * This method is safe to regardless of polling being enabled.
     */
    stopPolling() {
        this._pollingStopped = true;

        if (this._pollingHandle !== null) {
            clearTimeout(this._pollingHandle);
            this._pollingHandle = null;
        }
    }

    /* ---------------------- Utility methods for UI functionalities ---------------------------- */

    /**
     * It might seem weird that this handleIconClick handler exists as well as logic inside notificationsIcon which
     * handles click the icon. This method here is to deal with the onblur functionality of the tray. I couldn't
     * figure out how to do it a different way without breaking the case where the user tries to close the tray by
     * clicking the bell icon again.
     */
    handleIconClick() {
        const iconAndPanelDiv = this.template.querySelector(".notif-horizontal-align");
        if (iconAndPanelDiv) {
            iconAndPanelDiv.focus();
        }
    }

    handleOnBlur(event) {
        if (!event.relatedTarget || !event.target.contains(event.relatedTarget)) {
            this.isPanelVisible = false;
        } else {
            /**
             * this handles the case where there are no notifications present and the user clicks inside the tray and
             * then outside the tray. Clicking inside the tray made the tray lose focus and the subsequent onblur
             * wouldn't close the tray. So calling handleIconClick() again gave focus back to the tray so it could close
             * next onblur event.
             */
            this.handleIconClick();
        }
    }

    /**
     * Handler on click of the bell icon
     */
    bellIconClickHandler() {
        this.isPanelVisible = !this.isPanelVisible;
        //this._unseenCount = 0;
    }

    closePanel() {
        this.isPanelVisible = false;
    }

    /**
     * API call to fetch config values
     */
    async fetchAndUpdateConfigValues() {


        this.canNavigateWithTargetPageRef = true;
        this.fallbackPollingEnabled = true;
        this._isCommunitiesSite = true;
        this.pollingInterval = 60000;

    }

    /**
     * Initial of notifications
     */
    async loadNotifications() {
        try {
            if(this.isInSitePreview === false)
            {
                // metrics for server call
                let params = {};
                params.numDays = this._numDays;
                params.maxNumNotifications = this._maxNumNotifications;
                params.notificationType = this.customNotificationTypesFilter;
                const notifications = await getNotifications(params);
                if (notifications && notifications.mostRecentNotifications) {
                    this.updateNotifications(notifications.mostRecentNotifications);
                    this._hasLoaded = true;
                }
            } 
            else 
            {
                this.updateNotifications(JSON.parse(dummyData));
                this._hasLoaded = true;
                this._hasMoreNotifications = false;
            }
        } catch (e) {
            console.log(e+'');
        }
    }

    /**
     * Loop through notifications and update the UI
     * @param notifications
     */
    updateNotifications(notifications) {
        const notifs = [];
        for (const notification of notifications) {
            notifs.push(notification);
        }
        notificationsStore.upsert(notifs);
        this.updateUIParams();
    }

    /**
     * Set updated values to the reactive UI elements
     */
    updateUIParams() {
        this._notifications = [...notificationsStore.get()];
        this._unseenCount = notificationsStore.getUnseenCount();
        this._unreadCount = notificationsStore.getUnreadCount();
    }

    /**
     * Mark all notifications as "Seen"
     * This is called when the bell icon is clicked
     */
    async markAllNotificationsAsSeen() {
        try {
            // make a backend call to mark records as seen only if there are unseen notifications
            if (notificationsStore.getUnseenCount() > 0) {
                // W-4745094 - Use time of latest notification because it's possible that VM's time is behind.
                // But use current time when the Notifications button is clicked before Notifications are loaded.
                
                const youngest = notificationsStore.getYoungestDate();
                const beforeDateTime = youngest != null ? new Date(youngest).toISOString() : new Date().toISOString();
                // update client-side store
                notificationsStore.markAllSeen(beforeDateTime, []);
                let params = {};
                params.beforeDateTime = beforeDateTime;
                const notifications = await markNotificationsSeen(params);
                if (notifications && notifications.mostRecentNotifications) {
                    this.updateNotifications(notifications.mostRecentNotifications);
                    this._hasLoaded = true;
                }
                this.updateUIParams();
                
            }
        } catch (e) {
            console.log(e+'');
        }
    }

    /**
     * Mark all notifications as "Read"
     * This is called when the user clicks the "Mark All As Read" link on the notifications panel
     */
    async handleMarkAllRead() {
        try {
            const youngestDate = notificationsStore.getYoungestDate();
            const beforeDateTime = youngestDate != null ? new Date(youngestDate).toISOString() : new Date().toISOString();
            notificationsStore.markAllRead(beforeDateTime, []);
            let params = {};
            params.beforeDateTime = beforeDateTime;
            const notifications = await markNotificationsRead(params);
            if (notifications && notifications.mostRecentNotifications) {
                this.updateNotifications(notifications.mostRecentNotifications);
                this._hasLoaded = true;
            }
            this.updateUIParams();
        } catch (e) {
            console.log(e+'');
        }
    }

    /**
     * Handler for notification click event
     * Marks the clicked notifications as "Read"
     * @param notification the notification that got clicked
     */
    onNotifClick(notification) {
        this.hideToast();
        if (notification) {
            // mark the notifications as read
            // get the id of the clicked notification
            const notificationId = notification.id;
            if (notificationId) {
                // mark notification read
                this.markNotificationRead(notificationId);
            }
            this._navigate(notification);
        }
    }

    onNotifMarkRead(notification) {
        this.hideToast();
        if (notification) {
            // mark the notifications as read
            // get the id of the clicked notification
            const notificationId = notification.id;
            if (notificationId) {
                // mark notification read
                this.markNotificationRead(notificationId);
            }
        }
    }

    onNotifMarkUnread(notification) {
        this.hideToast();
        if (notification) {
            // mark the notifications as read
            // get the id of the clicked notification
            const notificationId = notification.id;
            if (notificationId) {
                // mark notification read
                this.markNotificationUnread(notificationId);
            }
        }
    }

    /* ---------------------- Navigation Support ---------------------------- */

    _navigate(notification) {
        const { supported, message, isSilent } = this._getNavigationTargetInfo(notification);

        if (isSilent) {
            return;
        }

        if (!supported) {
            this.updateToast(message, true);
            return;
        }

        const pageReferenceStr = notification.targetPageRef;
        const pageReference = this.canNavigateWithTargetPageRef ? this._decodePageReference(pageReferenceStr) : null;

        if (pageReference) {
            if (pageReference.type === "standard__webPage" && pageReference.attributes) {
                const urlNavObject = {
                    type: "standard__webPage",
                    attributes: {
                        url: pageReference.attributes.url
                    }
                };
                this[NavigationMixin.Navigate](urlNavObject);
            } else {
                this[NavigationMixin.Navigate](pageReference);
            }
        } else if (this._isLearningNotification(notification)) {
            //this._handleLearningNotification(notification);
            //this.isPanelVisible = false;
        } else if (this._isGuidanceCenterNotification(notification)) {
            //this._handleGuidanceCenterNotification(notification);
        } else if (this._isRedirectionDisabledNotification(notification)) {
            // do nothing for notification types for which redirection is disabled
        } else if (this._isNonSObjectPageReferenceNotification(notification)) {
            // for non sobject page reference no need to call getRecord wire, hence navigate directly
            this[NavigationMixin.Navigate](getPageReferenceObject(notification));
        } else {
            // notification object is parsed / cloned so that we can set objectApiName to it
            this._notificationToNavigate = JSON.parse(JSON.stringify(notification));
            // call getRecord wire and then navigate
            this.fetchRecordDetailsAndNavigate(notification);
        }
    }

    _getNavigationTargetInfo(notification) {
        /*
         * This is to disable any click action in case of Community Builder and Sitepreview
         * Domains of builder and sitepreview are different from communities runtime.
         * As a result notifications doesn't support navigation.
         */
        if (this._pageRef && this._pageRef.state) {
            if (this.isInSitePreview === true) {
                return {
                    supported: false,
                    message: PREVIEW_NOTIFICATIONS_DISABLED,
                    isSilent: false
                };
            }
        }

        // If we are in a communities site, make sure the navigation event is
        // supported for the given notification type.
        if (this._isCommunitiesSite && this._isUnsupportedInCommunities(notification)) {
            return {
                supported: false,
                message: UNSUPPORTED_COMMUNITIES_NAVIGATION_TARGET,
                isSilent: false
            };
        }

        // For silent notifications in communities, we do not show the toast message
        if (this._isCommunitiesSite && this._isSilentCommunitiesNotification(notification)) {
            return {
                supported: false,
                message: UNSUPPORTED_COMMUNITIES_NAVIGATION_TARGET,
                isSilent: true
            };
        }

        return { supported: true };
    }

    _isUnsupportedInCommunities(notification) {
        switch (notification.type) {
            // Unsupported navigateToComponent types
            case "data_assessment_alert":
            case "view_siq_object":
                return true;

            // Unsupported navigateToSetup types
            case "activity_metrics_enablement":
            case "ase_inbox_conflict_resolution":
            case "einstein_builder_state_change":
            case "leadscore_enablement":
            case "siq_connect_exchange":
                return true;

            case "order_management_alert":
                // This specific ID indicates that we should navigate to the
                // setup page (unsupported), while other IDs indicate we
                // should navigate to the object itself.
                if (notification.target === "000000000000000BBB") {
                    return true;
                }
                break;

            // Voicemails aren't supported
            case "voicemail":
                return true;

            default:
                // Empty default case so ESLint doesn't throw a fit.
        }

        return false;
    }

    _decodePageReference(pageReferenceStr) {
        let pageReference = null;
        try {
            pageReference = JSON.parse(this.decodeHtml(pageReferenceStr));
        } catch (e) {
            // we can maybe log something here in the future
        }
        return pageReference;
    }

    decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    _isLearningNotification(notification) {
        return ["learning_item_completion", "learning_item_start", "learning_item_assignment"].includes(notification.type);
    }

    /*_handleLearningNotification(notification) {
        const celebrate = notification.type === "learning_item_completion";
        sidePanelApi.open({ type: "EnablementProgram", id: notification.target, celebrate });
    }*/

    _isGuidanceCenterNotification(notification) {
        return ["new_guidance_center_scenario"].includes(notification.type);
    }

    /*
    _handleGuidanceCenterNotification(notification) {
        const additionalData = JSON.parse(notification.additionalData);
        sidePanelApi.open({
            type: "GuidanceSet",
            assistantName: additionalData.assistantName,
            title: additionalData.assistantTitle,
            closeNotificationTray: true,
            page: 'assistant'
        });
    }*/

    _isSilentCommunitiesNotification(notification) {
        return ["learning_item_completion", "learning_item_start", "learning_item_assignment", "new_guidance_center_scenario"].includes(notification.type);
    }

    _isRedirectionDisabledNotification(notification) {
        if (["missed_call"].includes(notification.type) && (notification.target === "000000000000000" || notification.target === "000000000000000AAA")) {
            // Do not do anything for unknown numbers
            return true;
        }
        // order_management_alert, ase_inbox_conflict_resolution, einstein_builder_state_change, leadscore_enablement,
        // voicemail, are disabled in Communities
        // For LEX, we do nothing until we have support for setup:navigateToSetup in LWC

        // direct_message, dj_package_inapp_alert will be supported in 244
        return ["sustainability", "order_management_alert", "ase_inbox_conflict_resolution", "einstein_builder_state_change",
            "direct_message", "dj_package_inapp_alert", "data_preview_alert", "leadscore_enablement", "voicemail",
            "activity_metrics_enablement", "view_all_emails", "activity_team_member", "siq_connect_exchange"].includes(notification.type);
    }

    /**
     * These are notifications that DONOT use sObjectPageReference for navigation
     * In case of sObject notifications, we have to call the getRecord fire to fetch objectApiName
     * The below notification types, do not need the wire to be called
     * @param notification
     * @returns {boolean}
     * @private
     */
    _isNonSObjectPageReferenceNotification(notification) {
        return ["data_assessment_alert", "forecasting_jump_to", "view_siq_object", "automated_data_capture",
            "optimizer_scan_results", "discovery_model_metrics", "security_center_alert"].includes(notification.type);
    }

    /**
     * Mark the given notification as "Read"
     * @param notificationId
     */
    async markNotificationRead(notificationId) {
        try {
            // update client side store
            notificationsStore.markRead(notificationId);
            let params = {};
            params.notificationId = notificationId;
            params.read = true;
            // backend api call to mark a notification as read
            const response = await markNotificationReadUnread(params);
            this.updateUIParams();
        } catch (e) {
            console.log(e+'');
        }
    }

    /**
     * Mark the given notification as "Unread"
     * @param notificationId
     */
    async markNotificationUnread(notificationId) {
        try {
            // update client side store
            notificationsStore.markUnread(notificationId);
            let params = {};
            params.notificationId = notificationId;
            params.read = false;
            // backend api call to mark a notification as read
            const response = await markNotificationReadUnread(params);
            this.updateUIParams();
        } catch (e) {
            console.log(e+'');
        }
    }

    /**
     * Utility function to update recordId to fetch record details
     * @param notification
     */
    async fetchRecordDetailsAndNavigate(notification) {
        const recordId = notification ? notification.target : "";
        const objectApiName = await getObjectAPINameByRecordId({recordId: recordId});
        if (objectApiName) {
            let record = {};
            record.id = recordId;
            record.apiName = objectApiName;
            this.navigateToFetchedRecord(record, false);
        }
    }

    /**
     * This is a callback function to navigate to a given record after fetching its details
     * Here, we fetch the record details (i.e. ObjectApiName) and pass it to the navigation library
     * @param record
     */
    navigateToFetchedRecord(record, isFeedItemDetail) {
        if ((this._notificationToNavigate && (record || isFeedItemDetail))) {
            this._notificationToNavigate.objectApiName = record ? record.apiName : "";
            this[NavigationMixin.Navigate](getPageReferenceObject(this._notificationToNavigate));
            this._notificationToNavigate = null;
        }
    }

    /**
     * Handler to load more notifications on scroll
     */
    async getMore(payload) {
        const oldestDate = payload && payload.before ? payload.before : notificationsStore.getOldestDate();
        // do not make a server call if there are no more notifications
        if (this._hasMoreNotifications) {
            try {
                
                let params = {};
                params.before = oldestDate;
                params.maxNumNotifications = this._maxNumNotifications;
                params.notificationType = this.customNotificationTypesFilter;

                const notifications = await getOlderNotifications(params);
                
                if (notifications && notifications.mostRecentNotifications && notifications.mostRecentNotifications.length > 0) {
                    const lastRecentNotification = notifications.mostRecentNotifications[notifications.mostRecentNotifications.length - 1];
                    const lastNotification = notificationsStore.getLastNotification();
                    if(lastRecentNotification !== undefined && lastRecentNotification !== null && lastNotification !== undefined
                        && lastNotification !== null && lastRecentNotification.id === lastNotification.id)
                    {
                        this._hasMoreNotifications = false;
                    }
                    else 
                    {
                        this.updateNotifications(notifications.mostRecentNotifications);
                    }
                    
                } else {
                    this._hasMoreNotifications = false;
                }
                this._showError = false;
            } catch (e) {
                // unable to get a successful response from the server
                this._showError = true;
            }
        }
    }

    /**
     * Handler to hide the toast message
     * @private
     */
    hideToast() {
        this.updateToast("", false);
    }

    /**
     * Update the toast message
     * @param message
     * @param isVisible
     */
    updateToast(message, isVisible) {
        this.showToast = isVisible;
        this.toastMessage = message;
    }

    /**
     * Handler function for notification events
     * @param event
     */
    handleNotificationEvent(event) {
        const details = event.detail;
        if (details && details.action) {
            switch (details.action) {
                case "toggle_panel":
                    this.bellIconClickHandler();
                    break;
                case "close_panel":
                    this.closePanel();
                    break;
                case "notification_click":
                    this.onNotifClick(details.payload);
                    break;
                case "notification_mark_read":
                    this.onNotifMarkRead(details.payload);
                    break;
                case "notification_mark_unread":
                    this.onNotifMarkUnread(details.payload);
                    break;
                case "get_more_notifications":
                    this.getMore(details.payload);
                    break;
                case "mark_all_read":
                    this.handleMarkAllRead();
                    break;
                case "seen_notifications":
                    this.markAllNotificationsAsSeen();
                    break;
                default:
                // Do Nothing
            }
        }
    }


    

}