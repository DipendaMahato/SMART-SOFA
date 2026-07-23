package com.example.smartsofa.data.firebase

import com.example.smartsofa.data.model.User
import com.example.smartsofa.utils.Constants
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.database.FirebaseDatabase
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume

sealed class AuthResult<out T> {
    data class Success<out T>(val data: T) : AuthResult<T>()
    data class Error(val exception: Exception) : AuthResult<Nothing>()
}

object FirebaseAuthManager {
    private val auth = FirebaseAuth.getInstance()
    private val database = FirebaseDatabase.getInstance("https://smartsofa-11154-default-rtdb.asia-southeast1.firebasedatabase.app/").reference

    suspend fun login(email: String, password: String): AuthResult<FirebaseUser> = 
        suspendCancellableCoroutine { continuation ->
            auth.signInWithEmailAndPassword(email, password)
                .addOnSuccessListener { result ->
                    val user = result.user
                    if (user != null) {
                        continuation.resume(AuthResult.Success(user))
                    } else {
                        continuation.resume(AuthResult.Error(Exception("User is null")))
                    }
                }
                .addOnFailureListener { exception ->
                    continuation.resume(AuthResult.Error(exception))
                }
        }

    suspend fun register(email: String, password: String, fullName: String): AuthResult<FirebaseUser> =
        suspendCancellableCoroutine { continuation ->
            auth.createUserWithEmailAndPassword(email, password)
                .addOnSuccessListener { result ->
                    val user = result.user
                    if (user != null) {
                        // Save profile
                        val userModel = User(
                            uid = user.uid,
                            fullName = fullName,
                            email = email,
                            createdAt = System.currentTimeMillis()
                        )
                        database.child(Constants.PATH_USERS).child(user.uid).child(Constants.PATH_PROFILE)
                            .setValue(userModel)
                            .addOnSuccessListener {
                                continuation.resume(AuthResult.Success(user))
                            }
                            .addOnFailureListener { exception ->
                                continuation.resume(AuthResult.Error(exception))
                            }
                    } else {
                        continuation.resume(AuthResult.Error(Exception("User is null after registration")))
                    }
                }
                .addOnFailureListener { exception ->
                    continuation.resume(AuthResult.Error(exception))
                }
        }

    suspend fun forgotPassword(email: String): AuthResult<Unit> =
        suspendCancellableCoroutine { continuation ->
            auth.sendPasswordResetEmail(email)
                .addOnSuccessListener {
                    continuation.resume(AuthResult.Success(Unit))
                }
                .addOnFailureListener { exception ->
                    continuation.resume(AuthResult.Error(exception))
                }
        }

    fun logout() {
        auth.signOut()
    }

    fun getCurrentUser(): FirebaseUser? {
        return auth.currentUser
    }

    fun isLoggedIn(): Boolean {
        return auth.currentUser != null
    }
}
