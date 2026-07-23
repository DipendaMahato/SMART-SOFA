package com.example.smartsofa.ui.wificonfig

import android.annotation.SuppressLint
import android.bluetooth.BluetoothDevice
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.BluetoothSearching
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.smartsofa.data.bluetooth.BleState
import com.example.smartsofa.data.model.DeviceStatus
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

private val LightBlueGlow = Color(0xFF90CAF9)
private val ElectricCyan = Color(0xFF4FC3F7)
private val DeepNavy = Color(0xFF0A1F44)
private val RoyalBlue = Color(0xFF1565C0)

@OptIn(ExperimentalMaterial3Api::class)
@SuppressLint("MissingPermission")
@Composable
fun WifiConfigScreen(
    onNavigateBack: () -> Unit,
    viewModel: WifiConfigViewModel = viewModel()
) {
    val bleState by viewModel.bleState.collectAsState()
    val provisioningSuccess by viewModel.provisioningSuccess.collectAsState()
    val deviceStatus by viewModel.deviceStatus.collectAsState()

    var showScanSheet by remember { mutableStateOf(false) }
    var selectedDevice by remember { mutableStateOf<BluetoothDevice?>(null) }
    val sheetState = rememberModalBottomSheetState()

    val context = LocalContext.current
    val permissionLauncher = androidx.activity.compose.rememberLauncherForActivityResult(
        contract = androidx.activity.result.contract.ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val granted = permissions.values.all { it }
        if (granted) {
            viewModel.startScanning()
        }
    }

    fun requestPermissionsAndScan() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            val hasScan = androidx.core.content.ContextCompat.checkSelfPermission(
                context, android.Manifest.permission.BLUETOOTH_SCAN
            ) == android.content.pm.PackageManager.PERMISSION_GRANTED
            val hasConnect = androidx.core.content.ContextCompat.checkSelfPermission(
                context, android.Manifest.permission.BLUETOOTH_CONNECT
            ) == android.content.pm.PackageManager.PERMISSION_GRANTED
            
            if (hasScan && hasConnect) {
                viewModel.startScanning()
            } else {
                permissionLauncher.launch(
                    arrayOf(
                        android.Manifest.permission.BLUETOOTH_SCAN,
                        android.Manifest.permission.BLUETOOTH_CONNECT
                    )
                )
            }
        } else {
            val hasLocation = androidx.core.content.ContextCompat.checkSelfPermission(
                context, android.Manifest.permission.ACCESS_FINE_LOCATION
            ) == android.content.pm.PackageManager.PERMISSION_GRANTED
            
            if (hasLocation) {
                viewModel.startScanning()
            } else {
                permissionLauncher.launch(
                    arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION)
                )
            }
        }
    }

    // When BLE state changes to scanning, open the bottom sheet
    LaunchedEffect(bleState) {
        if (bleState is BleState.Scanning || bleState is BleState.DeviceFound) {
            showScanSheet = true
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Wi-Fi Configuration", fontWeight = FontWeight.Bold) },
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
        Box(
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
        ) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // 1. Current Wi-Fi Status Card
                item {
                    WifiStatusCard(deviceStatus)
                }

                // 2. Wi-Fi Input Form Card
                item {
                    WifiInputCard(
                        viewModel = viewModel,
                        onScanClicked = {
                            requestPermissionsAndScan()
                        },
                        onConnectClicked = {
                            if (selectedDevice == null) {
                                requestPermissionsAndScan()
                            } else {
                                viewModel.provision(selectedDevice!!)
                            }
                        }
                    )
                }

                // 3. Extra Actions Card
                item {
                    ActionsCard(
                        onReconnect = {
                            // Reset state and re-provision
                            selectedDevice?.let { viewModel.provision(it) }
                        },
                        onReset = {
                            viewModel.resetState()
                            selectedDevice = null
                        }
                    )
                }
            }

            // Provisioning Progress/Overlay Dialog
            AnimatedVisibility(visible = bleState !is BleState.Idle && bleState !is BleState.Scanning && bleState !is BleState.DeviceFound) {
                ProvisioningOverlay(
                    bleState = bleState,
                    onDismiss = { viewModel.resetState() }
                )
            }

            // Success Animation overlay
            AnimatedVisibility(visible = provisioningSuccess) {
                SuccessOverlay(
                    onDismiss = {
                        viewModel.resetState()
                        onNavigateBack()
                    }
                )
            }
        }
    }

    // BLE Device Scanner Bottom Sheet
    if (showScanSheet) {
        ModalBottomSheet(
            onDismissRequest = {
                viewModel.stopScanning()
                showScanSheet = false
            },
            sheetState = sheetState,
            dragHandle = { BottomSheetDefaults.DragHandle() },
            containerColor = MaterialTheme.colorScheme.surface
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Nearby Smart Sofa Devices",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Scanning Pulse Animation
                if (bleState is BleState.Scanning) {
                    ScanningPulse()
                    Spacer(modifier = Modifier.height(16.dp))
                }

                when (val state = bleState) {
                    is BleState.DeviceFound -> {
                        LazyColumn(
                            verticalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth().heightIn(max = 300.dp)
                        ) {
                            items(state.devices) { device ->
                                DeviceListItem(
                                    device = device,
                                    onClick = {
                                        selectedDevice = device
                                        showScanSheet = false
                                        viewModel.stopScanning()
                                        viewModel.provision(device)
                                    }
                                )
                            }
                        }
                    }
                    is BleState.Scanning -> {
                        Text(
                            text = "Searching for smart sofas...",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    is BleState.Error -> {
                        Text(
                            text = state.message,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                    else -> {}
                }
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}

@Composable
fun WifiStatusCard(deviceStatus: DeviceStatus) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Current Connection",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )

                // Status chip
                val isOnline = deviceStatus.wifiConnected && deviceStatus.firebaseConnected
                val chipBg = if (isOnline) Color(0xFFE8F5E9) else Color(0xFFFFEBEE)
                val chipText = if (isOnline) Color(0xFF2E7D32) else Color(0xFFC62828)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(chipBg)
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = if (isOnline) "Connected" else "Offline",
                        color = chipText,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // SSID info
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Wifi,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        text = "SSID",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = if (deviceStatus.wifiConnected) deviceStatus.wifiSsid else "Not connected",
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Signal strength info
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.SignalCellularAlt,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        text = "Signal Strength",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = if (deviceStatus.wifiConnected) "${deviceStatus.signalStrength} dBm" else "N/A",
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Last connected time
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Schedule,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        text = "Last Connected",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    val formattedTime = remember(deviceStatus.esp32aLastSeen) {
                        if (deviceStatus.esp32aLastSeen > 0) {
                            val sdf = SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault())
                            sdf.format(Date(deviceStatus.esp32aLastSeen))
                        } else {
                            "Never"
                        }
                    }
                    Text(
                        text = formattedTime,
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
fun WifiInputCard(
    viewModel: WifiConfigViewModel,
    onScanClicked: () -> Unit,
    onConnectClicked: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Text(
                text = "Wi-Fi Configuration Settings",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(16.dp))

            // SSID Input
            OutlinedTextField(
                value = viewModel.ssid,
                onValueChange = { viewModel.updateSsid(it) },
                label = { Text("Wi-Fi SSID") },
                leadingIcon = { Icon(Icons.Default.Wifi, contentDescription = null) },
                isError = viewModel.ssidError != null,
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                shape = RoundedCornerShape(12.dp)
            )
            if (viewModel.ssidError != null) {
                Text(
                    text = viewModel.ssidError!!,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(start = 8.dp, top = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Password Input
            OutlinedTextField(
                value = viewModel.password,
                onValueChange = { viewModel.updatePassword(it) },
                label = { Text("Wi-Fi Password") },
                leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                trailingIcon = {
                    IconButton(onClick = { viewModel.togglePasswordVisibility() }) {
                        Icon(
                            imageVector = if (viewModel.isPasswordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                            contentDescription = null
                        )
                    }
                },
                visualTransformation = if (viewModel.isPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                isError = viewModel.passwordError != null,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                shape = RoundedCornerShape(12.dp)
            )
            if (viewModel.passwordError != null) {
                Text(
                    text = viewModel.passwordError!!,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(start = 8.dp, top = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = onScanClicked,
                    modifier = Modifier.weight(1f).height(50.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.AutoMirrored.Filled.BluetoothSearching, contentDescription = null, tint = LightBlueGlow, modifier = Modifier.size(36.dp))
                    Text("Scan BLE", fontSize = 14.sp)
                }

                Button(
                    onClick = onConnectClicked,
                    modifier = Modifier.weight(1f).height(50.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Icon(Icons.AutoMirrored.Filled.Send, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Connect", fontSize = 14.sp)
                }
            }
        }
    }
}

@Composable
fun ActionsCard(
    onReconnect: () -> Unit,
    onReset: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            TextButton(onClick = onReconnect) {
                Icon(Icons.Default.Refresh, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Reconnect")
            }
            TextButton(
                onClick = onReset,
                colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.error)
            ) {
                Icon(Icons.Default.RestartAlt, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Reset Wi-Fi")
            }
        }
    }
}

@Composable
fun ScanningPulse() {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1.2f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_scale"
    )

    Box(
        modifier = Modifier
            .size(80.dp)
            .scale(scale)
            .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.2f), CircleShape),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.4f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.BluetoothSearching,
                contentDescription = null,
                tint = Color.White
            )
        }
    }
}

@SuppressLint("MissingPermission")
@Composable
fun DeviceListItem(
    device: BluetoothDevice,
    onClick: () -> Unit
) {
    ListItem(
        headlineContent = { Text(device.name ?: "Unknown Smart Sofa", fontWeight = FontWeight.Bold) },
        supportingContent = { Text(device.address) },
        leadingContent = {
            Icon(
                imageVector = Icons.Default.Weekend,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(28.dp)
            )
        },
        trailingContent = {
            Icon(Icons.Default.ChevronRight, contentDescription = null)
        },
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
    )
}

@Composable
fun ProvisioningOverlay(
    bleState: BleState,
    onDismiss: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.7f))
            .clickable(enabled = false) {},
        contentAlignment = Alignment.Center
    ) {
        Card(
            shape = RoundedCornerShape(28.dp),
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .padding(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Provisioning Device",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(24.dp))

                CircularProgressIndicator(
                    modifier = Modifier.size(56.dp),
                    strokeWidth = 5.dp
                )

                Spacer(modifier = Modifier.height(24.dp))

                val statusText = when (bleState) {
                    is BleState.Connecting -> "Connecting to Sofa over BLE..."
                    is BleState.Connected -> "Connected! Discovering services..."
                    is BleState.DiscoveringServices -> "Analyzing sofa features..."
                    is BleState.WritingCredentials -> "Sending Wi-Fi credentials securely..."
                    is BleState.CredentialsWritten -> "Wi-Fi credentials saved! Waiting for Sofa to connect online..."
                    is BleState.Error -> "Provisioning Error: ${bleState.message}"
                    else -> "Setting up sofa connection..."
                }

                Text(
                    text = statusText,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )

                Spacer(modifier = Modifier.height(24.dp))

                if (bleState is BleState.Error) {
                    Button(
                        onClick = onDismiss,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Dismiss")
                    }
                }
            }
        }
    }
}

@Composable
fun SuccessOverlay(
    onDismiss: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.8f))
            .clickable(enabled = false) {},
        contentAlignment = Alignment.Center
    ) {
        Card(
            shape = RoundedCornerShape(28.dp),
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .padding(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .background(Color(0xFFE8F5E9), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = null,
                        tint = Color(0xFF2E7D32),
                        modifier = Modifier.size(40.dp)
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = "Device Connected Successfully",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF2E7D32),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "Your Smart Sofa has successfully connected to the Wi-Fi network and Firebase Database.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32))
                ) {
                    Text("Done", color = Color.White)
                }
            }
        }
    }
}
