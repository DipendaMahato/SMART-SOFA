package com.example.smartsofa

import android.content.Context
import android.os.Bundle
import android.os.PowerManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.smartsofa.theme.SmartSofaTheme
import com.example.smartsofa.ui.auth.ForgotPasswordScreen
import com.example.smartsofa.ui.auth.LoginScreen
import com.example.smartsofa.ui.auth.RegisterScreen
import com.example.smartsofa.ui.auth.WelcomeScreen
import com.example.smartsofa.ui.dashboard.DashboardScreen
import com.example.smartsofa.ui.energy.EnergyScreen
import com.example.smartsofa.ui.history.HistoryScreen
import com.example.smartsofa.ui.notifications.NotificationsScreen
import com.example.smartsofa.ui.settings.SettingsScreen
import com.example.smartsofa.ui.splash.SplashScreen
import com.example.smartsofa.ui.wificonfig.WifiConfigScreen
import com.example.smartsofa.ui.deviceinfo.DeviceInfoScreen

class MainActivity : ComponentActivity() {

    // WakeLock keeps the CPU running and screen on even if FLAG_KEEP_SCREEN_ON
    // isn't sufficient on certain emulator/ROM configurations
    private var wakeLock: PowerManager.WakeLock? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Layer 1: Window-level flag — simplest, works while Activity is in foreground
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Layer 2: PowerManager WakeLock — survives deeper than window flags
        acquireWakeLock()

        setContent {
            SmartSofaTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    AppNavHost(navController = navController)
                }
            }
        }
    }

    private fun acquireWakeLock() {
        try {
            val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
            @Suppress("DEPRECATION")
            wakeLock = powerManager.newWakeLock(
                // SCREEN_BRIGHT_WAKE_LOCK keeps screen fully bright.
                // Deprecated in API 33 in favour of FLAG_KEEP_SCREEN_ON (which we also set).
                // Still fully functional on all Android versions as a secondary lock.
                PowerManager.SCREEN_BRIGHT_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "SmartSofa::ScreenWakeLock"
            ).also { lock ->
                // Acquire indefinitely — released only when app is destroyed
                lock.acquire()
            }
        } catch (e: Exception) {
            // If WakeLock acquisition fails (e.g. missing permission), FLAG_KEEP_SCREEN_ON
            // is still active as a fallback — log and continue
            android.util.Log.w("MainActivity", "WakeLock acquisition failed: ${e.message}")
        }
    }

    override fun onResume() {
        super.onResume()
        // Re-apply window flag every time app comes to foreground
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        // Re-acquire wakelock if it was released
        if (wakeLock?.isHeld == false) {
            try { wakeLock?.acquire() } catch (e: Exception) { /* ignore */ }
        }
    }

    override fun onDestroy() {
        // Release WakeLock when the app is truly closed by user
        try {
            if (wakeLock?.isHeld == true) {
                wakeLock?.release()
            }
        } catch (e: Exception) {
            android.util.Log.w("MainActivity", "WakeLock release error: ${e.message}")
        }
        super.onDestroy()
    }
}

@Composable
fun AppNavHost(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = "splash"
    ) {
        composable("splash") {
            SplashScreen(
                onNavigateToLogin = {
                    navController.navigate("welcome") {
                        popUpTo("splash") { inclusive = true }
                    }
                },
                onNavigateToDashboard = {
                    navController.navigate("main") {
                        popUpTo("splash") { inclusive = true }
                    }
                }
            )
        }
        composable("welcome") {
            WelcomeScreen(
                onNavigateToLogin = { navController.navigate("login") },
                onNavigateToRegister = { navController.navigate("register") }
            )
        }
        composable("login") {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate("main") {
                        popUpTo("welcome") { inclusive = true }
                    }
                },
                onNavigateToRegister = { navController.navigate("register") },
                onNavigateToForgotPassword = { navController.navigate("forgot_password") }
            )
        }
        composable("register") {
            RegisterScreen(
                onRegisterSuccess = {
                    navController.navigate("login") {
                        popUpTo("register") { inclusive = true }
                    }
                },
                onNavigateToLogin = { navController.popBackStack() }
            )
        }
        composable("forgot_password") {
            ForgotPasswordScreen(
                onNavigateToLogin = { navController.popBackStack() }
            )
        }
        composable("main") {
            MainScreenWithBottomNav(
                onLogout = {
                    navController.navigate("welcome") {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onNavigateToWifiConfig = {
                    navController.navigate("wifi_config")
                },
                onNavigateToDeviceInfo = {
                    navController.navigate("device_info")
                }
            )
        }
        composable("wifi_config") {
            WifiConfigScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        composable("device_info") {
            DeviceInfoScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}

sealed class BottomNavItem(val route: String, val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    object Home : BottomNavItem("dashboard", "Home", Icons.Default.Home)
    object Energy : BottomNavItem("energy", "Energy", Icons.Default.BarChart)
    object History : BottomNavItem("history", "History", Icons.Default.History)
    object Notifications : BottomNavItem("notifications", "Alerts", Icons.Default.Notifications)
    object Settings : BottomNavItem("settings", "Settings", Icons.Default.Settings)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreenWithBottomNav(
    onLogout: () -> Unit,
    onNavigateToWifiConfig: () -> Unit,
    onNavigateToDeviceInfo: () -> Unit
) {
    val bottomNavController = rememberNavController()
    val items = listOf(
        BottomNavItem.Home,
        BottomNavItem.Energy,
        BottomNavItem.History,
        BottomNavItem.Notifications,
        BottomNavItem.Settings
    )

    val notifications by com.example.smartsofa.data.firebase.FirebaseDatabaseManager.observeNotifications()
        .collectAsState(initial = emptyList())
    val unreadCount = remember(notifications) { notifications.count { !it.read } }

    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by bottomNavController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination

                items.forEach { screen ->
                    NavigationBarItem(
                        icon = {
                            if (screen == BottomNavItem.Notifications && unreadCount > 0) {
                                BadgedBox(
                                    badge = {
                                        Badge {
                                            Text(if (unreadCount > 99) "99+" else unreadCount.toString())
                                        }
                                    }
                                ) {
                                    Icon(screen.icon, contentDescription = screen.title)
                                }
                            } else {
                                Icon(screen.icon, contentDescription = screen.title)
                            }
                        },
                        label = {
                            Text(
                                screen.title,
                                fontWeight = if (currentDestination?.hierarchy?.any { it.route == screen.route } == true)
                                    FontWeight.Bold else FontWeight.Normal
                            )
                        },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            bottomNavController.navigate(screen.route) {
                                popUpTo(bottomNavController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            NavHost(
                navController = bottomNavController,
                startDestination = BottomNavItem.Home.route,
                enterTransition = { slideIntoContainer(AnimatedContentTransitionScope.SlideDirection.Left, animationSpec = tween(300)) },
                exitTransition = { slideOutOfContainer(AnimatedContentTransitionScope.SlideDirection.Left, animationSpec = tween(300)) },
                popEnterTransition = { slideIntoContainer(AnimatedContentTransitionScope.SlideDirection.Right, animationSpec = tween(300)) },
                popExitTransition = { slideOutOfContainer(AnimatedContentTransitionScope.SlideDirection.Right, animationSpec = tween(300)) }
            ) {
                composable(BottomNavItem.Home.route) {
                    DashboardScreen(
                        onNavigateToWifiConfig = onNavigateToWifiConfig
                    )
                }
                composable(BottomNavItem.Energy.route) { EnergyScreen() }
                composable(BottomNavItem.History.route) { HistoryScreen(viewModel = androidx.lifecycle.viewmodel.compose.viewModel()) }
                composable(BottomNavItem.Notifications.route) { NotificationsScreen(viewModel = androidx.lifecycle.viewmodel.compose.viewModel()) }
                composable(BottomNavItem.Settings.route) {
                    SettingsScreen(
                        onLogout = onLogout,
                        onNavigateToWifiConfig = onNavigateToWifiConfig,
                        onNavigateToDeviceInfo = onNavigateToDeviceInfo
                    )
                }
            }
        }
    }
}
