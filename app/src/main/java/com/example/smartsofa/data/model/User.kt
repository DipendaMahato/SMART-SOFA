package com.example.smartsofa.data.model

import com.google.firebase.database.IgnoreExtraProperties

@IgnoreExtraProperties
data class User(
    val uid: String = "",
    val fullName: String = "",
    val email: String = "",
    val createdAt: Long = 0
)
