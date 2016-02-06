var appModel = {
    title: 'Knock Knock!',
    detailsShow: false,
    deviceMap: new Map(),
    devicesArray: [],
    bluetooth: [],
    users: []
};

var vm = new Vue({
    el: 'body',
    data: appModel,
    created: function() {
        var that = this;
        fetchNetwork(function(network) {
            that.deviceMap.clear();
            network.arp.forEach(function(device) {
                if (that.deviceMap.has(device.macAddr)) {
                    // Update entry if exists.
                    var dev = that.deviceMap.get(device.macAddr);
                    that.deviceMap.delete(device.macAddr);
                    addToMap(device.macAddr, dev.hostname, device.ipAddr,
                        dev.leaseEnds, dev.isWifi, dev.signal,
                        dev.tx, dev.rx, dev.inactiveTime, true);
                } else {
                    // Create new entry if doesnt exist.
                    addToMap(device.macAddr, "", device.ipAddr,
                        "", false, "",
                        "", "", "", true);
                }
            });
            network.dhcp.forEach(function(device) {
                if (that.deviceMap.has(device.macAddr)) {
                    // Update entry if exists.
                    var dev = that.deviceMap.get(device.macAddr);
                    that.deviceMap.delete(device.macAddr);
                    addToMap(device.macAddr, dev.hostname, device.ipAddr,
                        device.leaseEnds, dev.isWifi, dev.signal,
                        dev.tx, dev.rx, dev.inactiveTime, dev.isActive);
                } else {
                    // Create new entry if doesnt exist.
                    addToMap(device.macAddr, "", device.ipAddr,
                        device.leaseEnds, false, "",
                        "", "", "", "");
                }
            });
            that.deviceMap.forEach(function(value, key, map) {
                network.hosts.forEach(function(device) {
                    if (device.ipAddr === value.ipAddr) {
                        var dev = that.deviceMap.get(key);
                        addToMap(key, device.hostname, device.ipAddr,
                            dev.leaseEnds, dev.isWifi, dev.signal,
                            dev.tx, dev.rx, dev.inactiveTime, dev.isActive);
                    }
                });
            });
            network.wlan0.forEach(function(device) {
                if (that.deviceMap.has(device.macAddr)) {
                    // Update entry if exists.
                    var dev = that.deviceMap.get(device.macAddr);
                    that.deviceMap.delete(device.macAddr);
                    addToMap(device.macAddr, dev.hostname, dev.ipAddr,
                        dev.leaseEnds, true, device.signal,
                        device.tx, device.rx, device.inactiveTime, dev.isActive);
                } else {
                    // Create new entry if doesnt exist.
                    addToMap(device.macAddr, "", "",
                        "", true, device.signal,
                        device.tx, device.rx, device.inactiveTime, "");
                }
            });
            network.wlan1.forEach(function(device) {
                if (that.deviceMap.has(device.macAddr)) {
                    // Update entry if exists.
                    var dev = that.deviceMap.get(device.macAddr);
                    that.deviceMap.delete(device.macAddr);
                    addToMap(device.macAddr, dev.hostname, dev.ipAddr,
                        dev.leaseEnds, true, device.signal,
                        device.tx, device.rx, device.inactiveTime, dev.isActive);
                } else {
                    // Create new entry if doesnt exist.
                    addToMap(device.macAddr, "", "",
                        "", true, device.signal,
                        device.tx, device.rx, device.inactiveTime, "");
                }
            });
            var tempMap = that.deviceMap;
            Vue.set(appModel, "deviceMap", tempMap);
            mapToArray();
        });
        fetchBluetooth(function(bluetooth) {
           console.log("updateBluetooth HERE");
        });
        fetchConfig(function(config) {
            console.log(config);
            Vue.set(appModel, "users", config.users);
        });
    },
    methods: {
        toggleDetails: function() {
            this.detailsShow ^= 1;
        },
        isHome: function(userMACAddr) {
            if (this.deviceMap.has(userMACAddr.toLowerCase())) {
               if (this.deviceMap.get(userMACAddr.toLowerCase()).isActive) {
                   return true
               }
            } else {
                return false;
            }
        }
    }
});

function fetchNetwork(updateData) {
    $.ajax({
      method: 'GET',
        url: 'data/network.json',
        headers: {
            accept: 'application/json'
        },
        complete: function() {
            console.log('Network Complete.');
        },
        success: function(network) {
            console.log('Network Success.');
            updateData(network);
        },
        error: function() {
            console.log('Network Error.');
        }
    })
}

function fetchBluetooth(updateData) {
    $.ajax({
        method: 'GET',
        url: 'data/bluetooth.json',
        headers: {
            accept: 'application/json'
        },
        complete: function() {
            console.log('Bluetooth Complete.');
        },
        success: function(bluetooth) {
            console.log('Bluetooth Success.');
            updateData(bluetooth);
        },
        error: function() {
            console.log('Bluetooth Error.');
        }
    })
}

function fetchConfig(updateConfig) {
    $.ajax({
        method: 'GET',
        url: 'data/config.json',
        headers: {
            accept: 'application/json'
        },
        complete: function() {
            console.log('Config Complete.');
        },
        success: function(config) {
            console.log('Config Success.');
            updateConfig(config);
        },
        error: function() {
            console.log('Config Error.');
        }
    })
}

function addToMap(macAddr, hostname, ipAddr, leaseEnds, isWifi, signal, tx, rx, inactiveTime, isActive) {
    appModel.deviceMap.set(macAddr, {
        hostname: hostname,
        ipAddr: ipAddr,
        leaseEnds: leaseEnds,
        isWifi: isWifi,
        signal: signal,
        tx: tx,
        rx: rx,
        inactiveTime: inactiveTime,
        isActive: isActive
    })
}

function mapToArray() {
    var i = 0;
    var tempArray = [];
    appModel.deviceMap.forEach(function(value, key, map) {
        //appModel.deviceMapObj[key] = value;
        value["macAddr"] = key.toString().toUpperCase();
        tempArray[i++] = value;
        //appModel.devicesArray[i++] = value;
    });
    Vue.set(appModel, "devicesArray", tempArray);
}

