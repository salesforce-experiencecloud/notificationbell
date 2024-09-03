/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";

import basepath from '@salesforce/community/basePath';

/* Labels */ /*
import NOTIFICATION_MAX_COUNT_EXCEEDED from "@salesforce/label/Notifications.NotificationMaxCountExceeded";
import UNSEEN_NOTIFICATIONS from "@salesforce/label/NotificationsClient.unseenNotifications";
*/ 

const NOTIFICATION_MAX_COUNT_EXCEEDED = 'Max number of notifications exceeded.';
const UNSEEN_NOTIFICATIONS = 'Unseen Notifications';

export default class NotificationsIcon extends LightningElement {
    _counterLabel = "";
    _count = 0;
    _customStyles = {};

    renderedCallback() {
        const customStyles = this._customStyles;
        const buttonIcon = this.template.querySelector(".buttonIcon");
        if (customStyles) {
            if (customStyles.size) {
                if (buttonIcon) {
                    buttonIcon.style.setProperty("--dxp-c-icon-size", `${customStyles.size}px`);
                    buttonIcon.style.setProperty("--dxp-c-button-size", `${customStyles.size + 24}px`);
                }
            }
            if (customStyles.counterColor || customStyles.counterNumberColor) {
                const counterElement = this.template.querySelector(".countDot");
                if (counterElement) {
                    counterElement.style.backgroundColor = this._customStyles.counterColor;
                    this.template.querySelector(".counterLabel").style.color = this._customStyles.counterNumberColor;
                }
            }
            const defaultIconElement = this.template.querySelector(".defaultIcon");
            if (defaultIconElement) {
                defaultIconElement.style.color = (customStyles.defaultIconColor) ? customStyles.defaultIconColor
                    : "var(--dxp-g-neutral-2)";
                if (customStyles.iconHoverColor) {
                    buttonIcon.style.setProperty("--dxp-c-user-override-hover", customStyles.iconHoverColor);
                }
                if (customStyles.iconFocusColor) {
                    buttonIcon.style.setProperty("--dxp-c-user-override-focus", customStyles.iconFocusColor);
                }
                if (customStyles.iconActiveColor) {
                    buttonIcon.style.setProperty("--dxp-c-user-override-active", customStyles.iconActiveColor);
                }
            }
        }
    }

    @api get defaultNotificationIconUrl() {
        return basepath + '/assets/icons/utility-sprite/svg/symbols.svg#notification';
    }

    @api get customStyles() {
        return this._customStyles;
    }

    set customStyles(styles) {
        this._customStyles = styles;
    }

    get labels() {
        return {
            NOTIFICATION_MAX_COUNT_EXCEEDED,
            UNSEEN_NOTIFICATIONS
        };
    }

    @api get count() {
        return this._count;
    }

    set count(count) {
        this._count = count;
        this._counterLabel = count > 50 ? '50+' : String(count);
    }

    get buttonClass() {
        return "slds-button slds-button_icon " +
            "slds-global-actions__notifications slds-global-actions__item-action buttonIcon";
    }

    get countDotClass() {
        return "countDot " + (this._count === 0 ? "slds-hidden" : "");
    }

    get hasCustomImageUrl() {
        return this._customStyles.imageUrl && this._customStyles.imageUrl !== "";
    }

    get unseenNotificationsLabel() {
        return this.labels.UNSEEN_NOTIFICATIONS.replace("{0}", this._count);
    }

    onBellIconClickHandler() {
        const toggleTrayEvent = new CustomEvent("notification_event", {
            detail: {action: "toggle_panel"},
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(toggleTrayEvent);
    }
}