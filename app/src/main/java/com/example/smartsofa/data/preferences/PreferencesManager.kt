package com.example.smartsofa.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class PreferencesManager(private val context: Context) {
    companion object {
        val REMEMBER_ME = booleanPreferencesKey("remember_me")
        val SAVED_EMAIL = stringPreferencesKey("saved_email")
        val SAVED_PASSWORD = stringPreferencesKey("saved_password")
        val DARK_MODE = booleanPreferencesKey("dark_mode")
        val NOTIFICATIONS_ENABLED = booleanPreferencesKey("notifications_enabled")
        val LANGUAGE = stringPreferencesKey("language")
    }

    val rememberMe: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[REMEMBER_ME] ?: false
    }

    val savedEmail: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[SAVED_EMAIL] ?: ""
    }

    val savedPassword: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[SAVED_PASSWORD] ?: ""
    }

    val darkMode: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[DARK_MODE] ?: false
    }

    val notificationsEnabled: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[NOTIFICATIONS_ENABLED] ?: true
    }

    val language: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[LANGUAGE] ?: "en"
    }

    suspend fun setRememberMe(value: Boolean) {
        context.dataStore.edit { preferences -> preferences[REMEMBER_ME] = value }
    }

    suspend fun setSavedEmail(value: String) {
        context.dataStore.edit { preferences -> preferences[SAVED_EMAIL] = value }
    }

    suspend fun setSavedPassword(value: String) {
        context.dataStore.edit { preferences -> preferences[SAVED_PASSWORD] = value }
    }

    suspend fun setDarkMode(value: Boolean) {
        context.dataStore.edit { preferences -> preferences[DARK_MODE] = value }
    }

    suspend fun setNotificationsEnabled(value: Boolean) {
        context.dataStore.edit { preferences -> preferences[NOTIFICATIONS_ENABLED] = value }
    }

    suspend fun setLanguage(value: String) {
        context.dataStore.edit { preferences -> preferences[LANGUAGE] = value }
    }
}
