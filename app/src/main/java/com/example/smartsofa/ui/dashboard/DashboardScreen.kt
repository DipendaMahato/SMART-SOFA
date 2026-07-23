package com.example.smartsofa.ui.dashboard

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.smartsofa.data.model.Controls
import com.example.smartsofa.data.model.DeviceStatus
import com.example.smartsofa.data.model.ElectricalInfo
import com.example.smartsofa.data.model.SofaStatus
import java.util.concurrent.TimeUnit

@Composable
fun DashboardScreen(
    onNavigateToWifiConfig: () -> Unit,
    viewModel: DashboardViewModel = viewModel()
) {
    val sofaStatus by viewModel.sofaStatus.collectAsState()
    val deviceStatus by viewModel.deviceStatus.collectAsState()
    val controls by viewModel.controls.collectAsState()
    val electricalInfo by viewModel.electricalInfo.collectAsState()
    val userName by viewModel.userName.collectAsState()
    val currentTime by viewModel.currentTime.collectAsState()
    val lastSyncTime by viewModel.lastSyncTime.collectAsState()

    Scaffold { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                HeaderSection(userName, currentTime, lastSyncTime)
            }
            
            // Dynamic Offline Banner
            if (!deviceStatus.esp32aOnline && !deviceStatus.esp32bOnline) {
                item {
                    SetupDeviceBanner(onNavigateToWifiConfig)
                }
            }

            item {
                SofaStatusCard(sofaStatus)
            }
            item {
                DeviceStatusCard(deviceStatus)
            }
            item {
                ControlPanelCard(controls, viewModel)
            }
            item {
                ElectricalInfoCard(electricalInfo)
            }
            item {
                ComingSoonCard()
            }
        }
    }
}

@Composable
fun HeaderSection(userName: String, currentTime: String, lastSyncTime: String) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(text = "Hello, $userName! 👋", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(4.dp))
        Text(text = currentTime, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(text = "Last sync: $lastSyncTime", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun SetupDeviceBanner(onSetupClick: () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.8f)),
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onSetupClick)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Icon(
                    imageVector = Icons.Default.WifiOff,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onErrorContainer,
                    modifier = Modifier.size(32.dp)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        text = "Sofa Offline",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onErrorContainer
                    )
                    Text(
                        text = "Tap to configure device Wi-Fi over BLE",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.8f)
                    )
                }
            }
            Button(
                onClick = onSetupClick,
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.onErrorContainer,
                    contentColor = MaterialTheme.colorScheme.errorContainer
                ),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("Setup", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun SofaStatusCard(sofaStatus: SofaStatus) {
    val backgroundColor by animateColorAsState(
        targetValue = if (sofaStatus.occupied) Color(0xFFE8F5E9) else Color(0xFFF5F5F5),
        animationSpec = tween(500), label = ""
    )
    val dotColor by animateColorAsState(
        targetValue = if (sofaStatus.occupied) Color(0xFF4CAF50) else Color(0xFF9E9E9E),
        animationSpec = tween(500), label = ""
    )
    val timeChange = if (sofaStatus.occupied) {
        System.currentTimeMillis() - sofaStatus.lastEmptyAt
    } else {
        System.currentTimeMillis() - sofaStatus.lastOccupiedAt
    }
    val minutes = TimeUnit.MILLISECONDS.toMinutes(timeChange).coerceAtLeast(0)

    Card(
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.background(backgroundColor).padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(16.dp).clip(RoundedCornerShape(8.dp)).background(dotColor))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (sofaStatus.occupied) "Person Sitting" else "Seat Empty",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = "State for: $minutes min", style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
fun DeviceStatusCard(deviceStatus: DeviceStatus) {
    Card(shape = RoundedCornerShape(16.dp), elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = "Device Status", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                StatusItem("ESP32-A", deviceStatus.esp32aOnline, Icons.Default.Cloud)
                StatusItem("ESP32-B", deviceStatus.esp32bOnline, Icons.Default.Cloud)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                StatusItem("Wi-Fi", deviceStatus.wifiConnected, Icons.Default.Wifi)
                StatusItem("Firebase", deviceStatus.firebaseConnected, Icons.Default.Storage)
            }
        }
    }
}

@Composable
fun StatusItem(label: String, isOnline: Boolean, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, contentDescription = null, tint = if (isOnline) Color(0xFF4CAF50) else Color(0xFFF44336), modifier = Modifier.size(20.dp))
        Spacer(modifier = Modifier.width(4.dp))
        Text(text = label, style = MaterialTheme.typography.bodyMedium)
    }
}

@Composable
fun ControlPanelCard(controls: Controls, viewModel: DashboardViewModel) {
    Card(shape = RoundedCornerShape(16.dp), elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = "Control Panel", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text("Fan")
                Switch(checked = controls.fan, onCheckedChange = { viewModel.toggleFan() })
            }
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text("Light")
                Switch(checked = controls.light, onCheckedChange = { viewModel.toggleLight() })
            }
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text("Mode: ${controls.mode}")
                Button(onClick = { viewModel.setMode(if (controls.mode == "Auto") "Manual" else "Auto") }) {
                    Text(if (controls.mode == "Auto") "Set Manual" else "Set Auto")
                }
            }
        }
    }
}

@Composable
fun ElectricalInfoCard(electricalInfo: ElectricalInfo) {
    Card(shape = RoundedCornerShape(16.dp), elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = "Electrical Info", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                ElectricalValue("Voltage", "${electricalInfo.voltage} V", Color(0xFF64B5F6))
                ElectricalValue("Current", "${electricalInfo.current} A", Color(0xFF81C784))
                ElectricalValue("Power", "${electricalInfo.power} W", Color(0xFFFFB74D))
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text("Today's Energy: ${electricalInfo.dailyEnergy} kWh", fontWeight = FontWeight.Bold)
            Text("Relay Status: ${if (electricalInfo.relayStatus) "ON" else "OFF"}")
        }
    }
}

@Composable
fun ElectricalValue(label: String, value: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.background(color.copy(alpha = 0.2f), RoundedCornerShape(8.dp)).padding(8.dp)) {
        Text(text = value, fontWeight = FontWeight.Bold, color = color)
        Text(text = label, style = MaterialTheme.typography.bodySmall)
    }
}

@Composable
fun ComingSoonCard() {
    Card(shape = RoundedCornerShape(16.dp), elevation = CardDefaults.cardElevation(defaultElevation = 4.dp), modifier = Modifier.fillMaxWidth().height(150.dp)) {
        Box(modifier = Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color.Gray.copy(alpha = 0.1f), Color.Gray.copy(alpha = 0.3f)))), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.Lock, contentDescription = null, tint = Color.Gray)
                Spacer(modifier = Modifier.height(8.dp))
                Text("More Features Coming Soon", color = Color.DarkGray, fontWeight = FontWeight.Bold)
                Text("AI Health, Posture, Voice, OTA", color = Color.Gray, fontSize = 12.sp)
            }
        }
    }
}
