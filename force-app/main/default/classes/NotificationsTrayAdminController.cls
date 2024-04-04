/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

public with sharing class NotificationsTrayAdminController {
///services/data/v58.0/tooling/query?q=select+id,EndpointUrl,IsActive+FROM+RemoteProxy+WHERE+IsActive=TRUE+AND+EndpointUrl+LIKE+%27%25cspoc1.sfdxp.com%25%27


    @AuraEnabled(cacheable=true)
    public static string getNotificationTypeList(){
        
        Map<String,Object> resMap = new Map<String,Object>();
        if(CustomNotificationType.sObjectType.getDescribe().isAccessible() && Schema.sObjectType.CustomNotificationType.fields.CustomNotifTypeName.isAccessible())
        {
            List<CustomNotificationType> notificationTypeList = [SELECT Id,CustomNotifTypeName FROM CustomNotificationType];
            resMap.put('notificationTypeList',notificationTypeList);
        }
        return System.JSON.serialize(resMap);

    }


}