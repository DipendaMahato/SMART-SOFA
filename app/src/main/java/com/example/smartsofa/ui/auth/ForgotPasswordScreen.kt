package com.example.smartsofa.ui.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.smartsofa.data.firebase.AuthResult
import com.example.smartsofa.data.firebase.FirebaseAuthManager
import com.example.smartsofa.theme.GradientEndLight
import com.example.smartsofa.theme.GradientStartLight
import kotlinx.coroutines.launch

@Composable
fun ForgotPasswordScreen(
    onNavigateToLogin: () -> Unit
) {
    var email by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var isSuccess by remember { mutableStateOf(false) }
    
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            MaterialTheme.colorScheme.background,
                            MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
                        )
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                com.example.smartsofa.ui.components.SmartSofaLogo(
                    size = 64.dp,
                    isAnimated = true
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Reset Password",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(24.dp))

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.9f)
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        if (isSuccess) {
                            Text(
                                text = "Password reset link has been sent to your email.",
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.primary,
                                textAlign = TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(24.dp))
                            Button(
                                onClick = onNavigateToLogin,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Return to Login")
                            }
                        } else {
                            Text(
                                text = "Enter your email address and we'll send you a link to reset your password.",
                                style = MaterialTheme.typography.bodyMedium,
                                textAlign = TextAlign.Center,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                            )
                            Spacer(modifier = Modifier.height(24.dp))

                            OutlinedTextField(
                                value = email,
                                onValueChange = { email = it },
                                label = { Text("Email") },
                                leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
                                modifier = Modifier.fillMaxWidth(),
                                shape = MaterialTheme.shapes.medium
                            )
                            Spacer(modifier = Modifier.height(32.dp))

                            Button(
                                onClick = {
                                    if (email.isBlank() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                                        scope.launch { snackbarHostState.showSnackbar("Please enter a valid email") }
                                        return@Button
                                    }
                                    isLoading = true
                                    scope.launch {
                                        when (val result = FirebaseAuthManager.forgotPassword(email.trim())) {
                                            is AuthResult.Success -> {
                                                isLoading = false
                                                isSuccess = true
                                            }
                                            is AuthResult.Error -> {
                                                isLoading = false
                                                snackbarHostState.showSnackbar(
                                                    result.exception.message ?: "Failed to send reset email. Please try again."
                                                )
                                            }
                                        }
                                    }
                                },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(56.dp),
                                shape = MaterialTheme.shapes.large,
                                enabled = !isLoading,
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color.Transparent
                                )
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .background(
                                            brush = Brush.horizontalGradient(
                                                colors = listOf(GradientStartLight, GradientEndLight)
                                            ),
                                            shape = MaterialTheme.shapes.large
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    if (isLoading) {
                                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                                    } else {
                                        Text("Send Reset Link", color = Color.White, style = MaterialTheme.typography.titleLarge)
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))

                            TextButton(onClick = onNavigateToLogin) {
                                Text("Back to Login")
                            }
                        }
                    }
                }
            }
        }
    }
}

