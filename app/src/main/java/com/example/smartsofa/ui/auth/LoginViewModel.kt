package com.example.smartsofa.ui.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.smartsofa.data.firebase.AuthResult
import com.example.smartsofa.data.firebase.FirebaseAuthManager
import kotlinx.coroutines.launch

class LoginViewModel : ViewModel() {
    var email by mutableStateOf("")
        private set
    var password by mutableStateOf("")
        private set
    var rememberMe by mutableStateOf(false)
        private set

    var emailError by mutableStateOf<String?>(null)
        private set
    var passwordError by mutableStateOf<String?>(null)
        private set

    var isLoading by mutableStateOf(false)
        private set
    var errorMessage by mutableStateOf<String?>(null)
        private set
    var loginSuccess by mutableStateOf(false)
        private set

    fun updateEmail(newEmail: String) {
        email = newEmail
        emailError = null
    }

    fun updatePassword(newPassword: String) {
        password = newPassword
        passwordError = null
    }

    fun toggleRememberMe() {
        rememberMe = !rememberMe
    }

    fun clearError() {
        errorMessage = null
    }

    fun login() {
        var isValid = true
        if (email.isBlank() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailError = "Enter a valid email address"
            isValid = false
        }
        if (password.length < 6) {
            passwordError = "Password must be at least 6 characters"
            isValid = false
        }
        if (!isValid) return

        viewModelScope.launch {
            isLoading = true
            when (val result = FirebaseAuthManager.login(email.trim(), password)) {
                is AuthResult.Success -> {
                    loginSuccess = true
                }
                is AuthResult.Error -> {
                    errorMessage = result.exception.message
                        ?: "Login failed. Check your credentials."
                }
            }
            isLoading = false
        }
    }
}
