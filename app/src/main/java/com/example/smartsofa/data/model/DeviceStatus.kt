package com.example.smartsofa.data.model

import com.google.firebase.database.IgnoreExtraProperties

@IgnoreExtraProperties
data class DeviceStatus(
    val esp32aOnline: Boolean = false,
    val esp32bOnline: Boolean = false,
    val esp32aLastSeen: Long = 0,
    val esp32bLastSeen: Long = 0,
    val wifiConnected: Boolean = false,
    val firebaseConnected: Boolean = false,

    // Detailed Device Information & Telemetry
    val deviceName: String = "",
    val deviceId: String = "",
    val firmwareVersion: String = "",
    val wifiSsid: String = "",
    val signalStrength: Int = 0,
    val ipAddress: String = "",
    val macAddress: String = "",
    val uptimeSeconds: Long = 0
)
