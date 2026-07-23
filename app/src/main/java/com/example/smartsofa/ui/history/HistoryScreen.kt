package com.example.smartsofa.ui.history

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.smartsofa.data.model.HistoryItem
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(
    viewModel: HistoryViewModel
) {
    val items by viewModel.filteredItems.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedFilter by viewModel.selectedFilter.collectAsState()
    var isSearchExpanded by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            if (isSearchExpanded) {
                SearchBar(
                    query = searchQuery,
                    onQueryChange = viewModel::updateSearchQuery,
                    onSearch = { isSearchExpanded = false },
                    active = true,
                    onActiveChange = { if (!it) isSearchExpanded = false },
                    placeholder = { Text("Search history") },
                    leadingIcon = {
                        IconButton(onClick = { 
                            isSearchExpanded = false 
                            viewModel.updateSearchQuery("")
                        }) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                        }
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { }
            } else {
                TopAppBar(
                    title = { Text("Activity History", fontWeight = FontWeight.Bold) },
                    actions = {
                        IconButton(onClick = { isSearchExpanded = true }) {
                            Icon(Icons.Default.Search, contentDescription = "Search")
                        }
                    }
                )
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            val filters = listOf("All", "Person", "Fan", "Light", "ESP32", "Firebase")
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(filters) { filter ->
                    FilterChip(
                        selected = filter == selectedFilter,
                        onClick = { viewModel.updateFilter(filter) },
                        label = { Text(filter) }
                    )
                }
            }

            if (items.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.History,
                            contentDescription = null,
                            modifier = Modifier.size(64.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            "No history found",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp)
                ) {
                    items(items, key = { it.id }) { item ->
                        HistoryTimelineItem(item = item)
                    }
                }
            }
        }
    }
}

@Composable
fun HistoryTimelineItem(item: HistoryItem) {
    val iconData = getHistoryIconData(item.type)
    val formatter = SimpleDateFormat("MMM dd, yyyy - HH:mm", Locale.getDefault())
    val dateString = formatter.format(Date(item.timestamp))
    
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.width(40.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(iconData.color.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = iconData.icon,
                    contentDescription = null,
                    tint = iconData.color,
                    modifier = Modifier.size(16.dp)
                )
            }
            Box(
                modifier = Modifier
                    .weight(1f)
                    .width(2.dp)
                    .background(MaterialTheme.colorScheme.outlineVariant)
            )
        }
        
        Card(
            modifier = Modifier
                .weight(1f)
                .padding(start = 8.dp, bottom = 16.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
            ),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp)
            ) {
                Text(
                    text = iconData.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = item.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = dateString,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

data class HistoryIconData(val icon: ImageVector, val color: Color, val title: String)

fun getHistoryIconData(type: String): HistoryIconData {
    return when (type) {
        "person_sitting" -> HistoryIconData(Icons.Default.Person, Color.Green, "Person Sitting")
        "person_left" -> HistoryIconData(Icons.Default.PersonOutline, Color.Gray, "Person Left")
        "fan_on" -> HistoryIconData(Icons.Default.WindPower, Color.Blue, "Fan Turned ON")
        "fan_off" -> HistoryIconData(Icons.Default.WindPower, Color.Gray, "Fan Turned OFF")
        "light_on" -> HistoryIconData(Icons.Default.Lightbulb, Color(0xFFFFB300), "Light Turned ON")
        "light_off" -> HistoryIconData(Icons.Default.Lightbulb, Color.Gray, "Light Turned OFF")
        "esp32_connected" -> HistoryIconData(Icons.Default.Wifi, Color.Green, "ESP32 Connected")
        "esp32_disconnected" -> HistoryIconData(Icons.Default.WifiOff, Color.Red, "ESP32 Disconnected")
        "firebase_connected" -> HistoryIconData(Icons.Default.Cloud, Color.Green, "Firebase Connected")
        "firebase_disconnected" -> HistoryIconData(Icons.Default.CloudOff, Color.Red, "Firebase Disconnected")
        else -> HistoryIconData(Icons.Default.Info, Color.Gray, "Unknown Event")
    }
}
