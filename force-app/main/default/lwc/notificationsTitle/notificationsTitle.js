/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {LightningElement, api} from "lwc";

/* Labels */
const TRAY_TITLE = 'Notifications';
const TRAY_MARK_ALL_READ = 'Mark All Read';
const CLOSE_PANEL = 'Close Panel';


export default class NotificationsTitle extends LightningElement {

    _notifications = [];
    _customStyles;
    _notificationHeaderText;
    _notificationHeaderMarkAllRead;

    // set up instrumentation and logging handler for this component

    renderedCallback() {
        const customStyles = this.customStyles;
        if (customStyles) {
            const titleContainer = this.template.querySelector(".titleContainer");
            if (titleContainer && customStyles.trayHeaderColor) {
                titleContainer.style.backgroundColor = customStyles.trayHeaderColor;
            }
            const titleName = this.template.querySelector(".titleName");
            if (titleName) {
                if (customStyles.notifLabelTextColor) {
                    titleName.style.color = customStyles.notifLabelTextColor;
                }
                if (customStyles.notifLabelTextStyle) {
                    switch (customStyles.notifLabelTextStyle) {
                        case "none":
                            titleName.style.fontFamily = "inherit";
                            titleName.style.fontStyle = "inherit";
                            titleName.style.fontWeight = "var(--lwc-fontWeightLightFallback)";
                            titleName.style.textDecoration = "inherit";
                            break;
                        case "Heading1":
                            titleName.style.fontFamily = "var(--dxp-s-text-heading-extra-large-font-family)";
                            titleName.style.fontStyle = "var(--dxp-s-text-heading-extra-large-font-style)";
                            titleName.style.fontWeight = "var(--dxp-s-text-heading-extra-large-font-weight)";
                            titleName.style.textDecoration = "var(--dxp-s-text-heading-extra-large-text-decoration)";
                            titleName.style.fontSize = "var(--dxp-s-text-heading-extra-large-font-size)";
                            break;
                        case "Heading2":
                            titleName.style.fontFamily = "var(--dxp-s-text-heading-large-font-family)";
                            titleName.style.fontStyle = "var(--dxp-s-text-heading-large-font-style)";
                            titleName.style.fontWeight = "var(--dxp-s-text-heading-large-font-weight)";
                            titleName.style.textDecoration = "var(--dxp-s-text-heading-large-text-decoration)";
                            titleName.style.fontSize = "var(--dxp-s-text-heading-large-font-size)";
                            break;
                        case "Heading3":
                            titleName.style.fontFamily = "var(--dxp-s-text-heading-medium-font-family)";
                            titleName.style.fontStyle = "var(--dxp-s-text-heading-medium-font-style)";
                            titleName.style.fontWeight = "var(--dxp-s-text-heading-medium-font-weight)";
                            titleName.style.textDecoration = "var(--dxp-s-text-heading-medium-text-decoration)";
                            titleName.style.fontSize = "var(--dxp-s-text-heading-medium-font-size)";
                            break;
                        case "Heading4":
                            titleName.style.fontFamily = "var(--dxp-s-text-heading-small-font-family)";
                            titleName.style.fontStyle = "var(--dxp-s-text-heading-small-font-style)";
                            titleName.style.fontWeight = "var(--dxp-s-text-heading-small-font-weight)";
                            titleName.style.textDecoration = "var(--dxp-s-text-heading-small-text-decoration)";
                            titleName.style.fontSize = "var(--dxp-s-text-heading-small-font-size)";
                            break;
                        case "Paragraph1":
                            titleName.style.fontFamily = "var(--dxp-s-body-font-family)";
                            titleName.style.fontStyle = "var(--dxp-s-body-font-style)";
                            titleName.style.fontWeight = "var(--dxp-s-body-font-weight)";
                            titleName.style.textDecoration = "var(--dxp-s-body-text-decoration)";
                            titleName.style.fontSize = "var(--dxp-s-body-font-size)";
                            break;
                        case "Paragraph2":
                            titleName.style.fontFamily = "var(--dxp-s-body-small-font-family)";
                            titleName.style.fontStyle = "var(--dxp-s-body-small-font-style)";
                            titleName.style.fontWeight = "var(--dxp-s-body-small-font-weight)";
                            titleName.style.textDecoration = "var(--dxp-s-body-small-text-decoration)";
                            titleName.style.fontSize = "var(--dxp-s-body-small-font-size)";
                            break;
                        default:
                            // do nothing
                    }
                }
            }
            const titleAction = this.template.querySelector("span.titleAction > a");
            if (titleAction) {
                if (customStyles.markAllReadTextColor) {
                    titleAction.style.color = customStyles.markAllReadTextColor;
                }
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
                            titleAction.style.fontSize = "var(--dxp-s-body-font-size)";
                            break;
                        case "Paragraph2":
                            titleAction.style.fontFamily = "var(--dxp-s-body-small-font-family)";
                            titleAction.style.fontStyle = "var(--dxp-s-body-small-font-style)";
                            titleAction.style.fontWeight = "var(--dxp-s-body-small-font-weight)";
                            titleAction.style.fontSize = "var(--dxp-s-body-small-font-size)";
                            break;
                        default:
                            // do nothing
                    }
                }
            }
        }
    }

    @api get customStyles() {
        return this._customStyles;
    }

    set customStyles(styles) {
        this._customStyles = styles;
    }

    @api get notificationHeaderText() {
        return this._notificationHeaderText;
    }

    set notificationHeaderText(notificationHeaderTextValue) {
        this._notificationHeaderText = notificationHeaderTextValue;
    }

    @api get notificationHeaderMarkAllRead() {
        return this._notificationHeaderMarkAllRead;
    }

    set notificationHeaderMarkAllRead(notificationHeaderMarkAllReadValue) {
        this._notificationHeaderMarkAllRead = notificationHeaderMarkAllReadValue;
    }

    @api get notifications() {
        return this._notifications;
    }

    set notifications(notifications) {
        this._notifications = notifications;
    }

    get hasNotifications() {
        return this._notifications.length > 0;
    }

    get labels() {
        return {
            TRAY_TITLE,
            TRAY_MARK_ALL_READ,
            CLOSE_PANEL
        };
    }

    onMarkAllAsReadClick() {
        const notificationEvent = new CustomEvent(
            "notification_event", {
                detail: {action: "mark_all_read"},
                bubbles: true,
                composed: true
            }
        );
        this.dispatchEvent(notificationEvent);
    }

    closePanel() {
        const closePanelEvent = new CustomEvent("notification_event", {
                detail: {action: "close_panel"},
                bubbles: true,
                composed: true
            }
        );
        this.dispatchEvent(closePanelEvent);
    }
}