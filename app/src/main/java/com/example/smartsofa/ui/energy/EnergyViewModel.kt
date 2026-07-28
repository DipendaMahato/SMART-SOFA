package com.example.smartsofa.ui.energy

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.smartsofa.data.firebase.FirebaseDatabaseManager
import com.example.smartsofa.data.model.ElectricalInfo
import com.example.smartsofa.data.model.EnergyData
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

class EnergyViewModel : ViewModel() {
    private val databaseManager = FirebaseDatabaseManager

    val electricalInfo: StateFlow<ElectricalInfo> = databaseManager.observeElectricalInfo()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), ElectricalInfo())

    val dailyEnergyData: StateFlow<List<EnergyData>> = databaseManager.observeEnergyDaily()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val weeklyEnergyData: StateFlow<List<EnergyData>> = databaseManager.observeEnergyWeekly()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val monthlyEnergyData: StateFlow<List<EnergyData>> = databaseManager.observeEnergyMonthly()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Cost estimated at ₹8 per kWh
    val estimatedCost: StateFlow<Double> = electricalInfo.map { it.monthlyEnergy * 8.0 }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)
}
