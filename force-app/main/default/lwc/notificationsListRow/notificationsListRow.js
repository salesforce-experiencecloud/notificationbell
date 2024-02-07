/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {LightningElement, api} from "lwc";
import LOCALE from '@salesforce/i18n/locale';
import custom_notification_img from '@salesforce/resourceUrl/custom_notification';

/* Labels */ /*
import UNREAD_NOTIFICATION from "@salesforce/label/NotificationsClient.unreadNotification";
import DATE_IN_NETWORK_NAME_TEXT from "@salesforce/label/NotificationsClient.dateInNetworkNameText";
*/

const UNREAD_NOTIFICATION = 'Unread Notifications';
const DATE_IN_NETWORK_NAME_TEXT = 'Network Date';


export default class NotificationsListRow extends LightningElement {
    /**
     * The notification to display
     * @type {{}} an object
     */
    _notification = {};
    _notificationMarkReadText;
    _notificationMarkUnreadText;
    _notificationImageHide;
    _notificationImageOverride;
    _notificationImageOverrideUrl;
    _isInSitePreview = false;

    /**
     * Number of hours to show relative time for.
     * @type {number}
     */
    @api relativeDateDurationHours = 24;

    /**
     * Date to display in the notification.
     * @type {string}
     */
    date = "";

    /**
     * Full date and time displayed in the hover for a relative date.
     * @type {string}
     */
    fullDateTimeText = "";

    /**
     * Network string to display in the notification. Format like "in network_name"
     * @type {string}
     * @private
     */
    _optionalNetworkText = "";

    /**
     * This is mainly just used to detect whether an instance of a listRow is the first one or not in a ul element.
     * We remove the top border of the first li element so it looks better in the tray. Kinda hacky but currently the
     * best way to approach it since there's a shadowDOM between the notificationsList and notificationsListRow
     */
    @api index;

    _customStyles;

    @api get customStyles() {
        return this._customStyles;
    }

    set customStyles(styles) {
        this._customStyles = styles;
    }

    renderedCallback() {
        const customStyles = this._customStyles;
        if (customStyles) {
            this.handleReadAndTitleCustomStyles(customStyles);
            this.handleBodyCustomStyles(customStyles);
            this.handleDateTimeCustomStyles(customStyles);
            this.handleMarkReadCustomStyles(customStyles);
        }

        const titleAction = this.template.querySelector(".titleAction a");
            if (titleAction) {
                
                if (customStyles.markAllReadLabelTextStyle) {
                    switch (customStyles.markAllReadLabelTextStyle) {
                        case "none":
                            titleAction.style.fontFamily = "inherit";
                            titleAction.style.fontStyle = "inherit";
                            titleAction.style.fontWeight = "inherit";
                            titleAction.style.textDecoration = "inherit";
                            break;
                        case "Heading1":
                            titleAction.style.fontFamily = "var(--dxp-s-text-heading-extra-large-font-family)";
                            titleAction.style.fontStyle = "var(--dxp-s-text-heading-extra-large-font-style)";
                            titleAction.style.fontWeight = "var(--dxp-s-text-heading-extra-large-font-weight)";
                            titleAction.style.fontSize = "var(--dxp-s-text-heading-extra-large-font-size)";
                            break;
                        case "Heading2":
                            titleAction.style.fontFamily = "var(--dxp-s-text-heading-large-font-family)";
                            titleAction.style.fontStyle = "var(--dxp-s-text-heading-large-font-style)";
                            titleAction.style.fontWeight = "var(--dxp-s-text-heading-large-font-weight)";
                            titleAction.style.fontSize = "var(--dxp-s-text-heading-large-font-size)";
                            break;
                        case "Heading3":
                            titleAction.style.fontFamily = "var(--dxp-s-text-heading-medium-font-family)";
                            titleAction.style.fontStyle = "var(--dxp-s-text-heading-medium-font-style)";
                            titleAction.style.fontWeight = "var(--dxp-s-text-heading-medium-font-weight)";
                            titleAction.style.fontSize = "var(--dxp-s-text-heading-medium-font-size)";
                            break;
                        case "Heading4":
                            titleAction.style.fontFamily = "var(--dxp-s-text-heading-small-font-family)";
                            titleAction.style.fontStyle = "var(--dxp-s-text-heading-small-font-style)";
                            titleAction.style.fontWeight = "var(--dxp-s-text-heading-small-font-weight)";
                            titleAction.style.fontSize = "var(--dxp-s-text-heading-small-font-size)";
                            break;
                        case "Paragraph1":
                            titleAction.style.fontFamily = "var(--dxp-s-body-font-family)";
                            titleAction.style.fontStyle = "var(--dxp-s-body-font-style)";
                            titleAction.style.fontWeight = "var(--dxp-s-body-font-weight)";
                            titleAction.style.fontSize = "var(--dxp-s-text-body-font-size)";
                            break;
                        case "Paragraph2":
                            titleAction.style.fontFamily = "var(--dxp-s-body-small-font-family)";
                            titleAction.style.fontStyle = "var(--dxp-s-body-small-font-style)";
                            titleAction.style.fontWeight = "var(--dxp-s-body-small-font-weight)";
                            titleAction.style.fontSize = "var(--dxp-s-text-body-small-font-size)";
                            break;
                        default:
                            // do nothing
                    }
                }
            }

    }

    connectedCallback() {
        this.setDateAndOptionalNetworkText();
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

    @api get sitePreviewNotificationIcon() {
        return custom_notification_img;
    }


    @api get isInSitePreview() {
        return this._isInSitePreview;
    }

    set isInSitePreview(isInSitePreviewValue) {
        this._isInSitePreview = isInSitePreviewValue;
    }

    @api get notification() {
        return this._notification;
    }

    set notification(notification) {
        this._notification = notification;
    }

    get labels() {
        return {
            UNREAD_NOTIFICATION,
            DATE_IN_NETWORK_NAME_TEXT
        };
    }

    get optionalNetworkText() {
        return this._optionalNetworkText;
    }

    get hasNetworkText() {
        return (this._notification.communityName !== null && this._notification.communityName !== undefined);
    }

    get shouldDisplayFullDate() {
        return typeof this.date === "string";
    }

    get hasTitleOrBody() {
        return this.hasTitle || this.hasBody;
    }

    get hasTitle() {
        return this._notification.messageTitle !== undefined && this._notification.messageTitle !== null
            && this._notification.messageTitle !== "";
    }

    get hasBody() {
        return this._notification.messageBody !== undefined && this._notification.messageBody !== null
            && this._notification.messageBody !== "";
    }

    get hasBeenReadClass() {
        return this._notification.read ? "notification-content-hidden" : "";
    }

    get listItemClass() {
        return "notification-row " + (this._notification.read ?
            "notification-read" : "notification-unread") + (this.index === 0 ? " first-item" : "");
    }

    handleOnClick() {
        const notificationEvent = new CustomEvent(
            "notification_event", {
                detail: {
                    action: "notification_click",
                    payload: this._notification
                },
                bubbles: true,
                composed: true
            }
        );
        this.dispatchEvent(notificationEvent);
        this._notification = {...this._notification, read: true, seen: true};
    }

    handleReadUnreadClick() {
        const action = this._notification.read ? 'notification_mark_unread' : 'notification_mark_read';
        const notificationEvent = new CustomEvent(
            "notification_event", {
                detail: {
                    action: action,
                    payload: this._notification
                },
                bubbles: true,
                composed: true
            }
        );
        this.dispatchEvent(notificationEvent);
        this._notification = {...this._notification, read: !this._notification.read, seen: true};
    }

    /* ------------------------------------*/
    /* ------PRIVATE HELPER FUNCTIONS------*/
    /* ------------------------------------*/
    setDateAndOptionalNetworkText() {
        const lastModifiedDate = this.getTimestamp();
        this.date = this.getRelativeTime(lastModifiedDate);
        if (this.hasNetworkText) {
            this._optionalNetworkText = this.labels.DATE_IN_NETWORK_NAME_TEXT.replace("{1}", this._notification.communityName)
                .replace("{0}", "");
            /**
             * Note: I'm replacing {0} with a blank string because I want to use the label but don't have access to the
             * lwc internationalization library to format the relative date. We can use the lightning base component
             * <lightning-relative-date-time> and that requires either a timestamp or a date object. So in order to
             * include the optional network text, I'm replacing the {1} part of the label and just using a new
             * <lightning-formatted-text> for the relative time.
             */
        }
    }

    getTimestamp() {
        let out = this._notification.lastModified;
        if (this._notification.type === 'task_reminder' || this._notification.type === 'event_reminder') {
            try {
                const data = JSON.parse(this._notification.additionalData);
                if (data.reminderDateTime) {
                    out = parseInt(data.reminderDateTime, 10);
                }
            } catch (e) {
                // ignore
            }
        }
        return out;
    }

    getRelativeTime(date) {
        if (date === null || date === undefined) {
            return "";
        }
        const divisor = 1000 * 60 * 60; // Using this divisor to change from milliseconds to hours.
        const notificationCreated = new Date(date);
        const relativeDurationInHours = Math.floor(Math.abs((notificationCreated.getTime() - Date.now()) / divisor));
        const options = {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        };
        const dateTimeText = new Intl.DateTimeFormat(LOCALE, options).format(notificationCreated);
        this.fullDateTimeText = dateTimeText;
        if (relativeDurationInHours >= this.relativeDateDurationHours) {
            return dateTimeText;
        }
        return notificationCreated;
    }

    handleReadAndTitleCustomStyles(customStyles) {
        const rootLiElement = this.template.querySelector("li");

        const unreadNotif = this.template.querySelector(".notification-unread");
        if (unreadNotif) {
            if (customStyles.notificationUnreadColor) {
                rootLiElement.style.setProperty("--dxp-c-unread-override", customStyles.notificationUnreadColor);
            }
            if (customStyles.notificationTitleUnreadColor) {
                rootLiElement.style.setProperty("--dxp-c-title-unread-color-override", customStyles.notificationTitleUnreadColor);
            }
            if (customStyles.notificationBodyUnreadColor) {
                rootLiElement.style.setProperty("--dxp-c-body-unread-color-override", customStyles.notificationBodyUnreadColor);
            }
            if (customStyles.notificationDateTimeUnreadColor) {
                rootLiElement.style.setProperty("--dxp-c-age-unread-color-override", customStyles.notificationDateTimeUnreadColor);
            }
        }

        const notifRead = this.template.querySelector(".notification-read");
        if (notifRead) {
            if (customStyles.trayBodyColor) {
                notifRead.style.backgroundColor = customStyles.trayBodyColor;
            }
            const notifReadHoverOverride = customStyles.notificationHoverColor;
            if (notifReadHoverOverride) {
                rootLiElement.style.setProperty("--dxp-c-read-hover-override", notifReadHoverOverride);
            }
            if (customStyles.notificationTitleHoverColor) {
                rootLiElement.style.setProperty("--dxp-c-title-hover-color-override", customStyles.notificationTitleHoverColor);
            }
            if (customStyles.notificationBodyHoverColor) {
                rootLiElement.style.setProperty("--dxp-c-body-hover-color-override", customStyles.notificationBodyHoverColor);
            }
            if (customStyles.notificationDateTimeHoverColor) {
                rootLiElement.style.setProperty("--dxp-c-age-hover-color-override", customStyles.notificationDateTimeHoverColor);
            }

        }

        const notifMarkRead = this.template.querySelector(".notification-mark-read");
        if (notifMarkRead) {
            if (customStyles.notificationMarkReadColor) {
                notifMarkRead.style.setProperty("--dxp-c-link-hover-color-override", customStyles.notificationMarkReadColor);
            }
            if (notifRead && customStyles.notificationMarkReadUnreadColor) {
                notifMarkRead.style.setProperty("--dxp-c-link-hover-color-override", customStyles.notificationMarkReadUnreadColor);
            }
        }

        const notificationTitle = this.template.querySelector(".notification-text-title");
        if (notificationTitle) {
            if (customStyles.notificationTitleColor) {
                notificationTitle.style.color = customStyles.notificationTitleColor;
            }
            if(customStyles.notificationTitleUnreadColor && this._notification.read === false) {
                notificationTitle.style.color = customStyles.notificationTitleUnreadColor;
            }
            if (customStyles.notificationTitleTextStyle) {
                switch (customStyles.notificationTitleTextStyle) {
                    case "none":
                        notificationTitle.style.fontFamily = "inherit";
                        notificationTitle.style.fontStyle = "inherit";
                        notificationTitle.style.fontWeight = "var(--lwc-fontWeightBoldFallback)";
                        notificationTitle.style.textDecoration = "inherit";
                        break;
                    case "Heading1":
                        notificationTitle.style.fontFamily = "var(--dxp-s-text-heading-extra-large-font-family)";
                        notificationTitle.style.fontStyle = "var(--dxp-s-text-heading-extra-large-font-style)";
                        notificationTitle.style.fontWeight = "var(--dxp-s-text-heading-extra-large-font-weight)";
                        notificationTitle.style.textDecoration = "var(--dxp-s-text-heading-extra-large-text-decoration)";
                        notificationTitle.style.fontSize = "var(--dxp-s-text-heading-extra-large-font-size)";
                        break;
                    case "Heading2":
                        notificationTitle.style.fontFamily = "var(--dxp-s-text-heading-large-font-family)";
                        notificationTitle.style.fontStyle = "var(--dxp-s-text-heading-large-font-style)";
                        notificationTitle.style.fontWeight = "var(--dxp-s-text-heading-large-font-weight)";
                        notificationTitle.style.textDecoration = "var(--dxp-s-text-heading-large-text-decoration)";
                        notificationTitle.style.fontSize = "var(--dxp-s-text-heading-large-font-size)";
                        break;
                    case "Heading3":
                        notificationTitle.style.fontFamily = "var(--dxp-s-text-heading-medium-font-family)";
                        notificationTitle.style.fontStyle = "var(--dxp-s-text-heading-medium-font-style)";
                        notificationTitle.style.fontWeight = "var(--dxp-s-text-heading-medium-font-weight)";
                        notificationTitle.style.textDecoration = "var(--dxp-s-text-heading-medium-text-decoration)";
                        notificationTitle.style.fontSize = "var(--dxp-s-text-heading-medium-font-size)";
                        break;
                    case "Heading4":
                        notificationTitle.style.fontFamily = "var(--dxp-s-text-heading-small-font-family)";
                        notificationTitle.style.fontStyle = "var(--dxp-s-text-heading-small-font-style)";
                        notificationTitle.style.fontWeight = "var(--dxp-s-text-heading-small-font-weight)";
                        notificationTitle.style.textDecoration = "var(--dxp-s-text-heading-small-text-decoration)";
                        notificationTitle.style.fontSize = "var(--dxp-s-text-heading-small-font-size)";
                        break;
                    case "Paragraph1":
                        notificationTitle.style.fontFamily = "var(--dxp-s-body-font-family)";
                        notificationTitle.style.fontStyle = "var(--dxp-s-body-font-style)";
                        notificationTitle.style.fontWeight = "var(--dxp-s-body-font-weight)";
                        notificationTitle.style.textDecoration = "var(--dxp-s-body-text-decoration)";
                        notificationTitle.style.fontSize = "var(--dxp-s-text-body-font-size)";
                        break;
                    case "Paragraph2":
                        notificationTitle.style.fontFamily = "var(--dxp-s-body-small-font-family)";
                        notificationTitle.style.fontStyle = "var(--dxp-s-body-small-font-style)";
                        notificationTitle.style.fontWeight = "var(--dxp-s-body-small-font-weight)";
                        notificationTitle.style.textDecoration = "var(--dxp-s-body-small-text-decoration)";
                        notificationTitle.style.fontSize = "var(--dxp-s-text-body-small-font-size)";
                        break;
                    default:
                        // do nothing
                }
            }
        }
    }

    handleBodyCustomStyles(customStyles) {
        const notificationBody = this.template.querySelector(".notification-text");
        if (notificationBody) {
            if (customStyles.notificationBodyColor) {
                notificationBody.style.color = customStyles.notificationBodyColor;
            }
            if(customStyles.notificationBodyUnreadColor && this._notification.read === false) {
                notificationBody.style.color = customStyles.notificationBodyUnreadColor;
            }
            if (customStyles.notificationBodyTextStyle) {
                switch (customStyles.notificationBodyTextStyle) {
                    case "none":
                        notificationBody.style.fontFamily = "inherit";
                        notificationBody.style.fontStyle = "inherit";
                        notificationBody.style.fontWeight = "var(--lwc-fontWeightRegularFallback)";
                        notificationBody.style.textDecoration = "inherit";
                        break;
                    case "Heading1":
                        notificationBody.style.fontFamily = "var(--dxp-s-text-heading-extra-large-font-family)";
                        notificationBody.style.fontStyle = "var(--dxp-s-text-heading-extra-large-font-style)";
                        notificationBody.style.fontWeight = "var(--dxp-s-text-heading-extra-large-font-weight)";
                        notificationBody.style.textDecoration = "var(--dxp-s-text-heading-extra-large-text-decoration)";
                        notificationBody.style.fontSize = "var(--dxp-s-text-heading-extra-large-font-size)";
                        break;
                    case "Heading2":
                        notificationBody.style.fontFamily = "var(--dxp-s-text-heading-large-font-family)";
                        notificationBody.style.fontStyle = "var(--dxp-s-text-heading-large-font-style)";
                        notificationBody.style.fontWeight = "var(--dxp-s-text-heading-large-font-weight)";
                        notificationBody.style.textDecoration = "var(--dxp-s-text-heading-large-text-decoration)";
                        notificationBody.style.fontSize = "var(--dxp-s-text-heading-large-font-size)";
                        break;
                    case "Heading3":
                        notificationBody.style.fontFamily = "var(--dxp-s-text-heading-medium-font-family)";
                        notificationBody.style.fontStyle = "var(--dxp-s-text-heading-medium-font-style)";
                        notificationBody.style.fontWeight = "var(--dxp-s-text-heading-medium-font-weight)";
                        notificationBody.style.textDecoration = "var(--dxp-s-text-heading-medium-text-decoration)";
                        notificationBody.style.fontSize = "var(--dxp-s-text-heading-medium-font-size)";
                        break;
                    case "Heading4":
                        notificationBody.style.fontFamily = "var(--dxp-s-text-heading-small-font-family)";
                        notificationBody.style.fontStyle = "var(--dxp-s-text-heading-small-font-style)";
                        notificationBody.style.fontWeight = "var(--dxp-s-text-heading-small-font-weight)";
                        notificationBody.style.textDecoration = "var(--dxp-s-text-heading-small-text-decoration)";
                        notificationBody.style.fontSize = "var(--dxp-s-text-heading-small-font-size)";
                        break;
                    case "Paragraph1":
                        notificationBody.style.fontFamily = "var(--dxp-s-body-font-family)";
                        notificationBody.style.fontStyle = "var(--dxp-s-body-font-style)";
                        notificationBody.style.fontWeight = "var(--dxp-s-body-font-weight)";
                        notificationBody.style.textDecoration = "var(--dxp-s-body-text-decoration)";
                        notificationBody.style.fontSize = "var(--dxp-s-text-body-font-size)";
                        break;
                    case "Paragraph2":
                        notificationBody.style.fontFamily = "var(--dxp-s-body-small-font-family)";
                        notificationBody.style.fontStyle = "var(--dxp-s-body-small-font-style)";
                        notificationBody.style.fontWeight = "var(--dxp-s-body-small-font-weight)";
                        notificationBody.style.textDecoration = "var(--dxp-s-body-small-text-decoration)";
                        notificationBody.style.fontSize = "var(--dxp-s-text-body-small-font-size)";
                        break;
                    default:
                        // do nothing
                }
            }
        }
    }

    handleDateTimeCustomStyles(customStyles) {
        const notificationDateTime = this.template.querySelector(".notification-age");
        if (notificationDateTime) {
            if (customStyles.notificationDateTimeColor) {
                notificationDateTime.style.color = customStyles.notificationDateTimeColor;
            }
            if(customStyles.notificationDateTimeUnreadColor && this._notification.read === false) {
                notificationDateTime.style.color = customStyles.notificationDateTimeUnreadColor;
            }
            if (customStyles.notificationDateTimeTextStyle) {
                switch (customStyles.notificationDateTimeTextStyle) {
                    case "none":
                        notificationDateTime.style.fontFamily = "inherit";
                        notificationDateTime.style.fontStyle = "inherit";
                        notificationDateTime.style.fontWeight = "inherit";
                        notificationDateTime.style.textDecoration = "inherit";
                        break;
                    case "Heading1":
                        notificationDateTime.style.fontFamily = "var(--dxp-s-text-heading-extra-large-font-family)";
                        notificationDateTime.style.fontStyle = "var(--dxp-s-text-heading-extra-large-font-style)";
                        notificationDateTime.style.fontWeight = "var(--dxp-s-text-heading-extra-large-font-weight)";
                        notificationDateTime.style.textDecoration = "var(--dxp-s-text-heading-extra-large-text-decoration)";
                        notificationDateTime.style.fontSize = "var(--dxp-s-text-heading-extra-large-font-size)";
                        break;
                    case "Heading2":
                        notificationDateTime.style.fontFamily = "var(--dxp-s-text-heading-large-font-family)";
                        notificationDateTime.style.fontStyle = "var(--dxp-s-text-heading-large-font-style)";
                        notificationDateTime.style.fontWeight = "var(--dxp-s-text-heading-large-font-weight)";
                        notificationDateTime.style.textDecoration = "var(--dxp-s-text-heading-large-text-decoration)";
                        notificationDateTime.style.fontSize = "var(--dxp-s-text-heading-large-font-size)";
                        break;
                    case "Heading3":
                        notificationDateTime.style.fontFamily = "var(--dxp-s-text-heading-medium-font-family)";
                        notificationDateTime.style.fontStyle = "var(--dxp-s-text-heading-medium-font-style)";
                        notificationDateTime.style.fontWeight = "var(--dxp-s-text-heading-medium-font-weight)";
                        notificationDateTime.style.textDecoration = "var(--dxp-s-text-heading-medium-text-decoration)";
                        notificationDateTime.style.fontSize = "var(--dxp-s-text-heading-medium-font-size)";
                        break;
                    case "Heading4":
                        notificationDateTime.style.fontFamily = "var(--dxp-s-text-heading-small-font-family)";
                        notificationDateTime.style.fontStyle = "var(--dxp-s-text-heading-small-font-style)";
                        notificationDateTime.style.fontWeight = "var(--dxp-s-text-heading-small-font-weight)";
                        notificationDateTime.style.textDecoration = "var(--dxp-s-text-heading-small-text-decoration)";
                        notificationDateTime.style.fontSize = "var(--dxp-s-text-heading-small-font-size)";
                        break;
                    case "Paragraph1":
                        notificationDateTime.style.fontFamily = "var(--dxp-s-body-font-family)";
                        notificationDateTime.style.fontStyle = "var(--dxp-s-body-font-style)";
                        notificationDateTime.style.fontWeight = "var(--dxp-s-body-font-weight)";
                        notificationDateTime.style.textDecoration = "var(--dxp-s-body-text-decoration)";
                        notificationDateTime.style.fontSize = "var(--dxp-s-text-body-font-size)";
                        break;
                    case "Paragraph2":
                        notificationDateTime.style.fontFamily = "var(--dxp-s-body-small-font-family)";
                        notificationDateTime.style.fontStyle = "var(--dxp-s-body-small-font-style)";
                        notificationDateTime.style.fontWeight = "var(--dxp-s-body-small-font-weight)";
                        notificationDateTime.style.textDecoration = "var(--dxp-s-body-small-text-decoration)";
                        notificationDateTime.style.fontSize = "var(--dxp-s-text-body-small-font-size)";
                        break;
                    default:
                        // do nothing
                }
            }
        }
    }


    handleMarkReadCustomStyles(customStyles) {
        const notificationMarkRead = this.template.querySelector(".notification-mark-read");
        if (notificationMarkRead) {
            if (customStyles.notificationMarkReadColor) {
                notificationMarkRead.style.color = customStyles.notificationMarkReadColor;
            }
            if(customStyles.notificationMarkReadUnreadColor && this._notification.read === false) {
                notificationMarkRead.style.color = customStyles.notificationMarkReadUnreadColor;
            }
            if (customStyles.notificationMarkReadTextStyle) {
                switch (customStyles.notificationMarkReadTextStyle) {
                    case "none":
                        notificationMarkRead.style.fontFamily = "inherit";
                        notificationMarkRead.style.fontStyle = "inherit";
                        notificationMarkRead.style.fontWeight = "inherit";
                        notificationMarkRead.style.textDecoration = "inherit";
                        break;
                    case "Heading1":
                        notificationMarkRead.style.fontFamily = "var(--dxp-s-text-heading-extra-large-font-family)";
                        notificationMarkRead.style.fontStyle = "var(--dxp-s-text-heading-extra-large-font-style)";
                        notificationMarkRead.style.fontWeight = "var(--dxp-s-text-heading-extra-large-font-weight)";
                        notificationMarkRead.style.textDecoration = "var(--dxp-s-text-heading-extra-large-text-decoration)";
                        notificationMarkRead.style.fontSize = "var(--dxp-s-text-heading-extra-large-font-size)";
                        break;
                    case "Heading2":
                        notificationMarkRead.style.fontFamily = "var(--dxp-s-text-heading-large-font-family)";
                        notificationMarkRead.style.fontStyle = "var(--dxp-s-text-heading-large-font-style)";
                        notificationMarkRead.style.fontWeight = "var(--dxp-s-text-heading-large-font-weight)";
                        notificationMarkRead.style.textDecoration = "var(--dxp-s-text-heading-large-text-decoration)";
                        notificationMarkRead.style.fontSize = "var(--dxp-s-text-heading-large-font-size)";
                        break;
                    case "Heading3":
                        notificationMarkRead.style.fontFamily = "var(--dxp-s-text-heading-medium-font-family)";
                        notificationMarkRead.style.fontStyle = "var(--dxp-s-text-heading-medium-font-style)";
                        notificationMarkRead.style.fontWeight = "var(--dxp-s-text-heading-medium-font-weight)";
                        notificationMarkRead.style.textDecoration = "var(--dxp-s-text-heading-medium-text-decoration)";
                        notificationMarkRead.style.fontSize = "var(--dxp-s-text-heading-medium-font-size)";
                        break;
                    case "Heading4":
                        notificationMarkRead.style.fontFamily = "var(--dxp-s-text-heading-small-font-family)";
                        notificationMarkRead.style.fontStyle = "var(--dxp-s-text-heading-small-font-style)";
                        notificationMarkRead.style.fontWeight = "var(--dxp-s-text-heading-small-font-weight)";
                        notificationMarkRead.style.textDecoration = "var(--dxp-s-text-heading-small-text-decoration)";
                        notificationMarkRead.style.fontSize = "var(--dxp-s-text-heading-small-font-size)";
                        break;
                    case "Paragraph1":
                        notificationMarkRead.style.fontFamily = "var(--dxp-s-body-font-family)";
                        notificationMarkRead.style.fontStyle = "var(--dxp-s-body-font-style)";
                        notificationMarkRead.style.fontWeight = "var(--dxp-s-body-font-weight)";
                        notificationMarkRead.style.textDecoration = "var(--dxp-s-body-text-decoration)";
                        notificationMarkRead.style.fontSize = "var(--dxp-s-text-body-font-size)";
                        break;
                    case "Paragraph2":
                        notificationMarkRead.style.fontFamily = "var(--dxp-s-body-small-font-family)";
                        notificationMarkRead.style.fontStyle = "var(--dxp-s-body-small-font-style)";
                        notificationMarkRead.style.fontWeight = "var(--dxp-s-body-small-font-weight)";
                        notificationMarkRead.style.textDecoration = "var(--dxp-s-body-small-text-decoration)";
                        notificationMarkRead.style.fontSize = "var(--dxp-s-text-body-small-font-size)";
                        break;
                    default:
                        // do nothing
                }
            }
        }
    }



}