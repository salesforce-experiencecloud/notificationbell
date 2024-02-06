/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

@isTest
private class NotificationsTrayControllerTest {

        @isTest static void testNotificationResponses() {
        // Set mock callout class 
        System.Test.setMock(HttpCalloutMock.class, new NotificationsTrayRespGenerator());
        
        // Call method to test.
        // This causes a fake response to be sent
        // from the class that implements HttpCalloutMock. 
        Map<String,Object> res = (Map<String,Object>) NotificationsTrayController.getNotifications(10, 30, null);
    
        System.assertNotEquals(null, res.get('mostRecentNotifications'));

        res = (Map<String,Object>)NotificationsTrayController.getOlderNotifications('2024-01-22T19:09:28.298Z', 30, '0MLDJ00000003hx4AA');
    
        System.assertNotEquals(null, res.get('mostRecentNotifications'));

        res = (Map<String,Object>)NotificationsTrayController.markNotificationsRead('2024-01-22T19:09:28.298Z');

        System.assertNotEquals(null, res.get('mostRecentNotifications'));

        res = (Map<String,Object>)NotificationsTrayController.markNotificationsSeen('2024-01-22T19:09:28.298Z');

        System.assertNotEquals(null, res.get('mostRecentNotifications'));

        String res2 = (String)NotificationsTrayController.markNotificationReadUnread('[notificationId]', true);

        System.assert(res2.indexOf('success') > -1);

    }

    @isTest static void testgetObjectAPINameByRecordId() {

        String res = NotificationsTrayController.getObjectAPINameByRecordId(System.UserInfo.getUserId());
        System.assertNotEquals('user', res);

    }

}