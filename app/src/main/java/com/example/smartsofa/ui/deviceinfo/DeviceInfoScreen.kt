package com.example.smartsofa.ui.deviceinfo

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.smartsofa.data.firebase.FirebaseDatabaseManager
import com.example.smartsofa.data.model.DeviceStatus

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DeviceInfoScreen(
    onNavigateBack: () -> Unit
) {
    val deviceStatus by FirebaseDatabaseManager.observeDeviceStatus()
        .collectAsState(initial = DeviceStatus())

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Device Information", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(
                    Brush.verticalGradient(
                        listOf(
                            MaterialTheme.colorScheme.background,
                            MaterialTheme.colorScheme.primary.copy(alpha = 0.05f)
                        )
                    )
                )
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header Summary Card
            item {
                HeaderSummaryCard(deviceStatus)
            }

            // System Hardware Cards
            item {
                SectionTitle("Hardware Info")
            }
            item {
                HardwareInfoCard(deviceStatus)
            }

            // Network telemetry
            item {
                SectionTitle("Network Information")
            }
            item {
                NetworkTelemetryCard(deviceStatus)
            }
        }
    }
}

@Composable
fun SectionTitle(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.labelLarge,
        color = MaterialTheme.colorScheme.primary,
        modifier = Modifier.padding(start = 8.dp, top = 8.dp, bottom = 4.dp),
        fontWeight = FontWeight.Bold
    )
}

@Composable
fun HeaderSummaryCard(status: DeviceStatus) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Weekend,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(36.dp)
                )
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = status.deviceName,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "ID: ${status.deviceId} • Firmware: ${status.firmwareVersion}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun HardwareInfoCard(status: DeviceStatus) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // ESP32-A Status
            TelemetryRow(
                icon = Icons.Default.Memory,
                label = "ESP32-A Module",
                value = if (status.esp32aOnline) "Online" else "Offline",
                valueColor = if (status.esp32aOnline) Color(0xFF2E7D32) else Color(0xFFC62828)
            )

            HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)

            // ESP32-B Status
            TelemetryRow(
                icon = Icons.Default.Memory,
                label = "ESP32-B Module",
                value = if (status.esp32bOnline) "Online" else "Offline",
                valueColor = if (status.esp32bOnline) Color(0xFF2E7D32) else Color(0xFFC62828)
            )

            HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)

            // System Uptime
            val uptimeText = remember(status.uptimeSeconds) {
                val h = status.uptimeSeconds / 3600
                val m = (status.uptimeSeconds % 3600) / 60
                val s = status.uptimeSeconds % 60
                if (h > 0) "${h}h ${m}m" else "${m}m ${s}s"
            }
            TelemetryRow(
                icon = Icons.Default.AccessTime,
                label = "System Uptime",
                value = uptimeText
            )
        }
    }
}

@Composable
fun NetworkTelemetryCard(status: DeviceStatus) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Wi-Fi Connection
            TelemetryRow(
                icon = Icons.Default.Wifi,
                label = "Wi-Fi Network",
                value = if (status.wifiConnected) status.wifiSsid else "Disconnected",
                valueColor = if (status.wifiConnected) MaterialTheme.colorScheme.primary else Color(0xFFC62828)
            )

            HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)

            // Firebase Status
            TelemetryRow(
                icon = Icons.Default.CloudQueue,
                label = "Firebase Sync",
                value = if (status.firebaseConnected) "Synced" else "Disconnected",
                valueColor = if (status.firebaseConnected) Color(0xFF2E7D32) else Color(0xFFC62828)
            )

            HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)

            // Signal Strength
            TelemetryRow(
                icon = Icons.Default.SignalCellularAlt,
                label = "Signal Strength",
                value = if (status.wifiConnected) "${status.signalStrength} dBm" else "N/A"
            )

            HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)

            // IP Address
            TelemetryRow(
                icon = Icons.Default.Dns,
                label = "IP Address",
                value = if (status.wifiConnected) status.ipAddress else "N/A"
            )

            HorizontalDivider(color = MaterialTheme.colorScheme.surfaceVariant)

            // MAC Address
            TelemetryRow(
                icon = Icons.Default.SettingsEthernet,
                label = "MAC Address",
                value = status.macAddress
            )
        }
    }
}

@Composable
fun TelemetryRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
    valueColor: Color = MaterialTheme.colorScheme.onSurface
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium
            )
        }
        Text(
            text = value,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Bold,
            color = valueColor
        )
    }
}
