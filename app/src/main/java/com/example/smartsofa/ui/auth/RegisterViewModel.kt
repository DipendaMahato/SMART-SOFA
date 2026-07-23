package com.example.smartsofa.ui.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.smartsofa.data.firebase.AuthResult
import com.example.smartsofa.data.firebase.FirebaseAuthManager
import kotlinx.coroutines.launch

enum class PasswordStrength {
    NONE, WEAK, MEDIUM, STRONG
}

class RegisterViewModel : ViewModel() {
    var fullName by mutableStateOf("")
        private set
    var email by mutableStateOf("")
        private set
    var password by mutableStateOf("")
        private set
    var confirmPassword by mutableStateOf("")
        private set

    var fullNameError by mutableStateOf<String?>(null)
        private set
    var emailError by mutableStateOf<String?>(null)
        private set
    var passwordError by mutableStateOf<String?>(null)
        private set
    var confirmPasswordError by mutableStateOf<String?>(null)
        private set

    var passwordStrength by mutableStateOf(PasswordStrength.NONE)
        private set

    var isLoading by mutableStateOf(false)
        private set
    var errorMessage by mutableStateOf<String?>(null)
        private set
    var registerSuccess by mutableStateOf(false)
        private set

    fun updateFullName(newFullName: String) {
        fullName = newFullName
        fullNameError = null
    }

    fun updateEmail(newEmail: String) {
        email = newEmail
        emailError = null
    }

    fun updatePassword(newPassword: String) {
        password = newPassword
        passwordError = null
        updatePasswordStrength(newPassword)
    }

    private fun updatePasswordStrength(pwd: String) {
        passwordStrength = when {
            pwd.isEmpty() -> PasswordStrength.NONE
            pwd.length < 6 -> PasswordStrength.WEAK
            pwd.length >= 8 && pwd.any { it.isDigit() } && pwd.any { !it.isLetterOrDigit() } -> PasswordStrength.STRONG
            pwd.length >= 6 -> PasswordStrength.MEDIUM
            else -> PasswordStrength.WEAK
        }
    }

    fun updateConfirmPassword(newConfirmPassword: String) {
        confirmPassword = newConfirmPassword
        confirmPasswordError = null
    }

    fun clearError() {
        errorMessage = null
    }

    fun register() {
        var isValid = true
        if (fullName.isBlank()) {
            fullNameError = "Name cannot be empty"
            isValid = false
        }
        if (email.isBlank() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailError = "Enter a valid email address"
            isValid = false
        }
        if (password.length < 6) {
            passwordError = "Password must be at least 6 characters"
            isValid = false
        }
        if (password != confirmPassword) {
            confirmPasswordError = "Passwords do not match"
            isValid = false
        }
        if (!isValid) return

        viewModelScope.launch {
            isLoading = true
            when (val result = FirebaseAuthManager.register(email.trim(), password, fullName.trim())) {
                is AuthResult.Success -> {
                    registerSuccess = true
                }
                is AuthResult.Error -> {
                    errorMessage = result.exception.message
                        ?: "Registration failed. Please try again."
                }
            }
            isLoading = false
        }
    }
}
