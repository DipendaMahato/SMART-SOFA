package com.example.smartsofa.utils

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object DateUtils {
    fun formatTimestamp(timestamp: Long, format: String = "yyyy-MM-dd HH:mm:ss"): String {
        val sdf = SimpleDateFormat(format, Locale.getDefault())
        return sdf.format(Date(timestamp))
    }
}
