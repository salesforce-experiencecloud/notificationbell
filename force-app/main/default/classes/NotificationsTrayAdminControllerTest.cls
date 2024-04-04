/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

@isTest
private class NotificationsTrayAdminControllerTest {

    @isTest static void testgetNotificationTypeList() {

        String res = NotificationsTrayAdminController.getNotificationTypeList();
        System.assertNotEquals(null, res);

    }

}