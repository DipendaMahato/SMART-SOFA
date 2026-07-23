package com.example.smartsofa

import android.app.Application
import com.google.firebase.FirebaseApp

class SmartSofaApp : Application() {
    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)
    }
}
