package com.example.smartsofa.data.model

import com.google.firebase.database.IgnoreExtraProperties

@IgnoreExtraProperties
data class EnergyData(
    val date: String = "",
    val totalEnergy: Double = 0.0,
    val avgPower: Double = 0.0
)

@IgnoreExtraProperties
data class EnergyHistory(
    val daily: List<EnergyData> = emptyList(),
    val weekly: List<EnergyData> = emptyList(),
    val monthly: List<EnergyData> = emptyList()
)
