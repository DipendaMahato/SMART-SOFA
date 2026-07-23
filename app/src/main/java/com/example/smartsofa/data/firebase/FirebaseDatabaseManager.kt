package com.example.smartsofa.data.firebase

import com.example.smartsofa.data.model.*
import com.example.smartsofa.utils.Constants
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

object FirebaseDatabaseManager {
    private val database by lazy {
        FirebaseDatabase.getInstance("https://smartsofa-11154-default-rtdb.asia-southeast1.firebasedatabase.app/").reference
    }

    fun observeSofaStatus(): Flow<SofaStatus> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                try {
                    val data = snapshot.getValue(SofaStatus::class.java) ?: SofaStatus()
                    trySend(data)
                } catch (e: Exception) {
                    trySend(SofaStatus())
                }
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        database.child(Constants.PATH_SOFA).addValueEventListener(listener)
        awaitClose { database.child(Constants.PATH_SOFA).removeEventListener(listener) }
    }

    fun observeDeviceStatus(): Flow<DeviceStatus> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                try {
                    val data = snapshot.getValue(DeviceStatus::class.java) ?: DeviceStatus()
                    trySend(data)
                } catch (e: Exception) {
                    trySend(DeviceStatus())
                }
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        database.child(Constants.PATH_DEVICES).addValueEventListener(listener)
        awaitClose { database.child(Constants.PATH_DEVICES).removeEventListener(listener) }
    }

    fun observeControls(): Flow<Controls> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                try {
                    val data = snapshot.getValue(Controls::class.java) ?: Controls()
                    trySend(data)
                } catch (e: Exception) {
                    trySend(Controls())
                }
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        database.child(Constants.PATH_CONTROLS).addValueEventListener(listener)
        awaitClose { database.child(Constants.PATH_CONTROLS).removeEventListener(listener) }
    }

    fun observeElectricalInfo(): Flow<ElectricalInfo> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                try {
                    val data = snapshot.getValue(ElectricalInfo::class.java) ?: ElectricalInfo()
                    trySend(data)
                } catch (e: Exception) {
                    trySend(ElectricalInfo())
                }
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        database.child(Constants.PATH_ELECTRICAL).addValueEventListener(listener)
        awaitClose { database.child(Constants.PATH_ELECTRICAL).removeEventListener(listener) }
    }

    fun observeHistory(): Flow<List<HistoryItem>> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<HistoryItem>()
                for (child in snapshot.children) {
                    child.getValue(HistoryItem::class.java)?.let { list.add(it) }
                }
                trySend(list)
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        database.child(Constants.PATH_HISTORY).addValueEventListener(listener)
        awaitClose { database.child(Constants.PATH_HISTORY).removeEventListener(listener) }
    }

    fun observeNotifications(): Flow<List<NotificationItem>> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<NotificationItem>()
                for (child in snapshot.children) {
                    child.getValue(NotificationItem::class.java)?.let { list.add(it) }
                }
                trySend(list)
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        database.child(Constants.PATH_NOTIFICATIONS).addValueEventListener(listener)
        awaitClose { database.child(Constants.PATH_NOTIFICATIONS).removeEventListener(listener) }
    }

    fun observeEnergyDaily(): Flow<List<EnergyData>> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<EnergyData>()
                for (child in snapshot.children) {
                    child.getValue(EnergyData::class.java)?.let { list.add(it) }
                }
                trySend(list)
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        database.child(Constants.PATH_ENERGY).child("daily").addValueEventListener(listener)
        awaitClose { database.child(Constants.PATH_ENERGY).child("daily").removeEventListener(listener) }
    }

    fun observeEnergyWeekly(): Flow<List<EnergyData>> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<EnergyData>()
                for (child in snapshot.children) {
                    child.getValue(EnergyData::class.java)?.let { list.add(it) }
                }
                trySend(list)
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        database.child(Constants.PATH_ENERGY).child("weekly").addValueEventListener(listener)
        awaitClose { database.child(Constants.PATH_ENERGY).child("weekly").removeEventListener(listener) }
    }

    fun observeEnergyMonthly(): Flow<List<EnergyData>> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<EnergyData>()
                for (child in snapshot.children) {
                    child.getValue(EnergyData::class.java)?.let { list.add(it) }
                }
                trySend(list)
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        database.child(Constants.PATH_ENERGY).child("monthly").addValueEventListener(listener)
        awaitClose { database.child(Constants.PATH_ENERGY).child("monthly").removeEventListener(listener) }
    }

    fun getUserProfile(uid: String): Flow<User> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val user = snapshot.getValue(User::class.java) ?: User(uid = uid)
                trySend(user)
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        database.child(Constants.PATH_USERS).child(uid).child(Constants.PATH_PROFILE).addValueEventListener(listener)
        awaitClose { database.child(Constants.PATH_USERS).child(uid).child(Constants.PATH_PROFILE).removeEventListener(listener) }
    }

    suspend fun updateFanState(on: Boolean) = suspendCancellableCoroutine { continuation ->
        database.child(Constants.PATH_CONTROLS).child("fan").setValue(on)
            .addOnSuccessListener { continuation.resume(Unit) }
            .addOnFailureListener { continuation.resumeWithException(it) }
    }

    suspend fun updateLightState(on: Boolean) = suspendCancellableCoroutine { continuation ->
        database.child(Constants.PATH_CONTROLS).child("light").setValue(on)
            .addOnSuccessListener { continuation.resume(Unit) }
            .addOnFailureListener { continuation.resumeWithException(it) }
    }

    suspend fun updateMode(mode: String) = suspendCancellableCoroutine { continuation ->
        database.child(Constants.PATH_CONTROLS).child("mode").setValue(mode)
            .addOnSuccessListener { continuation.resume(Unit) }
            .addOnFailureListener { continuation.resumeWithException(it) }
    }

    suspend fun deleteNotification(id: String) = suspendCancellableCoroutine { continuation ->
        database.child(Constants.PATH_NOTIFICATIONS).child(id).removeValue()
            .addOnSuccessListener { continuation.resume(Unit) }
            .addOnFailureListener { continuation.resumeWithException(it) }
    }

    suspend fun clearAllNotifications() = suspendCancellableCoroutine { continuation ->
        database.child(Constants.PATH_NOTIFICATIONS).removeValue()
            .addOnSuccessListener { continuation.resume(Unit) }
            .addOnFailureListener { continuation.resumeWithException(it) }
    }

    suspend fun markNotificationRead(id: String) = suspendCancellableCoroutine { continuation ->
        database.child(Constants.PATH_NOTIFICATIONS).child(id).child("read").setValue(true)
            .addOnSuccessListener { continuation.resume(Unit) }
            .addOnFailureListener { continuation.resumeWithException(it) }
    }

    suspend fun updateUserProfile(uid: String, fullName: String) = suspendCancellableCoroutine { continuation ->
        database.child(Constants.PATH_USERS).child(uid).child(Constants.PATH_PROFILE).child("fullName").setValue(fullName)
            .addOnSuccessListener { continuation.resume(Unit) }
            .addOnFailureListener { continuation.resumeWithException(it) }
    }

    fun observeFirebaseConnection(): Flow<Boolean> = callbackFlow {
        val infoRef = FirebaseDatabase.getInstance("https://smartsofa-11154-default-rtdb.asia-southeast1.firebasedatabase.app/").getReference(".info/connected")
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val connected = snapshot.getValue(Boolean::class.java) ?: false
                trySend(connected)
            }
            override fun onCancelled(error: DatabaseError) {
                trySend(false)
            }
        }
        infoRef.addValueEventListener(listener)
        awaitClose { infoRef.removeEventListener(listener) }
    }
}
