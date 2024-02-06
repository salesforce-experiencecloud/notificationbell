/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, track, api, wire } from 'lwc';
import getDomainList from '@salesforce/apex/NotificationsTrayAdminController.getDomainList';
import getNotificationTypeList from '@salesforce/apex/NotificationsTrayAdminController.getNotificationTypeList';
import checkDomain from '@salesforce/apex/NotificationsTrayAdminController.checkDomain';
import createRemoteSite from '@salesforce/apex/NotificationsTrayAdminController.createRemoteSite';
``
const typeDelay = 500;

export default class NotificationsCpe extends LightningElement {

    @api params;

    @track bellIconAlignmentSelected = 'right';
    @track bellIconSize = 24;
    @track bellIconCounterColor = '#EA001E';
    @track bellIconCounterNumberColor = '#FFFFFF';
    @track bellIconDefaultIconColor;
    @track bellIconHoverColor;
    @track bellIconFocusColor;
    @track bellIconActiveColor;
    
    @track bodyDropdownAlignmentSelected = 'left';
    @track trayBodyColor;
    @track notificationHoverColor;
    @track notificationUnreadColor;

    @track trayHeaderColor;
    @track notifLabelTextColor;
    @track notifLabelTextStyleSelected = 'Heading2';
    @track markAllReadTextColor;
    @track markAllReadLabelTextStyleSelected = 'Paragraph1';

    @track notificationTitleColor;
    @track notificationTitleHoverColor;
    @track notificationTitleUnreadColor;
    @track notificationTitleTextStyleSelected = 'Heading3';
    @track notificationBodyColor;
    @track notificationBodyTextStyleSelected = 'Heading4';        
    @track notificationBodyHoverColor;
    @track notificationBodyUnreadColor;
    @track notificationDateTimeColor;
    @track notificationDateTimeHoverColor;
    @track notificationDateTimeUnreadColor;
    @track notificationDateTimeTextStyleSelected = 'Paragraph1';
    @track notificationMarkReadColor;
    @track notificationMarkReadUnreadColor;
    @track notificationMarkReadTextStyleSelected = 'Paragraph1';
    @track notificationImageHide = false;
    @track notificationImageOverride = false;
    @track notificationImageOverrideUrl = '/img/notificationsEmail/custom_notification.png';

    @track showModal = false;
    @track domainOptions = [{label: 'None', value: 'none'}];
    @track domainSelected = 'none';
    @track hideAddDomainButton = true;
    @track orgDomainUrl = '';

    @track customNotificationTypeOptions = [];
    @track customNotificationTypeSelected = [];

    @track notificationHeaderText = 'Notifications';
    @track notificationHeaderMarkAllRead = 'Mark All Read';
    @track notificationMarkReadText = 'Mark Read';
    @track notificationMarkUnreadText = 'Mark Unread';
    

    @wire(getDomainList)
    getDomainListWire({error, data}) {
    
        if (error) {
            
        } else if (data) {
            
            let response = JSON.parse(data);
            if(response && response.orgDomainUrl !== undefined && response.orgDomainUrl !== null && response.orgDomainUrl.trim() !== '')
            {
                this.orgDomainUrl = response.orgDomainUrl;
            }

            if(response && response.domList !== undefined && response.domList !== null && response.domList.length > 0)
            {
                this.domainOptions = [{label: 'None', value: 'none'}];
                for(let i=0;i<response.domList.length;i++)
                {
                    this.domainOptions.push({label: response.domList[i].Domain, value: response.domList[i].Domain});
                }
            }
        }
        
    }

    @wire(getNotificationTypeList)
    getNotificationTypeListWire({error, data}) {
    
        if (error) {
            
        } else if (data) {
            let response = JSON.parse(data);
            if(response && response.notificationTypeList !== undefined && response.notificationTypeList !== null && response.notificationTypeList.length > 0)
            {
                this.customNotificationTypeOptions = [];
                for(let i=0;i<response.notificationTypeList.length;i++)
                {
                    this.customNotificationTypeOptions.push({label: response.notificationTypeList[i].CustomNotifTypeName, value: response.notificationTypeList[i].Id});
                }
            }
        }
        
    }

    bellIconSizeDelayTimeout;
    notificationHeaderTextDelayTimeout;
    notificationHeaderMarkAllReadDelayTimeout;
    notificationMarkReadTextDelayTimeout;
    notificationMarkUnreadTextDelayTimeout;
    notificationImageOverrideUrlDelayTimeout;

    get remoteSiteSetupUrl() {
        return this.orgDomainUrl + '/lightning/setup/SecurityRemoteProxy/page?address=%2F0rp%3FappLayout%3Dsetup%26lsi%3D-6%26setupid%3DSecurityRemoteProxy';
    }

    get bellIconAlignmentOptions() {
        return [
            { label: 'Right', value: 'right' },
            { label: 'Center', value: 'center' },
            { label: 'Left', value: 'left' }
        ];
    }

    get textStyleOptions() {
        return [
            { label: 'None', value: 'none' },
            { label: 'Heading 1', value: 'Heading1' },
            { label: 'Heading 2', value: 'Heading2' },
            { label: 'Heading 3', value: 'Heading3' },
            { label: 'Heading 4', value: 'Heading4' },
            { label: 'Paragraph 1', value: 'Paragraph1' },
            { label: 'Paragraph 2', value: 'Paragraph2' }
        ];        
    }

    get modalClass() {
        let classNames = 'slds-modal  slds-modal_' + this.size + ' slds-fade-in-open';
        return classNames;
    }

    get displayBackdrop() {
        return this.showModal;
    }

    get iconUrl() {
        return '/assets/icons/utility-sprite/svg/symbols.svg#close';
    }

    @api
    get showDomainSuccessMsg() {
        return this.hideAddDomainButton === true && this.domainSelected !== undefined && this.domainSelected !== null && this.domainSelected.trim() !== '' && this.domainSelected.trim() !== 'none';
    }

    @api
    get showDomainWarningMsg() {
        return this.domainSelected === undefined || this.domainSelected === null || this.domainSelected.trim() === '' || this.domainSelected.trim() === 'none';
    }

    @api
    get value() {
        return this._value;
    }

    set value(value) {

        let valuetmp = JSON.parse(value);
        let isValueUndefined = this._value === undefined;
        this._value = {};

        this.domainSelected =  valuetmp?.domainConfig?.domain;
        this.domainSelected = (this.domainSelected !== undefined && this.domainSelected !== null && this.domainSelected.trim() !== '') ? this.domainSelected : 'none' ;


        let domainSelectedEl = this.template.querySelector('.domain');
        if(domainSelectedEl !== undefined && domainSelectedEl !== null) 
        {
            domainSelectedEl.value = this.domainSelected;
            if(isValueUndefined)
            {
                this.checkSelectedDomainInRemoteSites();
            }
        }

        this.customNotificationTypeSelected =  valuetmp?.generalNotificationConfig?.customNotificationType?.split(',');
        this.customNotificationTypeSelected = (this.customNotificationTypeSelected !== undefined && this.customNotificationTypeSelected !== null && this.customNotificationTypeSelected.length > 0) ? this.customNotificationTypeSelected : [] ;


        let customNotificationTypeSelectedEl = this.template.querySelector('.customNotificationType');
        if(customNotificationTypeSelectedEl !== undefined && customNotificationTypeSelectedEl !== null) 
        {
            customNotificationTypeSelectedEl.value = this.customNotificationTypeSelected;
        }

        //Bell Icon Config
        //this.debugMode = (valuetmp?.generalConfig?.debugMode !== undefined && valuetmp?.generalConfig?.debugMode !== null) ? valuetmp?.generalConfig?.debugMode : false;
        this.bellIconAlignmentSelected =  valuetmp?.bellIcon?.alignment;
        this.bellIconAlignmentSelected = (this.bellIconAlignmentSelected !== undefined && this.bellIconAlignmentSelected !== null && this.bellIconAlignmentSelected.trim() !== '') ? this.bellIconAlignmentSelected : 'right' ;

        let bellIconAlignmentEl = this.template.querySelector('.bellIconAlignment');
        if(bellIconAlignmentEl !== undefined && bellIconAlignmentEl !== null) 
        {
            bellIconAlignmentEl.value = this.bellIconAlignmentSelected;
        }

        this.bellIconSize =  valuetmp?.bellIcon?.size;
        this.bellIconCounterColor =  valuetmp?.bellIcon?.counterColor;
        this.bellIconCounterNumberColor =  valuetmp?.bellIcon?.counterNumberColor;
        this.bellIconDefaultIconColor = valuetmp?.bellIcon?.defaultIconColor;
        this.bellIconHoverColor = valuetmp?.bellIcon?.iconHoverColor;
        this.bellIconFocusColor = valuetmp?.bellIcon?.iconFocusColor;
        this.bellIconActiveColor = valuetmp?.bellIcon?.iconActiveColor;

        this.bodyDropdownAlignmentSelected =  valuetmp?.panelBody?.bodyDropdownAlign;
        this.bodyDropdownAlignmentSelected = (this.bodyDropdownAlignmentSelected !== undefined && this.bodyDropdownAlignmentSelected !== null && this.bodyDropdownAlignmentSelected.trim() !== '') ? this.bodyDropdownAlignmentSelected : 'left' ;

        let bodyDropdownAlignmentEl = this.template.querySelector('.bodyDropdownAlignment');
        if(bodyDropdownAlignmentEl !== undefined && bodyDropdownAlignmentEl !== null) 
        {
            bodyDropdownAlignmentEl.value = this.bodyDropdownAlignmentSelected;
        }

        this.trayBodyColor = valuetmp?.panelBody?.trayBodyColor;
        this.notificationHoverColor = valuetmp?.panelBody?.notificationHoverColor;
        this.notificationUnreadColor = valuetmp?.panelBody?.notificationUnreadColor;


        this.trayHeaderColor = valuetmp?.panelHeader?.trayHeaderColor;
        this.notifLabelTextColor = valuetmp?.panelHeader?.notifLabelTextColor;
        this.notifLabelTextStyleSelected =  valuetmp?.panelHeader?.notifLabelTextStyle;
        this.notifLabelTextStyleSelected = (this.notifLabelTextStyleSelected !== undefined && this.notifLabelTextStyleSelected !== null && this.notifLabelTextStyleSelected.trim() !== '') ? this.notifLabelTextStyleSelected : 'Heading2' ;

        let notifLabelTextStyleEl = this.template.querySelector('.notifLabelTextStyle');
        if(notifLabelTextStyleEl !== undefined && notifLabelTextStyleEl !== null) 
        {
            notifLabelTextStyleEl.value = this.notifLabelTextStyleSelected;
        }

        this.markAllReadTextColor = valuetmp?.panelHeader?.markAllReadTextColor;
        this.markAllReadLabelTextStyleSelected =  valuetmp?.panelHeader?.markAllReadLabelTextStyle;
        this.markAllReadLabelTextStyleSelected = (this.markAllReadLabelTextStyleSelected !== undefined && this.markAllReadLabelTextStyleSelected !== null && this.markAllReadLabelTextStyleSelected.trim() !== '') ? this.markAllReadLabelTextStyleSelected : 'Paragraph1' ;

        let markAllReadLabelTextStyleEl = this.template.querySelector('.markAllReadLabelTextStyle');
        if(markAllReadLabelTextStyleEl !== undefined && markAllReadLabelTextStyleEl !== null) 
        {
            markAllReadLabelTextStyleEl.value = this.markAllReadLabelTextStyleSelected;
        }



        this.notificationTitleColor = valuetmp?.notification?.notificationTitleColor;
        this.notificationTitleHoverColor = valuetmp?.notification?.notificationTitleHoverColor;
        this.notificationTitleUnreadColor = valuetmp?.notification?.notificationTitleUnreadColor;

        this.notificationTitleTextStyleSelected =  valuetmp?.notification?.notificationTitleTextStyle;
        this.notificationTitleTextStyleSelected = (this.notificationTitleTextStyleSelected !== undefined && this.notificationTitleTextStyleSelected !== null && this.notificationTitleTextStyleSelected.trim() !== '') ? this.notificationTitleTextStyleSelected : 'Heading3' ;

        let notificationTitleTextStyleEl = this.template.querySelector('.notificationTitleTextStyle');
        if(notificationTitleTextStyleEl !== undefined && notificationTitleTextStyleEl !== null) 
        {
            notificationTitleTextStyleEl.value = this.notificationTitleTextStyleSelected;
        }



        this.notificationBodyColor = valuetmp?.notification?.notificationBodyColor;
        this.notificationBodyHoverColor = valuetmp?.notification?.notificationBodyHoverColor;
        this.notificationBodyUnreadColor = valuetmp?.notification?.notificationBodyUnreadColor;

        this.notificationBodyTextStyleSelected =  valuetmp?.notification?.notificationBodyTextStyle;
        this.notificationBodyTextStyleSelected = (this.notificationBodyTextStyleSelected !== undefined && this.notificationBodyTextStyleSelected !== null && this.notificationBodyTextStyleSelected.trim() !== '') ? this.notificationBodyTextStyleSelected : 'Heading4' ;

        let notificationBodyTextStyleEl = this.template.querySelector('.notificationBodyTextStyle');
        if(notificationBodyTextStyleEl !== undefined && notificationBodyTextStyleEl !== null) 
        {
            notificationBodyTextStyleEl.value = this.notificationBodyTextStyleSelected;
        }



        this.notificationDateTimeColor = valuetmp?.notification?.notificationDateTimeColor;
        this.notificationDateTimeHoverColor = valuetmp?.notification?.notificationDateTimeHoverColor;
        this.notificationDateTimeUnreadColor = valuetmp?.notification?.notificationDateTimeUnreadColor;

        this.notificationDateTimeTextStyleSelected =  valuetmp?.notification?.notificationDateTimeTextStyle;
        this.notificationDateTimeTextStyleSelected = (this.notificationDateTimeTextStyleSelected !== undefined && this.notificationDateTimeTextStyleSelected !== null && this.notificationDateTimeTextStyleSelected.trim() !== '') ? this.notificationDateTimeTextStyleSelected : 'Paragraph1' ;

        let notificationDateTimeTextStyleEl = this.template.querySelector('.notificationDateTimeTextStyle');
        if(notificationDateTimeTextStyleEl !== undefined && notificationDateTimeTextStyleEl !== null) 
        {
            notificationDateTimeTextStyleEl.value = this.notificationDateTimeTextStyleSelected;
        }



        this.notificationMarkReadColor = valuetmp?.notification?.notificationMarkReadColor;
        this.notificationMarkReadUnreadColor = valuetmp?.notification?.notificationMarkReadUnreadColor;

        this.notificationMarkReadTextStyleSelected =  valuetmp?.notification?.notificationMarkReadTextStyle;
        this.notificationMarkReadTextStyleSelected = (this.notificationMarkReadTextStyleSelected !== undefined && this.notificationMarkReadTextStyleSelected !== null && this.notificationMarkReadTextStyleSelected.trim() !== '') ? this.notificationMarkReadTextStyleSelected : 'Paragraph1' ;

        let notificationMarkReadTextStyleEl = this.template.querySelector('.notificationMarkReadTextStyle');
        if(notificationMarkReadTextStyleEl !== undefined && notificationMarkReadTextStyleEl !== null) 
        {
            notificationMarkReadTextStyleEl.value = this.notificationMarkReadTextStyleSelected;
        }


        this.notificationHeaderText =  valuetmp?.panelHeader?.notificationHeaderText;
        this.notificationHeaderText = (this.notificationHeaderText !== undefined && this.notificationHeaderText !== null && this.notificationHeaderText.trim() !== '') ? this.notificationHeaderText : 'Notifications';
        
        this.notificationHeaderMarkAllRead =  valuetmp?.panelHeader?.notificationHeaderMarkAllRead;
        this.notificationHeaderMarkAllRead = (this.notificationHeaderMarkAllRead !== undefined && this.notificationHeaderMarkAllRead !== null && this.notificationHeaderMarkAllRead.trim() !== '') ? this.notificationHeaderMarkAllRead : 'Mark All Read';

        this.notificationMarkReadText =  valuetmp?.notification?.notificationMarkReadText;
        this.notificationMarkReadText = (this.notificationMarkReadText !== undefined && this.notificationMarkReadText !== null && this.notificationMarkReadText.trim() !== '') ? this.notificationMarkReadText : 'Mark Read';

        this.notificationMarkUnreadText =  valuetmp?.notification?.notificationMarkUnreadText;
        this.notificationMarkUnreadText = (this.notificationMarkUnreadText !== undefined && this.notificationMarkUnreadText !== null && this.notificationMarkUnreadText.trim() !== '') ? this.notificationMarkUnreadText : 'Mark Unread';

        this.notificationImageHide =  valuetmp?.notification?.notificationImageHide;
        this.notificationImageHide = (this.notificationImageHide !== undefined && this.notificationImageHide !== null) ? this.notificationImageHide : false;
        
        this.notificationImageOverride =  valuetmp?.notification?.notificationImageOverride;
        this.notificationImageOverride = (this.notificationImageOverride !== undefined && this.notificationImageOverride !== null) ? this.notificationImageOverride : false;

        this.notificationImageOverrideUrl =  valuetmp?.notification?.notificationImageOverrideUrl;
        this.notificationImageOverrideUrl = (this.notificationImageOverrideUrl !== undefined && this.notificationImageOverrideUrl !== null && this.notificationImageOverrideUrl.trim() !== '') ? this.notificationImageOverrideUrl : '/img/notificationsEmail/custom_notification.png';


        this._value = value;

    }

    validateValues() {

        this.displayInputError('.bellIconSize', '');
        this.displayInputError('.domain','');
        this.displayInputError('.notificationImageOverrideUrl','');

        let isBellIconSizeValid = true, isDomainValid = true, isNotificationImageOverrideUrlValid = true;
        let isBellIconSizeError = '', isDomainError = '', isNotificationImageOverrideUrlError = '';
        try {
            this.bellIconSize = parseInt(this.bellIconSize);
        } catch(e) {
            isBellIconSizeValid = false;
            isBellIconSizeError = 'Please enter a valid number.';
        }

        if(this.domainSelected === undefined || this.domainSelected === null || this.domainSelected.trim() === '' || this.domainSelected.trim() === 'none')
        {
            isDomainValid = false;
            isDomainError = 'Please select your site\'s domain.';
        }

        if(this.notificationImageOverride === true && (this.notificationImageOverrideUrl === undefined || this.notificationImageOverrideUrl === null || this.notificationImageOverrideUrl.trim() === '') )
        {
            isNotificationImageOverrideUrlValid = false;
            isNotificationImageOverrideUrlError = 'Please enter a notification image url.';
        }
       
        if(isBellIconSizeValid === true && isDomainValid === true && isNotificationImageOverrideUrlValid === true)
        {
            this.buildAndPublishValue(); 
        }
        else 
        {
            
            if(isBellIconSizeValid === false)
            {
                this.displayInputError('.bellIconSize', isBellIconSizeError);
            }

            if(isDomainValid === false)
            {
                this.displayInputError('.domain', isDomainError);
            }

            if(isNotificationImageOverrideUrlValid === false)
            {
                this.displayInputError('.notificationImageOverrideUrl', isNotificationImageOverrideUrlError);
            }

        }

    }

    displayInputError(identifier, text)
    {

        let inputCmp = this.template.querySelector(identifier);
        if(inputCmp !== undefined && inputCmp !== null)
        {
            inputCmp.setCustomValidity('');
            inputCmp.reportValidity();

            inputCmp.setCustomValidity(text);
            inputCmp.reportValidity();
        }
    }

    buildAndPublishValue()
    {
        let tmpvalue = {};
        //domainConfig
        tmpvalue.domainConfig = {};
        tmpvalue.domainConfig.domain = this.domainSelected;

        //generalNotificationConfig
        tmpvalue.generalNotificationConfig = {};
        tmpvalue.generalNotificationConfig.customNotificationType = this.customNotificationTypeSelected?.join(',');

        //generalConfig 
        tmpvalue.bellIcon = {};
        tmpvalue.bellIcon.alignment = this.bellIconAlignmentSelected;
        tmpvalue.bellIcon.size = this.bellIconSize;
        tmpvalue.bellIcon.counterColor = this.bellIconCounterColor;
        tmpvalue.bellIcon.counterNumberColor = this.bellIconCounterNumberColor;
        tmpvalue.bellIcon.defaultIconColor = this.bellIconDefaultIconColor;
        tmpvalue.bellIcon.iconHoverColor = this.bellIconHoverColor;
        tmpvalue.bellIcon.iconFocusColor = this.bellIconFocusColor;
        tmpvalue.bellIcon.iconActiveColor = this.bellIconActiveColor;

        tmpvalue.panelBody = {};
        tmpvalue.panelBody.bodyDropdownAlign = this.bodyDropdownAlignmentSelected;
        tmpvalue.panelBody.trayBodyColor = this.trayBodyColor;
        tmpvalue.panelBody.notificationHoverColor = this.notificationHoverColor;
        tmpvalue.panelBody.notificationUnreadColor = this.notificationUnreadColor;

        tmpvalue.panelHeader = {};
        tmpvalue.panelHeader.trayHeaderColor = this.trayHeaderColor;
        tmpvalue.panelHeader.notifLabelTextColor = this.notifLabelTextColor;
        tmpvalue.panelHeader.notifLabelTextStyle = this.notifLabelTextStyleSelected;
        tmpvalue.panelHeader.markAllReadTextColor = this.markAllReadTextColor;
        tmpvalue.panelHeader.markAllReadLabelTextStyle = this.markAllReadLabelTextStyleSelected;
        tmpvalue.panelHeader.notificationHeaderMarkAllRead = this.notificationHeaderMarkAllRead;
        tmpvalue.panelHeader.notificationHeaderText = this.notificationHeaderText;


        tmpvalue.notification = {};
        tmpvalue.notification.notificationTitleColor = this.notificationTitleColor;
        tmpvalue.notification.notificationTitleHoverColor = this.notificationTitleHoverColor;
        tmpvalue.notification.notificationTitleUnreadColor = this.notificationTitleUnreadColor;
        tmpvalue.notification.notificationTitleTextStyle = this.notificationTitleTextStyleSelected;
        tmpvalue.notification.notificationBodyColor = this.notificationBodyColor;
        tmpvalue.notification.notificationBodyHoverColor = this.notificationBodyHoverColor;
        tmpvalue.notification.notificationBodyUnreadColor = this.notificationBodyUnreadColor;
        tmpvalue.notification.notificationBodyTextStyle = this.notificationBodyTextStyleSelected;
        tmpvalue.notification.notificationDateTimeColor = this.notificationDateTimeColor;
        tmpvalue.notification.notificationDateTimeHoverColor = this.notificationDateTimeHoverColor;
        tmpvalue.notification.notificationDateTimeUnreadColor = this.notificationDateTimeUnreadColor;
        tmpvalue.notification.notificationDateTimeTextStyle = this.notificationDateTimeTextStyleSelected;
        tmpvalue.notification.notificationMarkReadColor = this.notificationMarkReadColor;
        tmpvalue.notification.notificationMarkReadUnreadColor = this.notificationMarkReadUnreadColor;
        tmpvalue.notification.notificationMarkReadTextStyle = this.notificationMarkReadTextStyleSelected;
        tmpvalue.notification.notificationMarkReadText = this.notificationMarkReadText;
        tmpvalue.notification.notificationMarkUnreadText = this.notificationMarkUnreadText;
        tmpvalue.notification.notificationImageHide = this.notificationImageHide;
        tmpvalue.notification.notificationImageOverride = this.notificationImageOverride;
        tmpvalue.notification.notificationImageOverrideUrl = this.notificationImageOverrideUrl;
        




        this.value = JSON.stringify(tmpvalue);

        this.dispatchEvent(new CustomEvent("valuechange", 
        {detail: {value: this.value}}));
    }

    handleClose() {
        this.showModal = false;
    }

    handleOpen() {
        this.showModal = true;
    }

    handleBellIconAlignmentChange(e) {
        this.bellIconAlignmentSelected = e.detail.value;
        this.validateValues();
    }

    handleBellIconCounterColorChange(e) {
        
        this.bellIconCounterColor = e.detail.value;
        this.validateValues();
    }

    handleBellIconSizeChange(e) {
        window.clearTimeout(this.bellIconSizeDelayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.bellIconSizeDelayTimeout = setTimeout(() => {
            this.bellIconSize =  e.detail.value;
            this.validateValues();
        }, typeDelay);
    }

    handleBellIconCounterNumberColorChange(e) {
        
        this.bellIconCounterNumberColor = e.detail.value;
        this.validateValues();
    }

    handleBellIconDefaultIconColorChange(e) {
        
        this.bellIconDefaultIconColor = e.detail.value;
        this.validateValues();
    }

    handleBellIconHoverColorChange(e) {
        
        this.bellIconHoverColor = e.detail.value;
        this.validateValues();
    }

    handleBellIconFocusColorChange(e) {
        
        this.bellIconFocusColor = e.detail.value;
        this.validateValues();
    }

    handleBellIconActiveColorChange(e) {
        
        this.bellIconActiveColor = e.detail.value;
        this.validateValues();
    }

    handleBellIconSizeChange(e) {
        
        this.bellIconSize = e.detail.value;
        this.validateValues();
    }

    handleBodyDropdownAlignmentChange(e) {
        this.bodyDropdownAlignmentSelected = e.detail.value;
        this.validateValues();
    }

    handleTrayBodyColorChange(e) {
        
        this.trayBodyColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationHoverColorChange(e) {
        
        this.notificationHoverColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationUnreadColorChange(e) {
        
        this.notificationUnreadColor = e.detail.value;
        this.validateValues();
    }


    handleTrayHeaderColorChange(e) {
        
        this.trayHeaderColor = e.detail.value;
        this.validateValues();
    }

    handleNotifLabelTextColorChange(e) {
        
        this.notifLabelTextColor = e.detail.value;
        this.validateValues();
    }

    handleNotifLabelTextStyleChange(e) {
        this.notifLabelTextStyleSelected = e.detail.value;
        this.validateValues();
    }

    handleMarkAllReadTextColorChange(e) {
        
        this.markAllReadTextColor = e.detail.value;
        this.validateValues();
    }

    handleMarkAllReadLabelTextStyleChange(e) {
        this.markAllReadLabelTextStyleSelected = e.detail.value;
        this.validateValues();
    }



    handleNotificationTitleColorChange(e) {
        
        this.notificationTitleColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationTitleHoverColorChange(e) {
        
        this.notificationTitleHoverColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationTitleUnreadColorChange(e) {
        
        this.notificationTitleUnreadColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationTitleTextStyleChange(e) {
        this.notificationTitleTextStyleSelected = e.detail.value;
        this.validateValues();
    }

    handleNotificationBodyColorChange(e) {
        
        this.notificationBodyColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationBodyHoverColorChange(e) {
        
        this.notificationBodyHoverColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationBodyUnreadColorChange(e) {
        
        this.notificationBodyUnreadColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationBodyTextStyleChange(e) {
        this.notificationBodyTextStyleSelected = e.detail.value;
        this.validateValues();
    }

    handleNotificationDateTimeColorChange(e) {
        
        this.notificationDateTimeColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationDateTimeHoverColorChange(e) {
        
        this.notificationDateTimeHoverColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationDateTimeUnreadColorChange(e) {
        
        this.notificationDateTimeUnreadColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationDateTimeTextStyleChange(e) {
        this.notificationDateTimeTextStyleSelected = e.detail.value;
        this.validateValues();
    }

    handleNotificationMarkReadColorChange(e) {
        
        this.notificationMarkReadColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationMarkReadUnreadColorChange(e) {
        
        this.notificationMarkReadUnreadColor = e.detail.value;
        this.validateValues();
    }

    handleNotificationMarkReadTextStyleChange(e) {
        this.notificationMarkReadTextStyleSelected = e.detail.value;
        this.validateValues();
    }

    handleDomainChange(e) { 
        this.displayInputError('.domain', '');
        this.domainSelected = e.detail.value;
        this.validateValues();
        this.checkSelectedDomainInRemoteSites();

    }

    async checkSelectedDomainInRemoteSites() {
        if(this.domainSelected !== undefined && this.domainSelected !== null && this.domainSelected.trim() !== '' && this.domainSelected.trim() !== 'none')
        {
            let domainCheckResultJSON = await checkDomain({domain: this.domainSelected});
            let domainCheckResult = JSON.parse(domainCheckResultJSON);
            if(domainCheckResult && domainCheckResult.isInRemoteSites !== undefined && domainCheckResult.isInRemoteSites === false)
            {
                this.displayInputError('.domain', 'This domain is not in your remote site settings. Please press the button below to add it to your remote site settings. Note: This action will modify your org\'s Metadata.');
                this.hideAddDomainButton = false;
            }
            else if(domainCheckResult && domainCheckResult.error)
            {
                this.displayInputError('.domain', domainCheckResult.error);
            }
            else if(domainCheckResult && domainCheckResult.isInRemoteSites !== undefined && domainCheckResult.isInRemoteSites === true)
            {
                this.hideAddDomainButton = true;
            }
        }
    }

    async handleAddToRemoteSites(e) {
        this.displayInputError('.domain', '');
        if(this.domainSelected !== undefined && this.domainSelected !== null && this.domainSelected.trim() !== '' && this.domainSelected.trim() !== 'none' && this.hideAddDomainButton === false)
        {
            this.hideAddDomainButton = true;
            let createRemoteSiteResultJSON = await createRemoteSite({domain: this.domainSelected});
            let createRemoteSiteResult = JSON.parse(createRemoteSiteResultJSON);
            if(createRemoteSiteResult && createRemoteSiteResult.success !== undefined && createRemoteSiteResult.success === true)
            {

            }
            else if(createRemoteSiteResult && createRemoteSiteResult.error)
            {
                this.hideAddDomainButton = false;
                this.displayInputError('.domain', createRemoteSiteResult.error);
            }
        }

    }

    handleCustomNotificationTypeChange(e) { 
        this.customNotificationTypeSelected = e.detail.value;
        this.validateValues();
    }

    handleNotificationHeaderTextChange(e) { 
        window.clearTimeout(this.notificationHeaderTextDelayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.notificationHeaderTextDelayTimeout = setTimeout(() => {
            this.notificationHeaderText = e.detail.value;
            this.validateValues();
        }, typeDelay);
    }

    handleNotificationHeaderMarkAllReadChange(e) { 
        window.clearTimeout(this.notificationHeaderMarkAllReadDelayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.notificationHeaderMarkAllReadDelayTimeout = setTimeout(() => {
            this.notificationHeaderMarkAllRead = e.detail.value;
            this.validateValues();
        }, typeDelay);
    }

    handleNotificationMarkReadTextChange(e) { 
        window.clearTimeout(this.notificationMarkReadTextDelayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.notificationMarkReadTextDelayTimeout = setTimeout(() => {
            this.notificationMarkReadText = e.detail.value;
            this.validateValues();
        }, typeDelay);
    }

    handleNotificationMarkUnreadTextChange(e) { 
        window.clearTimeout(this.notificationMarkUnreadTextDelayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.notificationMarkUnreadTextDelayTimeout = setTimeout(() => {
            this.notificationMarkUnreadText = e.detail.value;
            this.validateValues();
        }, typeDelay);
    }

    handleNotificationImageHideChange(e) {
        this.notificationImageHide = e.detail.checked;
        this.validateValues();
    }

    handleNotificationImageOverrideChange(e) {
        this.notificationImageOverride = e.detail.checked;
        this.validateValues();
    }

    handleNotificationImageOverrideUrlChange(e) { 
        window.clearTimeout(this.notificationImageOverrideUrlDelayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.notificationImageOverrideUrlDelayTimeout = setTimeout(() => {
            this.notificationImageOverrideUrl = e.detail.value;
            this.validateValues();
        }, typeDelay);
    }


}