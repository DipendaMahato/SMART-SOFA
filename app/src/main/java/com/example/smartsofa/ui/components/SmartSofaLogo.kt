package com.example.smartsofa.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Weekend
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.smartsofa.R

private val ElectricCyan = Color(0xFF4FC3F7)
private val DeepNavy = Color(0xFF0A1F44)
private val RoyalBlue = Color(0xFF1565C0)
private val LightBlueGlow = Color(0xFF90CAF9)

@Composable
fun SmartSofaLogo(
    modifier: Modifier = Modifier,
    size: Dp = 100.dp,
    isAnimated: Boolean = true,
    showBrandName: Boolean = false,
    showSubtitle: Boolean = false
) {
    val infiniteTransition = rememberInfiniteTransition(label = "logo_anim")

    // Ambient rotation angle
    val rotationAngle by if (isAnimated) {
        infiniteTransition.animateFloat(
            initialValue = 0f,
            targetValue = 360f,
            animationSpec = infiniteRepeatable(
                animation = tween(12000, easing = LinearEasing),
                repeatMode = RepeatMode.Restart
            ),
            label = "rotate"
        )
    } else {
        remember { mutableStateOf(0f) }
    }

    // Breathing scale animation
    val breathingScale by if (isAnimated) {
        infiniteTransition.animateFloat(
            initialValue = 1.0f,
            targetValue = 1.05f,
            animationSpec = infiniteRepeatable(
                animation = tween(1800, easing = FastOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "breathing"
        )
    } else {
        remember { mutableStateOf(1.0f) }
    }

    // Pulsing Wi-Fi signal arcs
    val wifiPulse by if (isAnimated) {
        infiniteTransition.animateFloat(
            initialValue = 0.3f,
            targetValue = 1.0f,
            animationSpec = infiniteRepeatable(
                animation = tween(1200, easing = FastOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "wifi_pulse"
        )
    } else {
        remember { mutableStateOf(1.0f) }
    }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = modifier
    ) {
        Box(
            modifier = Modifier
                .size(size * 1.3f)
                .scale(breathingScale),
            contentAlignment = Alignment.Center
        ) {
            // Rotating Ambient Light Ring
            Box(
                modifier = Modifier
                    .size(size * 1.25f)
                    .rotate(rotationAngle)
                    .background(
                        brush = Brush.sweepGradient(
                            listOf(
                                ElectricCyan.copy(alpha = 0.6f),
                                RoyalBlue.copy(alpha = 0.2f),
                                LightBlueGlow.copy(alpha = 0.5f),
                                DeepNavy.copy(alpha = 0.1f),
                                ElectricCyan.copy(alpha = 0.6f)
                            )
                        ),
                        shape = CircleShape
                    )
            )

            // Glassmorphic Center Card Frame with Glow Shadow
            Box(
                modifier = Modifier
                    .size(size)
                    .shadow(16.dp, CircleShape, spotColor = ElectricCyan, ambientColor = RoyalBlue)
                    .background(
                        brush = Brush.radialGradient(
                            colors = listOf(
                                RoyalBlue.copy(alpha = 0.85f),
                                DeepNavy.copy(alpha = 0.95f)
                            )
                        ),
                        shape = CircleShape
                    )
                    .border(
                        width = 2.dp,
                        brush = Brush.linearGradient(
                            listOf(ElectricCyan, LightBlueGlow.copy(alpha = 0.3f))
                        ),
                        shape = CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                // High-Res Image Logo inside circular clip
                Image(
                    painter = painterResource(id = R.drawable.splash_logo),
                    contentDescription = "Smart Sofa Logo",
                    modifier = Modifier
                        .size(size * 0.88f)
                        .clip(CircleShape),
                    contentScale = ContentScale.Crop
                )

                // Overlay Pulsing Wi-Fi Arcs above Logo Badge
                Canvas(
                    modifier = Modifier
                        .size(size * 0.8f)
                        .align(Alignment.TopCenter)
                        .offset(y = (-size * 0.08f))
                        .alpha(wifiPulse)
                ) {
                    val strokeW = (size * 0.03f).toPx()
                    drawArc(
                        color = ElectricCyan,
                        startAngle = 210f,
                        sweepAngle = 120f,
                        useCenter = false,
                        style = Stroke(width = strokeW)
                    )
                }
            }
        }

        if (showBrandName) {
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = buildAnnotatedString {
                    withStyle(style = SpanStyle(color = Color.White, fontWeight = FontWeight.Bold)) {
                        append("SMART ")
                    }
                    withStyle(style = SpanStyle(color = ElectricCyan, fontWeight = FontWeight.Bold)) {
                        append("SOFA")
                    }
                },
                fontSize = (size.value * 0.24f).sp,
                letterSpacing = 2.sp
            )
        }

        if (showSubtitle) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Smart Living • Intelligent Comfort",
                fontSize = (size.value * 0.13f).sp,
                color = LightBlueGlow.copy(alpha = 0.8f),
                fontWeight = FontWeight.Medium
            )
        }
    }
}
