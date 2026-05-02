import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import 'login_screen.dart';
import 'user/user_dashboard.dart';
import 'admin/admin_dashboard.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: 2.seconds);
    _controller.forward();
    // Navigate after 3s
    Future.delayed(3.seconds, _navigate);
  }

  void _navigate() {
    final auth = context.read<AuthProvider>();
    if (!mounted) return;
    Widget dest;
    if (!auth.isLoggedIn) {
      dest = const LoginScreen();
    } else if (auth.isAdmin) {
      dest = const AdminDashboard();
    } else {
      dest = const UserDashboard();
    }
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (_, a, __) => dest,
        transitionsBuilder: (_, a, __, child) =>
            FadeTransition(opacity: a, child: child),
        transitionDuration: 600.ms,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // ── Logo ─────────────────────────────────────────────────────
            Image.asset('assets/images/logo.png', width: 130)
                .animate()
                .scale(begin: const Offset(0.5, 0.5), duration: 800.ms,
                    curve: Curves.elasticOut)
                .fadeIn(duration: 600.ms),

            const SizedBox(height: 24),

            // ── Brand name ───────────────────────────────────────────────
            ShaderMask(
              shaderCallback: (bounds) => const LinearGradient(
                colors: [AppTheme.primary, Color(0xFFF9A8D4)],
              ).createShader(bounds),
              child: const Text('Raj Marvel',
                  style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.w900,
                      color: Colors.white)),
            )
                .animate(delay: 400.ms)
                .fadeIn(duration: 600.ms)
                .slideY(begin: 0.3, end: 0),

            const SizedBox(height: 6),
            Text('EXTERIOR DESIGNS',
                style: TextStyle(
                    fontSize: 12,
                    letterSpacing: 4,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textGrey))
                .animate(delay: 600.ms)
                .fadeIn(duration: 600.ms),

            const SizedBox(height: 60),

            // ── Loading dots ─────────────────────────────────────────────
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(3, (i) => Container(
                width: 8, height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  color: AppTheme.primary, shape: BoxShape.circle),
              )
                  .animate(
                      onPlay: (c) => c.repeat(reverse: true),
                      delay: Duration(milliseconds: i * 200))
                  .scaleXY(begin: 0.5, end: 1.2, duration: 600.ms,
                      curve: Curves.easeInOut)),
            ),
          ],
        ),
      ),
    );
  }
}
