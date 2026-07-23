package com.example.smartsofa.data.model

data class DeviceStatus(
    val esp32aOnline: Boolean = false,
    val esp32bOnline: Boolean = false,
    val esp32aLastSeen: Long = 0,
    val esp32bLastSeen: Long = 0,
    val wifiConnected: Boolean = false,
    val firebaseConnected: Boolean = false,
    
    // Detailed Device Information & Telemetry
    val deviceName: String = "Smart Sofa",
    val deviceId: String = "SS001",
    val firmwareVersion: String = "v1.0.0",
    val wifiSsid: String = "SmartSofa_Net",
    val signalStrength: Int = -67, // dBm
    val ipAddress: String = "192.168.1.100",
    val macAddress: String = "24:0A:C4:8B:58:A2",
    val uptimeSeconds: Long = 3600
)
