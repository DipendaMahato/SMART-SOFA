package com.example.smartsofa.data.model

import com.google.firebase.database.IgnoreExtraProperties

@IgnoreExtraProperties
data class NotificationItem(
    val id: String = "",
    val type: String = "",
    val title: String = "",
    val message: String = "",
    val timestamp: Long = 0,
    val read: Boolean = false
)
