/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

let _notifications = [];

/**
 * Returns all notifications
 * @returns {*[]}
 */
export function get() {
    return _notifications;
}

/**
 * Overwrite all notifications. Notifications will be stored in sorted order
 * @param newNotifs the new array of notifications
 */
export function set(newNotifs) {
    if (!Array.isArray(newNotifs)) {
        throw new Error("Attempting to replace store notifications with non-array.");
    }
    _notifications = sort(newNotifs);
}

/**
 * Clears all notifications
 */
export function clear() {
    _notifications = [];
}

/**
 * Inserts a new notification in sorted order and ensures that no dupe of the notification exists.
 */
export function insert(newNotif) {
    if (newNotif.lastModifiedDate === undefined || newNotif.lastModifiedDate === null) {
        newNotif.lastModifiedDate = new Date(newNotif.lastModified);
    }
    _notifications.unshift(newNotif);
    _notifications = dedupe(sort(_notifications));
}

export function getLastNotification() {
    return (_notifications && _notifications.length > 0) ? _notifications[_notifications.length - 1] : null;
}

/**
 * Get the timestamp of a notification
 */
export function getTimestamp(notification) {
    let out = notification.lastModifiedDate;
    if (!out) {
        out = new Date(notification.lastModified);
    }
    if (notification.type === 'task_reminder' || notification.type === 'event_reminder') {
        try {
            const data = JSON.parse(notification.additionalData);
            if (data.reminderDateTime) {
                out = new Date(parseInt(data.reminderDateTime, 10));
            }
        } catch (e) {
            // ignore
        }
    }
    return out;
}

/**
 * Inserts a list of notifications replacing any existing notifications.
 * @param newNotifs
 */
export function upsert(newNotifs) {
    if (!Array.isArray(newNotifs)) {
        return;
    }
    const dupeMap = newNotifs.reduce((out, n) => {
        out[n.id] = 1;
        n.lastModifiedDate = new Date(n.lastModified);
        return out;
    }, {});
    const newNotifications = [];
    _notifications.forEach((n) => {
        if (!(n.id in dupeMap)) {
            newNotifications.push(n);
        }
    });
    _notifications = sort(newNotifications.concat(newNotifs));
}

/**
 * Marks a single notification as read.
 */
export function markRead(notifId) {
    _notifications.forEach((notification) => {
        if (notification.id === notifId) {
            notification.read = true;
            notification.seen = true;
        }
    });
}

/**
 * Marks a single notification as Unread.
 */
export function markUnread(notifId) {
    _notifications.forEach((notification) => {
        if (notification.id === notifId) {
            notification.read = false;
            notification.seen = true;
        }
    });
}

/**
 * Marks a single notification as seen.
 */
export function markSeen(notifId) {
    _notifications.forEach((notification) => {
        if (notification.id === notifId) {
            notification.seen = true;
        }
    });
}

/**
 * Marks an array of notifications @param notifIds as seen
 */
export function markSeenByIds(notifIds) {
    _notifications.forEach((notification) => {
        if (notifIds.indexOf(notification.id) > -1) {
            notification.seen = true;
        }
    });
}

/**
 * Marks all notifications before the given time as read
 */
export function markAllRead(before, exceptForIds) {
    exceptForIds = exceptForIds || [];
    updateAttributeValues([{ property: "read", value: true },
        { property: "seen", value: true }], before);
    updateAttributeValuesForIds([{
        property: "seen",
        value: false
    }, {
        property: "read",
        value: false
    }], exceptForIds);
}

/**
 * Marks all notifications before the given time as seen
 */
export function markAllSeen(before, exceptForIds) {
    exceptForIds = exceptForIds || [];
    updateAttributeValues([{property: "seen", value: true}], before);
    updateAttributeValuesForIds([{property: "seen", value: false}], exceptForIds);
}

/**
 * Returns the number of unseen notifications currently on the client
 */
export function getUnseenCount() {
    return countAttribute("seen", false);
}

export function getUnreadCount() {
    return countAttribute("read", false);
}

/**
 * Returns the date of the youngest notification
 */
export function getYoungestDate() {
    if (_notifications.length > 0) {
        return _notifications[0].lastModified;
    }
    return null;
}

/**
 * Returns the date of the oldest notification
 */
export function getOldestDate() {
    if (_notifications.length > 0) {
        return _notifications[_notifications.length - 1].lastModified;
    }
    return null;
}

// -------------------------------------------------------------
// ---------------PRIVATE HELPER FUNCTIONS----------------------
// -------------------------------------------------------------
/**
 * Returns the given notifications in sorted order (older notifications to the left of the array. So index 0 has the
 * oldest notification)
 */
function sort(notifications) {
    return notifications.sort((a, b) => {
        const diff = getTimestamp(b) - getTimestamp(a);
        return diff ? diff : b.id.localeCompare(a.id);
    });
}

/**
 * Removes all duplicate notifications. Keeps the newest versions of the notification while
 * removing the older version. Given notifications must be in sorted order.
 */
function dedupe(notifications) {
    const dedupeMap = {};
    notifications = notifications.filter((notif) => {
        if (notif.id in dedupeMap) {
            return false;
        }
        dedupeMap[notif.id] = notif;
        return true;
    });
    return notifications;
}

/**
 * Returns a count of notifications where the attribute on the notification has the given value
 */
function countAttribute(attribute, value) {
    return _notifications.reduce((count, notif) => {
        if (notif[attribute] === value) {
            count++;
        }
        return count;
    }, 0);
}

/**
 * Sets the given attribute to the given value on all notifications before the given date.
 */
function updateAttributeValues(attributeValues, before) {
    _notifications.forEach((notif) => {
        if (notif.lastModified <= before) {
            updateAttributes(notif, attributeValues);
        }
    });
}

function updateAttributes(notification, attributeValues) {
    attributeValues.forEach((attribute) => {
        notification[attribute.property] = attribute.value;
    });
}

function updateAttributeValuesForIds(attributeValues, ids) {
    _notifications.forEach((notification) => {
        if (ids.indexOf(notification.id) > -1) {
            updateAttributes(notification, attributeValues);
        }
    });
}