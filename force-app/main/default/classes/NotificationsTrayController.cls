/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

public with sharing class NotificationsTrayController {
    
    @AuraEnabled
    public static Object getNotifications(Integer numDays, Integer maxNumNotifications, String notificationType) {

        Map<String,Object> resObject = new Map<String,Object>();

        Http h = new Http();
        HttpRequest webReq = buildNotificationsAPIRequest('GET');
        
        String endpoint = webReq.getEndpoint();
        List<String> filterList = new List<String>();
        if(numDays != null)
        {
            DateTime durationDT = DateTime.now().addDays(numDays * (-1));
            filterList.add('after=' + durationDT.format('yyyy-MM-dd\'T\'HH:mm:ss.SSS') +'Z');
        }

        if(maxNumNotifications != null)
        {
            maxNumNotifications = (maxNumNotifications < 1) ? 1 : maxNumNotifications;
            maxNumNotifications = (maxNumNotifications > 50) ? 50 : maxNumNotifications;
            filterList.add('size=' + maxNumNotifications);
        }

        webReq.setEndpoint(endpoint + '?' + String.join(filterList, '&'));
    
        HttpResponse res = h.send(webReq);
        String response = res.getbody();
        System.debug('response: ' + response);
        try {

            Map<String,Object> responseObject = (Map<String,Object>) JSON.deserializeUntyped(response);
            
            resObject.put('mostRecentNotifications',filterOutNotifications(responseObject.get('notifications'), notificationType));
            //resObject.put('siteId', System.Site.getSiteId());
            //resObject.put('baseUrl', System.Site.getBaseUrl());
            //resObject.put('baseSecureUrl',System.Site.getBaseSecureUrl());
        }
        catch(Exception e) {
            resObject.put('error', e + '');
            //resObject.put('response', response);
            //resObject.put('siteId', System.Site.getSiteId());
            //resObject.put('baseUrl', System.Site.getBaseUrl());
            //resObject.put('baseSecureUrl',System.Site.getBaseSecureUrl());
        }

        return JSON.deserializeUntyped(JSON.serialize(resObject));
    }

    @AuraEnabled
    public static Object getOlderNotifications(String before, Integer maxNumNotifications, String notificationType) {
        
        Map<String,Object> resObject = new Map<String,Object>();
        if(before != null)
        {
            Http h = new Http();
            HttpRequest webReq = buildNotificationsAPIRequest('GET');
            
            String endpoint = webReq.getEndpoint();
            List<String> filterList = new List<String>();

            filterList.add('before=' + before);
            

            if(maxNumNotifications != null)
            {
                maxNumNotifications = (maxNumNotifications < 1) ? 1 : maxNumNotifications;
                maxNumNotifications = (maxNumNotifications > 50) ? 50 : maxNumNotifications;
                filterList.add('size=' + maxNumNotifications);
            }

            webReq.setEndpoint(endpoint + '?' + String.join(filterList, '&'));
        
            HttpResponse res = h.send(webReq);
            String response = res.getbody();
            System.debug('response: ' + response);
            try {

                Map<String,Object> responseObject = (Map<String,Object>) JSON.deserializeUntyped(response);
            
                resObject.put('mostRecentNotifications',filterOutNotifications(responseObject.get('notifications'), notificationType));
                //resObject.put('siteId', System.Site.getSiteId());
                //resObject.put('baseUrl', System.Site.getBaseUrl());
                //resObject.put('baseSecureUrl',System.Site.getBaseSecureUrl());
            }
            catch(Exception e) {
                resObject.put('error', e + '');
                //resObject.put('response', response);
                //resObject.put('siteId', System.Site.getSiteId());
                //resObject.put('baseUrl', System.Site.getBaseUrl());
                //resObject.put('baseSecureUrl',System.Site.getBaseSecureUrl());
            }
        }

        return JSON.deserializeUntyped(JSON.serialize(resObject));

    }

    @AuraEnabled
    public static Object markNotificationsRead(String beforeDateTime) {
        
        Map<String,Object> resObject = new Map<String,Object>();

        Http h = new Http();
        HttpRequest webReq = buildNotificationsAPIRequest('PATCH');
        webReq.setHeader('Content-Type', 'application/json;charset=UTF-8');

        Map<String,Object> filterMap = new Map<String,Object>();
        if(beforeDateTime != null)
        {
            filterMap.put('before', beforeDateTime);
        }

        filterMap.put('read',true);
    
        webReq.setBody(System.JSON.serialize(filterMap));

        HttpResponse res = h.send(webReq);
        String response = res.getbody();
        System.debug('response: ' + response);
        try {

            Map<String,Object> responseObject = (Map<String,Object>) JSON.deserializeUntyped(response);
        
            resObject.put('mostRecentNotifications',responseObject.get('notifications'));
            //debug purposes resObject.put('req',filterMap);
        }
        catch(Exception e) {
            resObject.put('error', e + '');
        }

        return JSON.deserializeUntyped(JSON.serialize(resObject));

    }

    @AuraEnabled
    public static Object markNotificationsSeen(String beforeDateTime) {
       
        Map<String,Object> resObject = new Map<String,Object>();

        Http h = new Http();
        HttpRequest webReq = buildNotificationsAPIRequest('PATCH');
        webReq.setHeader('Content-Type', 'application/json;charset=UTF-8');

        Map<String,Object> filterMap = new Map<String,Object>();
        if(beforeDateTime != null)
        {
            filterMap.put('before', beforeDateTime);
        }

        filterMap.put('seen',true);
    
        webReq.setBody(System.JSON.serialize(filterMap));

        HttpResponse res = h.send(webReq);
        String response = res.getbody();
        System.debug('response: ' + response);
        try {

            Map<String,Object> responseObject = (Map<String,Object>) JSON.deserializeUntyped(response);
        
            resObject.put('mostRecentNotifications',responseObject.get('notifications'));
            //debug purposes resObject.put('req',filterMap);
        }
        catch(Exception e) {
            resObject.put('error', e + '');
        }

        return JSON.deserializeUntyped(JSON.serialize(resObject));

    }
    

    @AuraEnabled
    public static String markNotificationReadUnread(String notificationId, Boolean read) {
        
        if(notificationId != null)
        {
            Http h = new Http();
            HttpRequest webReq = buildNotificationsAPIRequest('PATCH');
            webReq.setHeader('Content-Type', 'application/json;charset=UTF-8');
            String endpoint = webReq.getEndpoint();
            endpoint += '/' + notificationId;
            webReq.setEndpoint(endpoint);
            Map<String,Object> filterMap = new Map<String,Object>();
            if(read != null)
            {
                filterMap.put('read', read);
            }
        
            webReq.setBody(System.JSON.serialize(filterMap));

            HttpResponse res = h.send(webReq);
            String response = res.getbody();
            System.debug('response: ' + response);
            if(res.getStatusCode() == 200)
            {
                return 'success';
            }
            else {
                return response;
            }
        }
        else {
            return 'no notification id present.';
        }

    }
    

    @AuraEnabled
    public static String getObjectAPINameByRecordId(Id recordId){
        return recordId.getsobjecttype() + '';
    }

    private static Object filterOutNotifications(Object notifications, String notificationType) 
    {
        if(notificationType != null && notificationType.trim() != '')
        {
            List<Object> notificationList = (List<Object>) notifications;
            List<Object> filteredNotificationsList = new List<Object>();
            for(Object obj : notificationList)
            {
                Map<String, Object> objMap = (Map<String,Object>) obj;
                if(objMap.get('type') != null && notificationType.indexOf((String)objMap.get('type')) > -1)
                {
                    filteredNotificationsList.add(objMap);
                }
            }

            return filteredNotificationsList;
        }
        else
        {
            return notifications;
        }

    }

    private static HttpRequest buildNotificationsAPIRequest(String methodType)
    {
        HttpRequest webReq = new HttpRequest();
        webReq.setMethod(methodType);
        webReq.setHeader('Authorization','Bearer ' + UserInfo.getSessionId());
        
        String domainPath = System.Site.getBaseSecureUrl();

        domainPath = (domainPath.endsWith('/s')) ? domainPath.left(domainPath.length() - 2) : domainPath;
        
        String endpoint = domainPath + '/services/data/v56.0/connect/notifications';

        // replace endpoint url
        webReq.setEndpoint(endpoint);
       return webReq;
    }


}