import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import 'register_screen.dart';
import 'user/user_dashboard.dart';
import 'admin/admin_dashboard.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey   = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passCtrl  = TextEditingController();
  bool _obscure    = true;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = context.read<AuthProvider>();
    final ok = await auth.login(_emailCtrl.text.trim(), _passCtrl.text.trim());
    if (!mounted) return;
    if (ok) {
      Navigator.of(context).pushReplacement(MaterialPageRoute(
        builder: (_) => auth.isAdmin ? const AdminDashboard() : const UserDashboard()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(auth.error ?? 'Login failed'),
        backgroundColor: AppTheme.primary,
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 48),

                // ── Logo + header ──────────────────────────────────────
                Center(
                  child: Column(children: [
                    Image.asset('assets/images/logo.png', width: 90)
                        .animate()
                        .scale(duration: 700.ms, curve: Curves.elasticOut)
                        .fadeIn(),
                    const SizedBox(height: 16),
                    ShaderMask(
                      shaderCallback: (b) => const LinearGradient(
                        colors: [AppTheme.primary, Color(0xFFF9A8D4)],
                      ).createShader(b),
                      child: const Text('Welcome Back',
                          style: TextStyle(
                              fontSize: 30, fontWeight: FontWeight.w900,
                              color: Colors.white)),
                    ).animate(delay: 200.ms).fadeIn().slideY(begin: 0.2),
                    const SizedBox(height: 4),
                    Text('Sign in to your Raj Marvel account',
                        style: TextStyle(color: AppTheme.textGrey, fontSize: 14))
                        .animate(delay: 300.ms).fadeIn(),
                  ]),
                ),

                const SizedBox(height: 48),

                // ── Form ───────────────────────────────────────────────
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _emailCtrl,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          labelText: 'Email Address',
                          prefixIcon: Icon(Icons.email_outlined)),
                        validator: (v) => v!.isEmpty ? 'Enter email' : null,
                      ).animate(delay: 400.ms).fadeIn().slideX(begin: -0.2),

                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _passCtrl,
                        obscureText: _obscure,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          prefixIcon: const Icon(Icons.lock_outline),
                          suffixIcon: IconButton(
                            icon: Icon(_obscure
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined),
                            onPressed: () =>
                                setState(() => _obscure = !_obscure),
                          ),
                        ),
                        validator: (v) =>
                            v!.length < 6 ? 'Min 6 characters' : null,
                      ).animate(delay: 500.ms).fadeIn().slideX(begin: 0.2),

                      const SizedBox(height: 28),

                      // ── Login Button ──────────────────────────────────
                      auth.loading
                          ? const CircularProgressIndicator(
                              color: AppTheme.primary)
                          : ElevatedButton.icon(
                              onPressed: _submit,
                              icon: const Icon(Icons.login),
                              label: const Text('Sign In'),
                            ).animate(delay: 600.ms).fadeIn().scale(
                                begin: const Offset(0.9, 0.9)),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // ── Divider ────────────────────────────────────────────
                Row(children: [
                  Expanded(child: Divider(color: Colors.grey.shade300)),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text('or', style: TextStyle(color: AppTheme.textGrey)),
                  ),
                  Expanded(child: Divider(color: Colors.grey.shade300)),
                ]).animate(delay: 700.ms).fadeIn(),

                const SizedBox(height: 20),

                // ── Register link ──────────────────────────────────────
                Center(
                  child: TextButton(
                    onPressed: () => Navigator.of(context).pushReplacement(
                        MaterialPageRoute(builder: (_) => const RegisterScreen())),
                    child: RichText(
                      text: TextSpan(
                        text: "Don't have an account? ",
                        style: TextStyle(color: AppTheme.textGrey),
                        children: [
                          TextSpan(
                            text: 'Register',
                            style: TextStyle(
                              color: AppTheme.primary,
                              fontWeight: FontWeight.w700,
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                ).animate(delay: 800.ms).fadeIn(),

                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
