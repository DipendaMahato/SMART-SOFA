package com.example.smartsofa.data.model

import com.google.firebase.database.IgnoreExtraProperties

@IgnoreExtraProperties
data class Controls(
    val fan: Boolean = false,
    val light: Boolean = false,
    val mode: String = "manual",
    val relayStatus: Boolean = false
)
