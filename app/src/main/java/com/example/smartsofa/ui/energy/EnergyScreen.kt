package com.example.smartsofa.ui.energy

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.smartsofa.data.model.ElectricalInfo

@Composable
fun EnergyScreen(viewModel: EnergyViewModel = viewModel()) {
    val electricalInfo by viewModel.electricalInfo.collectAsState()
    val cost by viewModel.estimatedCost.collectAsState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { /* Export */ }) {
                Icon(Icons.Default.Share, contentDescription = "Export")
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text("Energy Analytics", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            }
            item {
                TopSummaryRow(electricalInfo)
            }
            item {
                EnergySummaryCard(electricalInfo, cost)
            }
            item {
                ChartCard("Daily Consumption (kWh)") {
                    BarChart()
                }
            }
            item {
                ChartCard("Weekly Trend") {
                    LineChart()
                }
            }
            item {
                ChartCard("Device Breakdown") {
                    PieChart()
                }
            }
        }
    }
}

@Composable
fun TopSummaryRow(electricalInfo: ElectricalInfo) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        SummaryMiniCard("Voltage", "${electricalInfo.voltage} V", Color(0xFFE3F2FD), Color(0xFF1976D2), Modifier.weight(1f))
        SummaryMiniCard("Current", "${electricalInfo.current} A", Color(0xFFE8F5E9), Color(0xFF388E3C), Modifier.weight(1f))
        SummaryMiniCard("Power", "${electricalInfo.power} W", Color(0xFFFFF3E0), Color(0xFFF57C00), Modifier.weight(1f))
        SummaryMiniCard("Today", "${electricalInfo.dailyEnergy}", Color(0xFFF3E5F5), Color(0xFF7B1FA2), Modifier.weight(1f))
    }
}

@Composable
fun SummaryMiniCard(label: String, value: String, bgColor: Color, fgColor: Color, modifier: Modifier) {
    Card(shape = RoundedCornerShape(8.dp), modifier = modifier.aspectRatio(1f)) {
        Column(
            modifier = Modifier.fillMaxSize().background(bgColor).padding(4.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(value, color = fgColor, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Text(label, color = fgColor.copy(alpha = 0.8f), fontSize = 10.sp)
        }
    }
}

@Composable
fun EnergySummaryCard(electricalInfo: ElectricalInfo, cost: Float) {
    Card(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Summary", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Weekly Total:")
                Text("${electricalInfo.weeklyEnergy} kWh", fontWeight = FontWeight.Bold)
            }
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Monthly Total:")
                Text("${electricalInfo.monthlyEnergy} kWh", fontWeight = FontWeight.Bold)
            }
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Estimated Cost (₹8/kWh):")
                Text("₹${String.format("%.2f", cost)}", fontWeight = FontWeight.Bold, color = Color(0xFF4CAF50))
            }
        }
    }
}

@Composable
fun ChartCard(title: String, content: @Composable () -> Unit) {
    Card(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth().height(200.dp)) {
        Column(modifier = Modifier.padding(16.dp).fillMaxSize()) {
            Text(title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            Box(modifier = Modifier.fillMaxSize()) {
                content()
            }
        }
    }
}

@Composable
fun BarChart() {
    val data = listOf(2f, 3f, 1.5f, 4f, 2.5f, 5f, 3.5f)
    Canvas(modifier = Modifier.fillMaxSize()) {
        val maxVal = data.maxOrNull() ?: 1f
        val barWidth = size.width / (data.size * 2)
        
        data.forEachIndexed { index, value ->
            val barHeight = (value / maxVal) * size.height
            val x = index * (size.width / data.size) + barWidth / 2
            val y = size.height - barHeight
            
            drawRoundRect(
                color = Color(0xFF64B5F6),
                topLeft = Offset(x, y),
                size = Size(barWidth, barHeight),
                cornerRadius = CornerRadius(4.dp.toPx())
            )
        }
    }
}

@Composable
fun LineChart() {
    val data = listOf(10f, 15f, 12f, 20f, 18f, 25f)
    Canvas(modifier = Modifier.fillMaxSize()) {
        val maxVal = data.maxOrNull() ?: 1f
        val path = Path()
        
        data.forEachIndexed { index, value ->
            val x = index * (size.width / (data.size - 1))
            val y = size.height - ((value / maxVal) * size.height)
            
            if (index == 0) {
                path.moveTo(x, y)
            } else {
                path.lineTo(x, y)
            }
            drawCircle(color = Color(0xFF81C784), radius = 4.dp.toPx(), center = Offset(x, y))
        }
        
        drawPath(path = path, color = Color(0xFF4CAF50), style = Stroke(width = 3.dp.toPx()))
    }
}

@Composable
fun PieChart() {
    Canvas(modifier = Modifier.fillMaxSize()) {
        val radius = size.minDimension / 2 - 16.dp.toPx()
        val center = Offset(size.width / 2, size.height / 2)
        
        // Fan 60%
        drawArc(
            color = Color(0xFF64B5F6),
            startAngle = -90f,
            sweepAngle = 360f * 0.6f,
            useCenter = true,
            topLeft = Offset(center.x - radius, center.y - radius),
            size = Size(radius * 2, radius * 2)
        )
        // Light 40%
        drawArc(
            color = Color(0xFFFFB74D),
            startAngle = -90f + (360f * 0.6f),
            sweepAngle = 360f * 0.4f,
            useCenter = true,
            topLeft = Offset(center.x - radius, center.y - radius),
            size = Size(radius * 2, radius * 2)
        )
    }
}
