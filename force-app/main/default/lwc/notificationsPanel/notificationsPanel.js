/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {LightningElement, api} from "lwc";
import formFactorPropertyName from '@salesforce/client/formFactor';

/* Labels */ 
const NO_NOTIFICATIONS_MESSAGE = 'There are no notifcations.';

export default class NotificationsPanel extends LightningElement {
    _notifications;
    _hasLoaded;
    _showError;
    _customStyles;
    _panelWidth;
    _notificationHeaderText;
    _notificationHeaderMarkAllRead;
    _notificationMarkReadText;
    _notificationMarkUnreadText;
    _notificationImageHide;
    _notificationImageOverride;
    _notificationImageOverrideUrl;

    connectedCallback() {
        if (formFactorPropertyName === "Small") {
            this._panelWidth = "93vw";
        } else {
            this._panelWidth = "432px";
        }
    }

    renderedCallback() {
        const panel = this.template.querySelector(".notificationPanel");
        if (panel) {
            panel.style.width = this._panelWidth;
        }
    }

    @api get customStyles() {
        return this._customStyles;
    }

    set customStyles(styles) {
        this._customStyles = styles;
    }

    @api get loaded() {
        return this._hasLoaded;
    }

    set loaded(hasLoaded) {
        this._hasLoaded = hasLoaded;
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
        this._notifications = notifications;
    }

    get labels() {
        return {
            NO_NOTIFICATIONS_MESSAGE
        };
    }

    get rootPanelClass() {
        if (this._customStyles && this._customStyles.bodyDropdownAlign) {
            if (this._customStyles.bodyDropdownAlign === "center") {
                return "slds-dropdown slds-dropdown_large notificationPanel";
            } else if (this._customStyles.bodyDropdownAlign === "left") {
                return "slds-dropdown slds-dropdown_large notificationPanel slds-dropdown_right";
            }
        }
        return "slds-dropdown slds-dropdown_large notificationPanel slds-dropdown_right";
    }

    get hasNotifications() {
        if (!this._notifications) {
            return false;
        }
        return (this._notifications.length > 0);
    }

    @api get showerror() {
        return this._showError;
    }

    set showerror(showerror) {
        this._showError = showerror;
    }
}