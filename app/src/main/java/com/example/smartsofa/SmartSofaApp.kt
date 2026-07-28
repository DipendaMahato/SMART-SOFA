package com.example.smartsofa

import android.app.Application
import com.google.firebase.FirebaseApp

class SmartSofaApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // FirebaseApp.initializeApp() is called automatically by the google-services plugin,
        // but calling it explicitly here ensures it's ready before any lazy Firebase access
        FirebaseApp.initializeApp(this)
    }
}
