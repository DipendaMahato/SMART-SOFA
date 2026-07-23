package com.example.smartsofa.data.model

data class SofaStatus(
    val occupied: Boolean = false,
    val lastOccupiedAt: Long = 0,
    val lastEmptyAt: Long = 0
)
