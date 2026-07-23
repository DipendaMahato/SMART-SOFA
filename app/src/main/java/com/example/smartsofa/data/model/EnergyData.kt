package com.example.smartsofa.data.model

data class EnergyData(
    val date: String = "",
    val totalEnergy: Float = 0f,
    val avgPower: Float = 0f
)

data class EnergyHistory(
    val daily: List<EnergyData> = emptyList(),
    val weekly: List<EnergyData> = emptyList(),
    val monthly: List<EnergyData> = emptyList()
)
