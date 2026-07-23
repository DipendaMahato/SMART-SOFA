package com.example.smartsofa.ui.auth

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun WelcomeScreen(
    onNavigateToLogin: () -> Unit,
    onNavigateToRegister: () -> Unit
) {
    // Premium dark futuristic smart home background gradient
    val backgroundBrush = Brush.verticalGradient(
        colors = listOf(
            Color(0xFF0F172A), // Slate 900
            Color(0xFF1E293B), // Slate 800
            Color(0xFF0F172A)  // Slate 900
        )
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(backgroundBrush)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .navigationBarsPadding()
                .statusBarsPadding(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // --- TOP LOGO SECTION ---
            // --- TOP LOGO SECTION ---
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 24.dp)
            ) {
                com.example.smartsofa.ui.components.SmartSofaLogo(
                    size = 90.dp,
                    isAnimated = true,
                    showBrandName = true,
                    showSubtitle = true
                )
            }

            // --- FEATURE ICONS ROW ---
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.Top
            ) {
                FeatureIconItem(icon = Icons.Default.Thermostat, title = "Temperature\nControl")
                FeatureIconItem(icon = Icons.Default.Chair, title = "Comfort\nSettings")
                FeatureIconItem(icon = Icons.Default.Mic, title = "Voice\nControl")
                FeatureIconItem(icon = Icons.Default.Eco, title = "Energy\nSaving")
                FeatureIconItem(icon = Icons.Default.BarChart, title = "Real-time\nMonitoring")
            }

            // --- SOFA VECTOR DRAWING WITH GLOWING NEON UNDERGLOW ---
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp),
                contentAlignment = Alignment.Center
            ) {
                // WiFi signal emitting above sofa
                Icon(
                    imageVector = Icons.Default.Wifi,
                    contentDescription = null,
                    tint = Color(0xFF3B82F6).copy(alpha = 0.8f),
                    modifier = Modifier
                        .size(48.dp)
                        .offset(y = (-75).dp)
                )

                // Canvas drawing of premium modern sofa with glowing lights
                Canvas(
                    modifier = Modifier
                        .fillMaxWidth(0.85f)
                        .height(140.dp)
                ) {
                    val width = size.width
                    val height = size.height

                    // 1. Neon Underglow Shadow / Light Leak (Bottom)
                    val glowBrush = Brush.radialGradient(
                        colors = listOf(Color(0xFF3B82F6).copy(alpha = 0.5f), Color.Transparent),
                        center = Offset(width / 2f, height - 10f),
                        radius = width / 2.2f
                    )
                    drawRect(
                        brush = glowBrush,
                        topLeft = Offset(width * 0.05f, height - 35f),
                        size = Size(width * 0.9f, 40f)
                    )

                    // 2. Main Sofa Base (Dark Grey Rounded Rect)
                    drawRoundRect(
                        color = Color(0xFF334155), // Slate 700
                        topLeft = Offset(width * 0.08f, height - 60f),
                        size = Size(width * 0.84f, 40f),
                        cornerRadius = CornerRadius(12f, 12f)
                    )

                    // 3. Neon Bottom Strip (Horizontal glowing blue line)
                    drawRoundRect(
                        color = Color(0xFF3B82F6),
                        topLeft = Offset(width * 0.08f, height - 28f),
                        size = Size(width * 0.84f, 6f),
                        cornerRadius = CornerRadius(4f, 4f)
                    )

                    // 4. Sofa Cushions (Seat cushions)
                    drawRoundRect(
                        color = Color(0xFF475569), // Slate 600
                        topLeft = Offset(width * 0.10f, height - 85f),
                        size = Size(width * 0.38f, 30f),
                        cornerRadius = CornerRadius(10f, 10f)
                    )
                    drawRoundRect(
                        color = Color(0xFF475569),
                        topLeft = Offset(width * 0.52f, height - 85f),
                        size = Size(width * 0.38f, 30f),
                        cornerRadius = CornerRadius(10f, 10f)
                    )

                    // 5. Left Armrest
                    drawRoundRect(
                        color = Color(0xFF334155),
                        topLeft = Offset(width * 0.04f, height - 90f),
                        size = Size(width * 0.08f, 60f),
                        cornerRadius = CornerRadius(14f, 14f)
                    )
                    // Neon accent on Left Armrest
                    drawRoundRect(
                        color = Color(0xFF3B82F6),
                        topLeft = Offset(width * 0.08f, height - 80f),
                        size = Size(width * 0.015f, 40f),
                        cornerRadius = CornerRadius(4f, 4f)
                    )

                    // 6. Right Armrest
                    drawRoundRect(
                        color = Color(0xFF334155),
                        topLeft = Offset(width * 0.88f, height - 90f),
                        size = Size(width * 0.08f, 60f),
                        cornerRadius = CornerRadius(14f, 14f)
                    )
                    // Neon accent on Right Armrest
                    drawRoundRect(
                        color = Color(0xFF3B82F6),
                        topLeft = Offset(width * 0.885f, height - 80f),
                        size = Size(width * 0.015f, 40f),
                        cornerRadius = CornerRadius(4f, 4f)
                    )

                    // 7. Backrest Cushions
                    drawRoundRect(
                        color = Color(0xFF475569),
                        topLeft = Offset(width * 0.10f, height - 125f),
                        size = Size(width * 0.39f, 45f),
                        cornerRadius = CornerRadius(12f, 12f)
                    )
                    drawRoundRect(
                        color = Color(0xFF475569),
                        topLeft = Offset(width * 0.51f, height - 125f),
                        size = Size(width * 0.39f, 45f),
                        cornerRadius = CornerRadius(12f, 12f)
                    )

                    // 8. Glowing control panel on left armrest
                    drawRoundRect(
                        color = Color(0xFF1E293B),
                        topLeft = Offset(width * 0.05f, height - 75f),
                        size = Size(width * 0.06f, 25f),
                        cornerRadius = CornerRadius(6f, 6f),
                        style = Stroke(width = 2f)
                    )
                    drawCircle(
                        color = Color(0xFF3B82F6),
                        radius = 2f,
                        center = Offset(width * 0.065f, height - 68f)
                    )
                    drawCircle(
                        color = Color(0xFF3B82F6),
                        radius = 2f,
                        center = Offset(width * 0.08f, height - 68f)
                    )
                    drawCircle(
                        color = Color(0xFF3B82F6),
                        radius = 2f,
                        center = Offset(width * 0.065f, height - 60f)
                    )
                    drawCircle(
                        color = Color(0xFF3B82F6),
                        radius = 2f,
                        center = Offset(width * 0.08f, height - 60f)
                    )
                }
            }

            // --- BOTTOM SHEET NAVIGATION PANEL ---
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(topStart = 40.dp, topEnd = 40.dp)),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFF0F172A) // Sleek Slate 900
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 16.dp),
                shape = RoundedCornerShape(topStart = 40.dp, topEnd = 40.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp, vertical = 32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Welcome Header Text
                    Text(
                        text = buildAnnotatedString {
                            append("Welcome to ")
                            withStyle(style = SpanStyle(color = Color(0xFF3B82F6), fontWeight = FontWeight.Bold)) {
                                append("Smart Sofa")
                            }
                        },
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold
                        ),
                        color = Color.White
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Smart living made simple.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray,
                        fontWeight = FontWeight.Normal
                    )

                    Spacer(modifier = Modifier.height(28.dp))

                    // Solid Blue Login Button
                    Button(
                        onClick = onNavigateToLogin,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp),
                        shape = RoundedCornerShape(27.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF1D4ED8) // Deep Blue Accent
                        )
                    ) {
                        Text(
                            text = "Login",
                            color = Color.White,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Outlined Sign Up Button
                    OutlinedButton(
                        onClick = onNavigateToRegister,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp),
                        shape = RoundedCornerShape(27.dp),
                        border = BorderStroke(1.dp, Color(0xFF334155)),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = Color.White
                        )
                    ) {
                        Text(
                            text = "Sign Up",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun FeatureIconItem(
    icon: ImageVector,
    title: String
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier.width(68.dp)
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(48.dp)
                .border(1.dp, Color(0xFF334155), CircleShape)
                .background(Color.White.copy(alpha = 0.03f), CircleShape)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = Color(0xFF3B82F6),
                modifier = Modifier.size(22.dp)
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
            color = Color.LightGray,
            textAlign = TextAlign.Center,
            lineHeight = 12.sp
        )
    }
}
