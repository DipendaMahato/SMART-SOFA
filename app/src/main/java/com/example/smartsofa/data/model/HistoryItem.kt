package com.example.smartsofa.data.model

import com.google.firebase.database.IgnoreExtraProperties

@IgnoreExtraProperties
data class HistoryItem(
    val id: String = "",
    val type: String = "",
    val description: String = "",
    val timestamp: Long = 0,
    val deviceId: String = ""
)
