/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export function getPageReferenceObject(notification) {
    switch (notification.type) {
        case "data_assessment_alert":
            notification.componentAttributes = {
                "userOrigin": "Notification"
            };
            return getNavigateToComponentPageReference("runtime_sales_xclean:dataAssessment", notification);
        case "forecasting_jump_to":
            return {
                type: 'standard__namedPage',
                attributes: {
                    pageName: 'forecasting'
                },
                state: {
                    c__forecastingOwnerId: notification.target
                }
            };
        case "view_siq_object":
            return navigateToSIQObject(notification);
        case "automated_data_capture": {
            if (!isEmpty(notification.target)) {
                return getNavigateToListPageReference(notification, "Contact");
            }
            return null;
        }
        // TODO: W-12062099 Fix in 244 - Need to solve this for Aura sites that include the LWC Tray.
        // case "direct_message":
        //    return getNavigateToMessagesPageReference(notification);
        case "optimizer_scan_results":
            return {
                type: 'standard__app',
                attributes: {
                    appTarget: 'standard__Optimizer',
                    subNodeId: 'home'
                }
            };
        case "discovery_model_metrics":
            return getNavigateToDiscoveryGoalPageRef(notification);
        case "security_center_alert":
            return getNavigateToSecurityCenterPageReference(notification);
        default:
            return getNavigateToSObjectPageReference(notification);
    }
}

function navigateToSIQObject(notification) {
    let pageRefObject = null;

    if (notification.target.indexOf("EMAIL") !== -1) {
        pageRefObject = {
            type: "standard__component",
            attributes: {
                componentName: "runtime_sales_activities:activityTimeline2EmailStreamDetail",
                emailStreamExternalId: notification.target
            }
        };
    } else {
        pageRefObject = {
            type: "standard__component",
            attributes: {
                componentName: "runtime_sales_activities:activityTimelineEventStreamDetail",
                emailStreamExternalId: notification.target
            }
        };
    }
    return pageRefObject;
}

function getNavigateToSObjectPageReference(notification) {
    return {
        type: "standard__recordPage",
        attributes: {
            recordId: notification.target,
            actionName: "view",
            objectApiName: notification.objectApiName
        },
        state: {
            networkId: to15CharId(notification.communityId)
        }
    };
}

function getNavigateToSecurityCenterPageReference(notification) {
    const data = JSON.parse(notification.additionalData);
    const metricType = (data && "metricType" in data) ? data.metricType : "Summary";
    return {
        type: "standard__webPage",
        attributes: {
            url: `/lightning/page/securityHub?securityHub__metric=${metricType}`
        }
    };
}

function getNavigateToComponentPageReference(componentPath, notification) {
    return {
        type: "standard__component",
        attributes: {
            componentName: componentPath,
            recordId : notification.target,
            networkId: to15CharId(notification.communityId),
            componentAttributes: notification.componentAttributes
        }
    };
}

function getNavigateToListPageReference(notification, scope) {
    return {
        type: "standard__objectPage",
        attributes: {
            objectApiName: scope,
            actionName: "view"
        },
        state: {
            listViewId : notification.target,
            scope
        }
    };
}

function getNavigateToDiscoveryGoalPageRef(notification) {
    return {
        type: "standard__webPage",
        attributes: {
            url: "/analytics/goal/" + notification.target
        }
    };
}

/*
TODO: W-12062099 Fix in 244 - Need to solve this for Aura sites that include the LWC Tray.
function getNavigateToMessagesPageReference(notification) {
    return {
        type: "standard__recordPage",
        attributes: {
            recordId : notification.target,
            actionName: "view",
        }
    };
}
*/

function to15CharId(id) {
    if (id) {
        return id.slice(0, 15);
    }
    return id;
}

function isEmpty(obj) {
    if (obj === undefined || obj === null || obj === "") {
        return true;
    }
    if (Array.isArray(obj)) {
        return obj.length === 0;
    } else if (typeof obj === "object" && Object.prototype.toString.call(obj) === "[object Object]") {
        return Object.keys(obj).length === 0;
    }
    return false;
}