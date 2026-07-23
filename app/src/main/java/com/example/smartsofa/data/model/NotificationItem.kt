package com.example.smartsofa.data.model

data class NotificationItem(
    val id: String = "",
    val type: String = "",
    val title: String = "",
    val message: String = "",
    val timestamp: Long = 0,
    val read: Boolean = false
)
