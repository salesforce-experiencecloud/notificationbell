/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

@isTest
global class NotifTrayAdminMockRespGenerator implements HttpCalloutMock {
    // Implement this interface method
    global HTTPResponse respond(HTTPRequest req) {
        
        // Create a fake response
        HttpResponse res;

        //check domain
        if(req.getMethod() == 'GET' && req.getEndpoint().indexOf('/tooling/query?q=') > -1)
        {
            if(req.getEndpoint().indexOf('[DomainNotInCSP]') > -1)
            {
                res = checkDomainResponseExistsNot();
            }
            else 
            {
                res = checkDomainResponseExists();
            }
        }
        //create domain
        else if(req.getMethod() == 'POST' && req.getEndpoint().indexOf('/sobjects/RemoteProxy/') > -1)
        {
            res = checkDomainResponseExists();
        }

        return res;
    }

    private static HttpResponse checkDomainResponseExists() {

        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"RemoteProxy","records":[{"attributes":{"type":"RemoteProxy","url":"/services/data/v58.0/tooling/sobjects/RemoteProxy/0rpDJ0000005gQBYAY"},"Id":"0rpDJ0000005gQBYAY","EndpointUrl":"https://cspoc1.sfdxp.com","IsActive":true}]}');
        res.setStatusCode(200);
        return res;

    } 

    private static HttpResponse checkDomainResponseExistsNot() {

        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"size":0,"totalSize":0,"done":true,"queryLocator":null,"entityTypeName":null,"records":[]}');
        res.setStatusCode(200);
        return res;

    } 

}