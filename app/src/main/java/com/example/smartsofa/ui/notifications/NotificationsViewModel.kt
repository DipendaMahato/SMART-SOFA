package com.example.smartsofa.ui.notifications

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.smartsofa.data.firebase.FirebaseDatabaseManager
import com.example.smartsofa.data.model.NotificationItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class NotificationsViewModel(
    private val firebaseManager: FirebaseDatabaseManager = FirebaseDatabaseManager
) : ViewModel() {

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    val notifications = firebaseManager.observeNotifications()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val unreadCount = notifications.map { list ->
        list.count { !it.read }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    fun markAsRead(id: String) {
        viewModelScope.launch {
            firebaseManager.markNotificationRead(id)
        }
    }

    fun deleteNotification(id: String) {
        viewModelScope.launch {
            firebaseManager.deleteNotification(id)
        }
    }

    fun clearAll() {
        viewModelScope.launch {
            firebaseManager.clearAllNotifications()
        }
    }
}
