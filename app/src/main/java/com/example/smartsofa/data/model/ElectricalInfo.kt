package com.example.smartsofa.data.model

data class ElectricalInfo(
    val voltage: Float = 0f,
    val current: Float = 0f,
    val power: Float = 0f,
    val dailyEnergy: Float = 0f,
    val weeklyEnergy: Float = 0f,
    val monthlyEnergy: Float = 0f,
    val relayStatus: Boolean = false
)
