package com.example.smartsofa.ui.splash

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.Canvas
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
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlin.random.Random

// Colors from spec
private val GradTop = Color(0xFF0A1F44)
private val GradMid = Color(0xFF1565C0)
private val GradBot = Color(0xFF42A5F5)
private val ParticleColor = Color(0xFF90CAF9)
private val WifiGlowColor = Color(0xFF4FC3F7)
private val SubtitleColor = Color(0xFFBBDEFB)

@Composable
fun SplashScreen(
    onNavigateToLogin: () -> Unit,
    onNavigateToDashboard: () -> Unit
) {
    // Logo Animations
    var logoVisible by remember { mutableStateOf(false) }
    val logoScale = remember { Animatable(0.7f) }
    val logoAlpha = remember { Animatable(0f) }

    // Breathing scale animation using infinite transition (non-blocking)
    val infiniteTransition = rememberInfiniteTransition(label = "splash_breathing")
    val breathingScale by infiniteTransition.animateFloat(
        initialValue = 1.0f,
        targetValue = 1.04f,
        animationSpec = infiniteRepeatable(
            animation = tween(900, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "breathing"
    )

    // Text Animations
    var textVisible by remember { mutableStateOf(false) }
    var subtitleVisible by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        // 1. Logo invisible at 0ms, wait 300ms
        delay(300)
        logoVisible = true
        
        // 2. Fade in & scale up over 600ms (Overshoot)
        launch {
            logoAlpha.animateTo(1f, tween(600, easing = LinearEasing))
        }
        logoScale.animateTo(
            targetValue = 1f,
            animationSpec = tween(600, easing = {
                val t = it - 1f
                (t * t * ((2f + 1f) * t + 2f) + 1f)
            })
        )
    }

    LaunchedEffect(Unit) {
        // Slide up title at 700ms
        delay(700)
        textVisible = true
        // Fade in subtitle shortly after
        delay(300)
        subtitleVisible = true
    }

    var hasNavigated by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        // Wait 2500ms total splash duration
        delay(2500)
        if (!hasNavigated) {
            hasNavigated = true
            val user = FirebaseAuthManager.getCurrentUser()
            if (user != null) {
                onNavigateToDashboard()
            } else {
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
        // AI Particles Background
        AiParticles()

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
                // Glassmorphism background with glow
                Box(
                    modifier = Modifier
                        .size(160.dp)
                        .shadow(24.dp, CircleShape, spotColor = WifiGlowColor, ambientColor = WifiGlowColor)
                        .background(Color.White.copy(alpha = 0.1f), CircleShape)
                )

                // The Logo
                Image(
                    painter = painterResource(id = R.drawable.splash_logo),
                    contentDescription = "Smart Sofa Logo",
                    modifier = Modifier
                        .size(140.dp)
                        .clip(CircleShape),
                    contentScale = ContentScale.Crop
                )

                // Wifi Waves above logo
                WifiWaves()
            }

            Spacer(modifier = Modifier.height(32.dp))

            // App Title (Slide Up + Fade In)
            AnimatedVisibility(
                visible = textVisible,
                enter = slideInVertically(
                    initialOffsetY = { 50 },
                    animationSpec = tween(700, easing = FastOutSlowInEasing)
                ) + fadeIn(tween(700))
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

            // Subtitle
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

        // Loading Dots at bottom
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 64.dp)
        ) {
            ThreeDotsLoading()
        }
    }
}

@Composable
fun AiParticles() {
    val infiniteTransition = rememberInfiniteTransition(label = "particles_time")
    val timeState = infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1000f,
        animationSpec = infiniteRepeatable(tween(100000, easing = LinearEasing)),
        label = "particle_anim"
    )

    val particles = remember {
        List(40) {
            Particle(
                xProgress = Random.nextFloat(),
                yProgress = Random.nextFloat(),
                size = Random.nextFloat() * 6f + 2f,
                speedX = (Random.nextFloat() - 0.5f) * 0.002f,
                speedY = (Random.nextFloat() - 0.5f) * 0.002f,
                alpha = Random.nextFloat() * 0.3f
            )
        }
    }

    Canvas(modifier = Modifier.fillMaxSize()) {
        val w = size.width
        val h = size.height
        val time = timeState.value

        particles.forEach { p ->
            var curX = (p.xProgress + p.speedX * time) % 1f
            if (curX < 0) curX += 1f
            
            var curY = (p.yProgress + p.speedY * time) % 1f
            if (curY < 0) curY += 1f

            drawCircle(
                color = ParticleColor,
                radius = p.size,
                center = Offset(curX * w, curY * h),
                alpha = p.alpha
            )
        }
    }
}

class Particle(
    val xProgress: Float,
    val yProgress: Float,
    val size: Float,
    val speedX: Float,
    val speedY: Float,
    val alpha: Float
)

@Composable
fun WifiWaves() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.TopCenter) {
        WifiWaveArc(delay = 0)
        WifiWaveArc(delay = 200)
        WifiWaveArc(delay = 400)
    }
}

@Composable
private fun WifiWaveArc(delay: Int) {
    val infiniteTransition = rememberInfiniteTransition(label = "wifi_$delay")
    val waveProgress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = LinearEasing, delayMillis = delay),
            repeatMode = RepeatMode.Restart
        ),
        label = "wave_progress"
    )

    val alpha = if (waveProgress < 0.5f) {
        waveProgress * 2f
    } else {
        (1f - waveProgress) * 2f
    }
    val scale = 0.8f + (0.4f * waveProgress)

    Canvas(
        modifier = Modifier
            .padding(top = 16.dp)
            .size(60.dp)
            .scale(scale)
            .alpha(alpha)
    ) {
        val strokeWidth = 3.dp.toPx()
        drawArc(
            color = WifiGlowColor,
            startAngle = 210f,
            sweepAngle = 120f,
            useCenter = false,
            style = Stroke(width = strokeWidth)
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
            animation = tween(400, delayMillis = delay, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "dot_alpha"
    )
    Box(
        modifier = Modifier
            .size(8.dp)
            .alpha(alpha)
            .background(Color.White, CircleShape)
    )
}
