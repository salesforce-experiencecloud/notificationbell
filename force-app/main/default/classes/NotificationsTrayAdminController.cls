/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

public with sharing class NotificationsTrayAdminController {
///services/data/v58.0/tooling/query?q=select+id,EndpointUrl,IsActive+FROM+RemoteProxy+WHERE+IsActive=TRUE+AND+EndpointUrl+LIKE+%27%25cspoc1.sfdxp.com%25%27

    @AuraEnabled
    public static string createRemoteSite(String domain){

        Map<String,Object> resMap = new Map<String,Object>();

        String domainCheck = checkDomain(domain);
        Map<String,Object> domainCheckResult = (Map<String,Object>)System.JSON.deserializeUntyped(domainCheck);

        if(domainCheckResult.get('error') != null)
        {
            resMap.put('error', domainCheckResult.get('error'));
        }
        else if(domainCheckResult.get('isInRemoteSites') == true)
        {
            resMap.put('success', true);
        }
        else 
            {
            Http h = new Http();
            HttpRequest webReq = buildToolingAPIRequest('POST');
            webReq.setHeader('Content-Type', 'application/json');


            String endpoint = webReq.getEndpoint();
            endpoint += 'sobjects/RemoteProxy/';
            webReq.setEndpoint(endpoint);

            String reqBody = '{ "Metadata" : { "disableProtocolSecurity" : false, "isActive" : true, "url" : "https://' + domain + '", "urls" : null, "description" : null }, "FullName" : "notif_' + System.now().getTime() + '" }';
            webReq.setBody(reqBody);

            HttpResponse res = h.send(webReq);
            String response = res.getbody();
            System.debug('response: ' + response);
            if(res.getStatusCode() >= 200 && res.getStatusCode() < 300)
            {
                resMap.put('success', true);
            }
            else 
            {
                resMap.put('error', response);
            }
        }

        return System.JSON.serialize(resMap);

    }

    @AuraEnabled
    public static string checkDomain(String domain){
        
        Map<String,Object> resMap = new Map<String,Object>();
        
        Http h = new Http();
        HttpRequest webReq = buildToolingAPIRequest('GET');

        String endpoint = webReq.getEndpoint();
        endpoint += 'query?q=select+id,EndpointUrl,IsActive+FROM+RemoteProxy+WHERE+IsActive=TRUE+AND+EndpointUrl+LIKE+%27%25' + domain + '%25%27';
        webReq.setEndpoint(endpoint);

        HttpResponse res = h.send(webReq);
        String response = res.getbody();
        System.debug('response: ' + response);
        try {

            if(res.getStatusCode() >= 200 && res.getStatusCode() < 300)
            {
                Map<String,Object> responseObject = (Map<String,Object>) JSON.deserializeUntyped(response);
            
                Integer totalSize = (Integer)responseObject.get('totalSize');
                if(totalSize > 0)
                {
                    resMap.put('isInRemoteSites', true);
                }
                else 
                {
                    resMap.put('isInRemoteSites', false);
                }
            }
            else 
            {
                resMap.put('error', response + ' ' + endpoint);
            }
        }
        catch(Exception e) {
            resMap.put('error', e + '');
        }

 
        return System.JSON.serialize(resMap);

    }

    @AuraEnabled(cacheable=true)
    public static string getDomainList(){
        
        Map<String,Object> resMap = new Map<String,Object>();
        List<Domain> domList = [SELECT Id,Domain FROM Domain];
        resMap.put('domList',domList);
        resMap.put('orgDomainUrl', System.URL.getOrgDomainUrl().toExternalForm());
        return System.JSON.serialize(resMap);

    }

    @AuraEnabled(cacheable=true)
    public static string getNotificationTypeList(){
        
        Map<String,Object> resMap = new Map<String,Object>();
        List<CustomNotificationType> notificationTypeList = [SELECT Id,CustomNotifTypeName FROM CustomNotificationType];
        resMap.put('notificationTypeList',notificationTypeList);
        return System.JSON.serialize(resMap);

    }

    private static HttpRequest buildToolingAPIRequest(String methodType)
    {
        HttpRequest webReq = new HttpRequest();
        webReq.setMethod(methodType);
        PageReference notificationTrayAdminPage = Page.NotificationTrayAdmin;
        String sessionId = System.UserInfo.getSessionId();
        if(!System.Test.isRunningTest())
        {
            sessionId = notificationTrayAdminPage.getContent().toString().replaceAll('\n','');
        }

        webReq.setHeader('Authorization','Bearer ' + sessionId);
        
        String domainPath = System.URL.getOrgDomainUrl().toExternalForm();

        String endpoint = domainPath + '/services/data/v58.0/tooling/';

        // replace endpoint url
        webReq.setEndpoint(endpoint);
       return webReq;
    }


}