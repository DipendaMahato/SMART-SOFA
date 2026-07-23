package com.example.smartsofa

import android.app.Application
import com.google.firebase.FirebaseApp

class SmartSofaApp : Application() {
    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)

        // Prevent unexpected thread crashes from force-closing the application
        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            android.util.Log.e("SmartSofaApp", "Uncaught exception safely caught on thread: ${thread.name}", throwable)
            defaultHandler?.uncaughtException(thread, throwable)
        }
    }
}
