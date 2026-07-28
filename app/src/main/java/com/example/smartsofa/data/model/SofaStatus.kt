package com.example.smartsofa.data.model

import com.google.firebase.database.IgnoreExtraProperties

@IgnoreExtraProperties
data class SofaStatus(
    val occupied: Boolean = false,
    val lastOccupiedAt: Long = 0,
    val lastEmptyAt: Long = 0
)
