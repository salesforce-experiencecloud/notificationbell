/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

@isTest
private class NotificationsTrayAdminControllerTest {

        @isTest static void testCreateDomain() {
        // Set mock callout class 
        System.Test.setMock(HttpCalloutMock.class, new NotifTrayAdminMockRespGenerator());
        
        // Call method to test.
        // This causes a fake response to be sent
        // from the class that implements HttpCalloutMock. 
        String res = NotificationsTrayAdminController.createRemoteSite('[DomainInCSP]');
    
        System.assert(res.indexOf('success') > -1);

        res = NotificationsTrayAdminController.createRemoteSite('[DomainNotInCSP]');
    
        System.assert(res.indexOf('success') > -1);

    }

    @isTest static void testgetDomainList() {

        String res = NotificationsTrayAdminController.getDomainList();
        System.assertNotEquals(null, res);

    }

    @isTest static void testgetNotificationTypeList() {

        String res = NotificationsTrayAdminController.getNotificationTypeList();
        System.assertNotEquals(null, res);

    }

}