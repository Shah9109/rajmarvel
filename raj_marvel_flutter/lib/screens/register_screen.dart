import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import 'login_screen.dart';
import 'user/user_dashboard.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey   = GlobalKey<FormState>();
  final _nameCtrl  = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passCtrl  = TextEditingController();
  bool _obscure    = true;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = context.read<AuthProvider>();
    final ok = await auth.register(
        _nameCtrl.text.trim(), _emailCtrl.text.trim(), _passCtrl.text.trim());
    if (!mounted) return;
    if (ok) {
      Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const UserDashboard()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(auth.error ?? 'Registration failed'),
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
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),

              Center(
                child: Column(children: [
                  Image.asset('assets/images/logo.png', width: 80)
                      .animate()
                      .scale(duration: 700.ms, curve: Curves.elasticOut),
                  const SizedBox(height: 16),
                  ShaderMask(
                    shaderCallback: (b) => const LinearGradient(
                      colors: [AppTheme.primary, Color(0xFFF9A8D4)],
                    ).createShader(b),
                    child: const Text('Create Account',
                        style: TextStyle(
                            fontSize: 28, fontWeight: FontWeight.w900,
                            color: Colors.white)),
                  ).animate(delay: 200.ms).fadeIn().slideY(begin: 0.2),
                ]),
              ),

              const SizedBox(height: 40),

              Form(
                key: _formKey,
                child: Column(children: [
                  TextFormField(
                    controller: _nameCtrl,
                    textCapitalization: TextCapitalization.words,
                    decoration: const InputDecoration(
                      labelText: 'Full Name',
                      prefixIcon: Icon(Icons.person_outline)),
                    validator: (v) => v!.isEmpty ? 'Enter name' : null,
                  ).animate(delay: 300.ms).fadeIn().slideX(begin: -0.2),

                  const SizedBox(height: 16),

                  TextFormField(
                    controller: _emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: 'Email Address',
                      prefixIcon: Icon(Icons.email_outlined)),
                    validator: (v) =>
                        !v!.contains('@') ? 'Enter valid email' : null,
                  ).animate(delay: 400.ms).fadeIn().slideX(begin: 0.2),

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
                  ).animate(delay: 500.ms).fadeIn().slideX(begin: -0.2),

                  const SizedBox(height: 28),

                  auth.loading
                      ? const CircularProgressIndicator(color: AppTheme.primary)
                      : ElevatedButton.icon(
                          onPressed: _submit,
                          icon: const Icon(Icons.how_to_reg),
                          label: const Text('Create Account'),
                        ).animate(delay: 600.ms).fadeIn().scale(
                            begin: const Offset(0.9, 0.9)),
                ]),
              ),

              const SizedBox(height: 24),

              Center(
                child: TextButton(
                  onPressed: () => Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (_) => const LoginScreen())),
                  child: RichText(
                    text: TextSpan(
                      text: 'Already have an account? ',
                      style: TextStyle(color: AppTheme.textGrey),
                      children: [
                        TextSpan(
                          text: 'Sign In',
                          style: const TextStyle(
                              color: AppTheme.primary, fontWeight: FontWeight.w700),
                        )
                      ],
                    ),
                  ),
                ),
              ).animate(delay: 700.ms).fadeIn(),
            ],
          ),
        ),
      ),
    );
  }
}
