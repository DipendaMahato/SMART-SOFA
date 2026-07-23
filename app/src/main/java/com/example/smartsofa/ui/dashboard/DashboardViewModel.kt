package com.example.smartsofa.ui.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.smartsofa.data.firebase.FirebaseAuthManager
import com.example.smartsofa.data.firebase.FirebaseDatabaseManager
import com.example.smartsofa.data.model.Controls
import com.example.smartsofa.data.model.DeviceStatus
import com.example.smartsofa.data.model.ElectricalInfo
import com.example.smartsofa.data.model.SofaStatus
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class DashboardViewModel : ViewModel() {
    private val databaseManager = FirebaseDatabaseManager
    private val authManager = FirebaseAuthManager

    val sofaStatus: StateFlow<SofaStatus> = databaseManager.observeSofaStatus()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), SofaStatus())

    val deviceStatus: StateFlow<DeviceStatus> = databaseManager.observeDeviceStatus()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), DeviceStatus())

    val controls: StateFlow<Controls> = databaseManager.observeControls()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), Controls())

    val electricalInfo: StateFlow<ElectricalInfo> = databaseManager.observeElectricalInfo()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), ElectricalInfo())

    private val _userName = MutableStateFlow(authManager.getCurrentUser()?.displayName ?: "User")
    val userName: StateFlow<String> = _userName.asStateFlow()

    private val _currentTime = MutableStateFlow("")
    val currentTime: StateFlow<String> = _currentTime.asStateFlow()

    private val _lastSyncTime = MutableStateFlow("")
    val lastSyncTime: StateFlow<String> = _lastSyncTime.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    init {
        updateTime()
        updateSyncTime()
    }

    private fun updateTime() {
        viewModelScope.launch {
            while (true) {
                val sdf = SimpleDateFormat("MMM dd, yyyy HH:mm:ss", Locale.getDefault())
                val now = sdf.format(Date())
                _currentTime.value = now
                delay(1000)
            }
        }
    }

    fun toggleFan() {
        viewModelScope.launch {
            val current = controls.value.fan
            databaseManager.updateFanState(!current)
            updateSyncTime()
        }
    }

    fun toggleLight() {
        viewModelScope.launch {
            val current = controls.value.light
            databaseManager.updateLightState(!current)
            updateSyncTime()
        }
    }

    fun setMode(mode: String) {
        viewModelScope.launch {
            databaseManager.updateMode(mode)
            updateSyncTime()
        }
    }

    fun refresh() {
        viewModelScope.launch {
            _isLoading.value = true
            delay(1000) // Simulate refresh
            updateSyncTime()
            _isLoading.value = false
        }
    }
    
    private fun updateSyncTime() {
        val sdf = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
        _lastSyncTime.value = sdf.format(Date())
    }
}
