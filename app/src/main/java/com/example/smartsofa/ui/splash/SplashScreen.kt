package com.example.smartsofa.ui.splash

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.smartsofa.R
import com.example.smartsofa.data.firebase.FirebaseAuthManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.random.Random

// Colors from spec
private val GradTop = Color(0xFF0A1F44)
private val GradMid = Color(0xFF1565C0)
private val GradBot = Color(0xFF42A5F5)
private val ParticleColor = Color(0xFF90CAF9)
private val WifiGlowColor = Color(0xFF4FC3F7)
private val SubtitleColor = Color(0xFFBBDEFB)

// Lightweight particle data — computed once, not per-frame
private data class Particle(
    val xFraction: Float,
    val yFraction: Float,
    val size: Float,
    val alpha: Float
)

// Pre-generate particles at top level so they aren't recreated on recomposition
private val splashParticles: List<Particle> = List(12) {
    Particle(
        xFraction = Random.nextFloat(),
        yFraction = Random.nextFloat(),
        size = Random.nextFloat() * 4f + 2f,
        alpha = Random.nextFloat() * 0.25f + 0.05f
    )
}

@Composable
fun SplashScreen(
    onNavigateToLogin: () -> Unit,
    onNavigateToDashboard: () -> Unit
) {
    // Logo animation — single animatable, non-blocking
    val logoScale = remember { Animatable(0.75f) }
    val logoAlpha = remember { Animatable(0f) }
    var textVisible by remember { mutableStateOf(false) }
    var subtitleVisible by remember { mutableStateOf(false) }
    var hasNavigated by remember { mutableStateOf(false) }

    // Breathing animation using infinite transition (GPU-driven, no main-thread work)
    val infiniteTransition = rememberInfiniteTransition(label = "breathing")
    val breathingScale by infiniteTransition.animateFloat(
        initialValue = 1.0f,
        targetValue = 1.03f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "breathe"
    )

    // All launch effects in ONE LaunchedEffect to avoid multiple coroutines racing
    LaunchedEffect(Unit) {
        // Phase 1: animate logo in
        delay(200)
        launch { logoAlpha.animateTo(1f, tween(500, easing = LinearEasing)) }
        logoScale.animateTo(1f, tween(500, easing = FastOutSlowInEasing))

        // Phase 2: show text
        delay(200)
        textVisible = true
        delay(250)
        subtitleVisible = true

        // Phase 3: wait for full screen render before navigating
        // 4500ms total — gives enough time for JIT compilation on first run
        // so navigation never fires on a half-drawn screen
        delay(3800)

        if (!hasNavigated) {
            hasNavigated = true
            try {
                val user = FirebaseAuthManager.getCurrentUser()
                if (user != null) {
                    onNavigateToDashboard()
                } else {
                    onNavigateToLogin()
                }
            } catch (e: Exception) {
                // Firebase not ready yet — navigate to login as safe fallback
                onNavigateToLogin()
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(listOf(GradTop, GradMid, GradBot))
            ),
        contentAlignment = Alignment.Center
    ) {
        // Lightweight static particle overlay — no per-frame canvas work
        LightParticles()

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Logo & Wifi Area
            Box(
                modifier = Modifier
                    .size(240.dp)
                    .scale(logoScale.value * breathingScale)
                    .alpha(logoAlpha.value),
                contentAlignment = Alignment.Center
            ) {
                // Glassmorphism glow ring
                Box(
                    modifier = Modifier
                        .size(160.dp)
                        .shadow(20.dp, CircleShape, spotColor = WifiGlowColor, ambientColor = WifiGlowColor)
                        .background(Color.White.copy(alpha = 0.08f), CircleShape)
                )

                // Logo image
                Image(
                    painter = painterResource(id = R.drawable.splash_logo),
                    contentDescription = "Smart Sofa Logo",
                    modifier = Modifier
                        .size(140.dp)
                        .clip(CircleShape),
                    contentScale = ContentScale.Crop
                )

                // Wifi waves — lightweight, 2 arcs instead of 3
                WifiWaves()
            }

            Spacer(modifier = Modifier.height(32.dp))

            AnimatedVisibility(
                visible = textVisible,
                enter = slideInVertically(
                    initialOffsetY = { 40 },
                    animationSpec = tween(600, easing = FastOutSlowInEasing)
                ) + fadeIn(tween(600))
            ) {
                Text(
                    text = "SMART SOFA",
                    fontSize = 34.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    letterSpacing = 2.sp
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            AnimatedVisibility(
                visible = subtitleVisible,
                enter = fadeIn(tween(500))
            ) {
                Text(
                    text = "Smart Living • Intelligent Comfort",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Medium,
                    color = SubtitleColor,
                    letterSpacing = 1.sp
                )
            }
        }

        // Loading dots at bottom
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 64.dp)
        ) {
            ThreeDotsLoading()
        }
    }
}

/**
 * Draws 12 static translucent circles as a background texture.
 * Unlike the original 40-particle animated version, these don't move
 * and don't require any per-frame canvas work — zero main-thread load.
 */
@Composable
fun LightParticles() {
    androidx.compose.foundation.Canvas(modifier = Modifier.fillMaxSize()) {
        val w = size.width
        val h = size.height
        splashParticles.forEach { p ->
            drawCircle(
                color = ParticleColor,
                radius = p.size,
                center = Offset(p.xFraction * w, p.yFraction * h),
                alpha = p.alpha
            )
        }
    }
}

@Composable
fun WifiWaves() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.TopCenter) {
        WifiWaveArc(delay = 0)
        WifiWaveArc(delay = 300)
    }
}

@Composable
private fun WifiWaveArc(delay: Int) {
    val infiniteTransition = rememberInfiniteTransition(label = "wifi_$delay")
    val waveProgress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing, delayMillis = delay),
            repeatMode = RepeatMode.Restart
        ),
        label = "wave_$delay"
    )
    val alpha = if (waveProgress < 0.5f) waveProgress * 2f else (1f - waveProgress) * 2f
    val scale = 0.8f + (0.4f * waveProgress)

    androidx.compose.foundation.Canvas(
        modifier = Modifier
            .padding(top = 16.dp)
            .size(60.dp)
            .scale(scale)
            .alpha(alpha)
    ) {
        drawArc(
            color = WifiGlowColor,
            startAngle = 210f,
            sweepAngle = 120f,
            useCenter = false,
            style = Stroke(width = 3.dp.toPx())
        )
    }
}

@Composable
fun ThreeDotsLoading() {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        LoadingDot(delay = 0)
        LoadingDot(delay = 200)
        LoadingDot(delay = 400)
    }
}

@Composable
private fun LoadingDot(delay: Int) {
    val infiniteTransition = rememberInfiniteTransition(label = "dot_$delay")
    val alpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(500, delayMillis = delay, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "dot_alpha_$delay"
    )
    Box(
        modifier = Modifier
            .size(8.dp)
            .alpha(alpha)
            .background(Color.White, CircleShape)
    )
}
