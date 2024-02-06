/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

@isTest
global class NotificationsTrayRespGenerator implements HttpCalloutMock {
    // Implement this interface method
    global HTTPResponse respond(HTTPRequest req) {
        
        // Create a fake response
        HttpResponse res;

        //update notification
        if(req.getMethod() == 'PATCH' && req.getEndpoint().indexOf('/connect/notifications/[notificationId]') > -1)
        {
            res = updateNotificationResponse();
        }
        //get notifications
        else if(req.getMethod() == 'GET' && req.getEndpoint().indexOf('/connect/notifications') > -1)
        {
            res = getNotificationsResponse();
        }
        //update notifications
        else if(req.getMethod() == 'PATCH' && req.getEndpoint().indexOf('/connect/notifications') > -1)
        {
            res = getNotificationsResponse();
        }

        return res;
    }

    private static HttpResponse getNotificationsResponse() {

        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"notifications":[{"url":"/connect/notifications/47561173624dc73424bea994a6147167","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":false,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-23T17:52:35.782Z","image":"https://cspoc1.sfdxp.com/starplus_hc/img/notificationsEmail/custom_notification.png","id":"47561173624dc73424bea994a6147167","count":1,"communityId":"all"},{"url":"/connect/notifications/ebcf16271f9d0229ad094804cb575073","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":false,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-23T17:43:55.454Z","image":"https://cspoc1.sfdxp.com/starplus_hc/img/notificationsEmail/custom_notification.png","id":"ebcf16271f9d0229ad094804cb575073","count":1,"communityId":"all"},{"url":"/connect/notifications/36567939ba392f50f09311fb9a9672ff","type":"0MLDJ00000003hx4AA","target":"0015A0000237atZQAQ","seen":true,"recipientId":"0055A000006KFFgQAO","read":false,"organizationId":"00D0q0000008mQYEAY","mostRecentActivityDate":"2024-01-23T17:56:32.227Z","messageTitle":"Notification Title","messageBody":"Notification Body Text","lastModified":"2024-01-23T17:41:23.302Z","image":"https://cspoc1.sfdxp.com/starplus_hc/img/notificationsEmail/custom_notification.png","id":"36567939ba392f50f09311fb9a9672ff","count":1,"communityId":"all"}]}');
        res.setStatusCode(200);
        return res;

    } 

    private static HttpResponse updateNotificationResponse() {

        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{}');
        res.setStatusCode(200);
        return res;

    } 

}