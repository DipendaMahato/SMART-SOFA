package com.example.smartsofa.ui.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.smartsofa.data.firebase.FirebaseAuthManager
import com.example.smartsofa.data.firebase.FirebaseDatabaseManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class SettingsViewModel : ViewModel() {

    private val _darkMode = MutableStateFlow(false)
    val darkMode: StateFlow<Boolean> = _darkMode.asStateFlow()

    private val _notificationsEnabled = MutableStateFlow(true)
    val notificationsEnabled: StateFlow<Boolean> = _notificationsEnabled.asStateFlow()

    private val _userName = MutableStateFlow("User")
    val userName: StateFlow<String> = _userName.asStateFlow()

    private val _userEmail = MutableStateFlow("")
    val userEmail: StateFlow<String> = _userEmail.asStateFlow()

    private val _firebaseConnected = MutableStateFlow(true)
    val firebaseConnected: StateFlow<Boolean> = _firebaseConnected.asStateFlow()

    private val _changePasswordSuccess = MutableStateFlow<Boolean?>(null)
    val changePasswordSuccess: StateFlow<Boolean?> = _changePasswordSuccess.asStateFlow()

    private val _changePasswordError = MutableStateFlow<String?>(null)
    val changePasswordError: StateFlow<String?> = _changePasswordError.asStateFlow()

    init {
        loadUserInfo()
        observeConnection()
    }

    private fun observeConnection() {
        viewModelScope.launch {
            FirebaseDatabaseManager.observeFirebaseConnection().collect { connected ->
                _firebaseConnected.value = connected
            }
        }
    }

    private fun loadUserInfo() {
        val user = FirebaseAuthManager.getCurrentUser()
        if (user != null) {
            _userEmail.value = user.email ?: ""
            // Load full name from RTDB profile
            viewModelScope.launch {
                FirebaseDatabaseManager.getUserProfile(user.uid).collect { profile ->
                    if (profile.fullName.isNotBlank()) {
                        _userName.value = profile.fullName
                    } else {
                        // fallback to display name or email prefix
                        _userName.value = user.displayName
                            ?: user.email?.substringBefore("@")
                            ?: "User"
                    }
                }
            }
        }
    }

    fun toggleDarkMode() {
        _darkMode.value = !_darkMode.value
    }

    fun toggleNotifications() {
        _notificationsEnabled.value = !_notificationsEnabled.value
    }

    fun logout() {
        FirebaseAuthManager.logout()
    }

    fun changePassword(newPassword: String) {
        val user = FirebaseAuthManager.getCurrentUser() ?: return
        viewModelScope.launch {
            user.updatePassword(newPassword)
                .addOnSuccessListener {
                    _changePasswordSuccess.value = true
                }
                .addOnFailureListener { e ->
                    _changePasswordError.value = e.message ?: "Password change failed"
                }
        }
    }

    fun clearPasswordMessages() {
        _changePasswordSuccess.value = null
        _changePasswordError.value = null
    }
}
