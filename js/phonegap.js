// PHONEGAP

var PhoneGap = {
    callbackId: 0,
    callbacks: {},

    klassMap: {
        'com.phonegap.Network':      'com.phonegap.network.Network',
        'com.phonegap.Notification': 'com.phonegap.notification.Notification'
    },

    exec: function(success, fail, klass, action, args) {
        klass = this.klassMap[klass];

        var callbackId = klass + PhoneGap.callbackId++;
        PhoneGap.callbacks[callbackId] = { success:success, fail:fail };

        return phonegap.commandManager.exec(klass, action, callbackId, JSON.stringify(args));
    },

    execSync: function(klass, action, args) {
        klass = this.klassMap[klass];

        return phonegap.commandManager.exec(klass, action, null, JSON.stringify(args));
    },

    callbackSuccess: function(callbackId, args) {
        PhoneGap.callbacks[callbackId].success(args.message);
        PhoneGap.clearExec(callbackId);
    },

    callbackError: function(callbackId, args) {
        PhoneGap.callbacks[callbackId].fail(args);
        PhoneGap.clearExec(callbackId);
    },

    clearExec: function(callbackId) {
        delete PhoneGap.callbacks[callbackId];
    }
};

// DEVICE

PhoneGap.Device = {
  platform: phonegap.device.platform,
  version:  blackberry.system.softwareVersion,
  name:     blackberry.system.model,
  uuid:     phonegap.device.uuid
};

window.device = navigator.device = PhoneGap.Device;

// NOTIFICATION

PhoneGap.Notification = {
  vibrate: function(duration) {
    PhoneGap.execSync('com.phonegap.Notification', 'vibrate', [duration]);
  },

  beep: function(count) {
    PhoneGap.execSync('com.phonegap.Notification', 'beep', [count]);
  },

  alert: function(message, title, buttonLabel) {
    PhoneGap.execSync('com.phonegap.Notification', 'alert', [message, title, buttonLabel]);
  }
};

navigator.notification = PhoneGap.Notification;

// NETWORK

NetworkStatus = {
  NOT_REACHABLE: 0,
  REACHABLE_VIA_CARRIER_DATA_NETWORK: 1,
  REACHABLE_VIA_WIFI_NETWORK: 2
};

PhoneGap.Network = {
  isReachable: function(domain, reachabilityCallback) {
    PhoneGap.exec(reachabilityCallback, function() {}, 'com.phonegap.Network', 'isReachable', [domain]);
  }
};

navigator.network = PhoneGap.Network;