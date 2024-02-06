/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {LightningElement, api, track} from "lwc";

/* Labels */ 
const MORE_NOTIFICATIONS_ERROR = 'Error loading more notifications.';

import * as NotificationStore from "c/notificationsStore";

export default class NotificationsList extends LightningElement {
    @track _notifications = [];
    _noMoreNotifications = false;
    _showError = false;
    _notificationMarkReadText;
    _notificationMarkUnreadText;
    _notificationImageHide;
    _notificationImageOverride;
    _notificationImageOverrideUrl;

 

    _customStyles;

    @api get customStyles() {
        return this._customStyles;
    }

    set customStyles(styles) {
        this._customStyles = styles;
    }

    connectedCallback() {
        if (this._notifications && this._notifications.length > 0) {
            const seenNotificationsEvent = new CustomEvent("notification_event", {
                detail: {
                    action: "seen_notifications"
                },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(seenNotificationsEvent);
        }
    }

    @api get notificationMarkReadText() {
        return this._notificationMarkReadText;
    }

    set notificationMarkReadText(notificationMarkReadTextValue) {
        this._notificationMarkReadText = notificationMarkReadTextValue;
    }

    @api get notificationMarkUnreadText() {
        return this._notificationMarkUnreadText;
    }

    set notificationMarkUnreadText(notificationMarkUnreadTextValue) {
        this._notificationMarkUnreadText = notificationMarkUnreadTextValue;
    }

    @api get notificationImageHide() {
        return this._notificationImageHide;
    }

    set notificationImageHide(notificationImageHideValue) {
        this._notificationImageHide = notificationImageHideValue;
    }

    @api get notificationImageOverride() {
        return this._notificationImageOverride;
    }

    set notificationImageOverride(notificationImageOverrideValue) {
        this._notificationImageOverride = notificationImageOverrideValue;
    }

    @api get notificationImageOverrideUrl() {
        return this._notificationImageOverrideUrl;
    }

    set notificationImageOverrideUrl(notificationImageOverrideUrlValue) {
        this._notificationImageOverrideUrl = notificationImageOverrideUrlValue;
    }

    @api get notifications() {
        return this._notifications;
    }

    set notifications(notifications) {
        for (let i = 0; i < notifications.length; i++) {
            const currNotif = notifications[i];
            this._notifications[i] = {...currNotif};
        }
    }

    @api get showerror() {
        return this._showError;
    }

    set showerror(showerror) {
        this._showError = showerror;
    }

    get labels() {
        return {
            MORE_NOTIFICATIONS_ERROR
        };
    }

    get moreNotificationsErrorClass() {
        return "slds-text-align_center slds-p-vertical_xxx-small error " + (this._showError ? "slds-show" : "slds-hide");
    }

    scrolled(e) {
        if (e.currentTarget.scrollTop + 1 >= e.currentTarget.scrollHeight - e.currentTarget.clientHeight) {
            // we probably need a mechanism to check if we're loading more notifications or not and only execute this
            // if we haven't started fetching more notifications.
            this.loadMoreNotifications();
        }
    }

    /**
     * function to be called if user has scrolled to the bottom of the loaded notifications (we currently fetched 50 at
     * the start) so we can grab more.
     */
    loadMoreNotifications() {
        if (this._noMoreNotifications) {
            return;
        }
        const oldestDate = NotificationStore.getOldestDate();

        // Probably need to define a callback somewhere to pass to the event.
        const notificationEvent = new CustomEvent(
            "notification_event", {
                detail: {
                    action: "get_more_notifications",
                    payload: {
                        before: oldestDate
                    },
                },
                bubbles: true,
                composed: true
            },
        );
        this.dispatchEvent(notificationEvent);
    }
}