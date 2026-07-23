package com.example.smartsofa.ui.settings

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onLogout: () -> Unit,
    onNavigateToWifiConfig: () -> Unit,
    onNavigateToDeviceInfo: () -> Unit,
    viewModel: SettingsViewModel = viewModel()
) {
    val darkMode by viewModel.darkMode.collectAsState()
    val notificationsEnabled by viewModel.notificationsEnabled.collectAsState()
    val userName by viewModel.userName.collectAsState()
    val userEmail by viewModel.userEmail.collectAsState()
    val firebaseConnected by viewModel.firebaseConnected.collectAsState()

    var showLogoutDialog by remember { mutableStateOf(false) }
    var showLanguageDialog by remember { mutableStateOf(false) }
    var showPasswordDialog by remember { mutableStateOf(false) }
    var showFirmwareDialog by remember { mutableStateOf(false) }
    var expandedAbout by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings", fontWeight = FontWeight.Bold) },
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
                .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
        ) {
            // Profile Section
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primary),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = userName.take(2).uppercase(),
                                color = MaterialTheme.colorScheme.onPrimary,
                                style = MaterialTheme.typography.titleLarge
                            )
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = userName, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                            Text(text = userEmail, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        IconButton(onClick = { /* Edit Profile */ }) {
                            Icon(Icons.Default.Edit, contentDescription = "Edit Profile")
                        }
                    }
                }
            }

            // Account Section
            item {
                SectionHeader("Account")
                SettingsListItem(
                    headlineContent = "Change Password",
                    leadingIcon = Icons.Default.Lock,
                    onClick = { showPasswordDialog = true }
                )
                SettingsSwitchItem(
                    headlineContent = "Notifications",
                    leadingIcon = Icons.Default.Notifications,
                    checked = notificationsEnabled,
                    onCheckedChange = { viewModel.toggleNotifications() }
                )
                HorizontalDivider()
            }

            // Appearance Section
            item {
                SectionHeader("Appearance")
                SettingsSwitchItem(
                    headlineContent = "Dark Mode",
                    leadingIcon = Icons.Default.DarkMode,
                    checked = darkMode,
                    onCheckedChange = { viewModel.toggleDarkMode() }
                )
                SettingsListItem(
                    headlineContent = "Language",
                    supportingContent = "English",
                    leadingIcon = Icons.Default.Language,
                    onClick = { showLanguageDialog = true }
                )
                HorizontalDivider()
            }

            // Connection Status Section
            item {
                SectionHeader("Connection Status")
                SettingsListItem(
                    headlineContent = "Firebase Status",
                    leadingIcon = Icons.Default.Cloud,
                    trailingContent = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(12.dp)
                                    .clip(CircleShape)
                                    .background(if (firebaseConnected) Color.Green else Color.Red)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(if (firebaseConnected) "Connected" else "Disconnected")
                        }
                    }
                )
                SettingsListItem(
                    headlineContent = "Wi-Fi Configuration",
                    leadingIcon = Icons.Default.Wifi,
                    supportingContent = "Configure and setup Wi-Fi settings",
                    onClick = onNavigateToWifiConfig
                )
                SettingsListItem(
                    headlineContent = "Device Information",
                    leadingIcon = Icons.Default.Devices,
                    supportingContent = "Detailed hardware telemetry",
                    onClick = onNavigateToDeviceInfo
                )
                HorizontalDivider()
            }

            // About Section
            item {
                SectionHeader("About")
                SettingsListItem(
                    headlineContent = "About Smart Sofa",
                    leadingIcon = Icons.Default.Info,
                    onClick = { expandedAbout = !expandedAbout }
                )
                AnimatedVisibility(visible = expandedAbout) {
                    Text(
                        text = "Smart Sofa is a futuristic application to control and monitor your integrated sofa sensors, comfort metrics, and environmental statistics.",
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                    )
                }
                SettingsListItem(
                    headlineContent = "Firmware Update",
                    supportingContent = "Check and run OTA updates",
                    leadingIcon = Icons.Default.SystemUpdate,
                    onClick = { showFirmwareDialog = true }
                )
                SettingsListItem(
                    headlineContent = "Developer",
                    supportingContent = "Dipendra Mahato",
                    leadingIcon = Icons.Default.Person,
                )
                SettingsListItem(
                    headlineContent = "Version",
                    supportingContent = "1.0",
                    leadingIcon = Icons.Default.Build,
                )
                SettingsListItem(
                    headlineContent = "Rate App",
                    supportingContent = "Coming Soon",
                    leadingIcon = Icons.Default.Star,
                )
                SettingsListItem(
                    headlineContent = "Privacy Policy",
                    supportingContent = "Coming Soon",
                    leadingIcon = Icons.Default.PrivacyTip,
                )
                HorizontalDivider()
            }

            // Logout Button
            item {
                Spacer(modifier = Modifier.height(24.dp))
                Button(
                    onClick = { showLogoutDialog = true },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Icon(Icons.Default.Logout, contentDescription = "Logout")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Logout")
                }
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }

    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = { Text("Logout") },
            text = { Text("Are you sure you want to log out?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        showLogoutDialog = false
                        viewModel.logout()
                        onLogout()
                    }
                ) { Text("Logout", color = MaterialTheme.colorScheme.error) }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) { Text("Cancel") }
            }
        )
    }

    if (showLanguageDialog) {
        AlertDialog(
            onDismissRequest = { showLanguageDialog = false },
            title = { Text("Select Language") },
            text = {
                Column {
                    Text("English (Selected)")
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Other languages: Coming Soon", color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            },
            confirmButton = {
                TextButton(onClick = { showLanguageDialog = false }) { Text("OK") }
            }
        )
    }

    if (showFirmwareDialog) {
        AlertDialog(
            onDismissRequest = { showFirmwareDialog = false },
            title = { Text("Firmware Update") },
            text = {
                Text("Current Version: v1.0.0\n\nYour Smart Sofa firmware is up to date.")
            },
            confirmButton = {
                TextButton(onClick = { showFirmwareDialog = false }) { Text("OK") }
            }
        )
    }
}

@Composable
fun SectionHeader(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.labelLarge,
        color = MaterialTheme.colorScheme.primary,
        modifier = Modifier.padding(start = 16.dp, top = 24.dp, bottom = 8.dp, end = 16.dp)
    )
}

@Composable
fun SettingsListItem(
    headlineContent: String,
    leadingIcon: androidx.compose.ui.graphics.vector.ImageVector,
    supportingContent: String? = null,
    trailingContent: @Composable (() -> Unit)? = null,
    onClick: (() -> Unit)? = null
) {
    ListItem(
        headlineContent = { Text(headlineContent) },
        supportingContent = supportingContent?.let { { Text(it) } },
        leadingContent = { Icon(leadingIcon, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant) },
        trailingContent = trailingContent,
        modifier = if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier
    )
}

@Composable
fun SettingsSwitchItem(
    headlineContent: String,
    leadingIcon: androidx.compose.ui.graphics.vector.ImageVector,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    ListItem(
        headlineContent = { Text(headlineContent) },
        leadingContent = { Icon(leadingIcon, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant) },
        trailingContent = {
            Switch(checked = checked, onCheckedChange = onCheckedChange)
        }
    )
}
