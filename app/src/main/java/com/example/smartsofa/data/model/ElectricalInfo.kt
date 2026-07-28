package com.example.smartsofa.data.model

import com.google.firebase.database.IgnoreExtraProperties

@IgnoreExtraProperties
data class ElectricalInfo(
    val voltage: Double = 0.0,
    val current: Double = 0.0,
    val power: Double = 0.0,
    val dailyEnergy: Double = 0.0,
    val weeklyEnergy: Double = 0.0,
    val monthlyEnergy: Double = 0.0,
    val relayStatus: Boolean = false
)
