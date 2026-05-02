import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/project_provider.dart';
import '../../providers/payment_provider.dart';
import '../../theme/app_theme.dart';
import '../login_screen.dart';
import 'widgets/project_card_widget.dart';
import 'widgets/book_project_sheet.dart';
import 'widgets/payment_sheet.dart';
import 'widgets/bills_tab.dart';

class UserDashboard extends StatefulWidget {
  const UserDashboard({super.key});
  @override
  State<UserDashboard> createState() => _UserDashboardState();
}

class _UserDashboardState extends State<UserDashboard> {
  int _tab = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProjectProvider>().fetchUserProjects();
    });
  }

  void _logout() async {
    await context.read<AuthProvider>().logout();
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: Row(children: [
          Image.asset('assets/images/logo.png', width: 32),
          const SizedBox(width: 8),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            ShaderMask(
              shaderCallback: (b) => const LinearGradient(
                  colors: [AppTheme.primary, Color(0xFFF9A8D4)])
                  .createShader(b),
              child: const Text('Raj Marvel',
                  style: TextStyle(
                      fontSize: 16, fontWeight: FontWeight.w900,
                      color: Colors.white)),
            ),
            Text('My Dashboard',
                style: TextStyle(fontSize: 10, color: AppTheme.textGrey)),
          ]),
        ]),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: TextButton.icon(
              onPressed: _logout,
              icon: const Icon(Icons.logout, color: AppTheme.primary, size: 18),
              label: const Text('Logout',
                  style: TextStyle(color: AppTheme.primary, fontSize: 13)),
            ),
          ),
        ],
      ),
      body: IndexedStack(
        index: _tab,
        children: const [
          _ProjectsTab(),
          _PaymentsTab(),
          _BillsTab(),
          _ProfileTab(),
        ],
      ),
      floatingActionButton: _tab == 0
          ? FloatingActionButton.extended(
              onPressed: () => showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
                builder: (_) => const BookProjectSheet(),
              ),
              backgroundColor: AppTheme.primary,
              icon: const Icon(Icons.add, color: Colors.white),
              label: const Text('Request Project',
                  style: TextStyle(color: Colors.white)),
            ).animate().scale(duration: 400.ms, curve: Curves.elasticOut)
          : null,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        backgroundColor: Colors.white,
        indicatorColor: AppTheme.primary.withOpacity(0.1),
        destinations: const [
          NavigationDestination(
              icon: Icon(Icons.folder_open_outlined),
              selectedIcon: Icon(Icons.folder_open, color: AppTheme.primary),
              label: 'Projects'),
          NavigationDestination(
              icon: Icon(Icons.credit_card_outlined),
              selectedIcon: Icon(Icons.credit_card, color: AppTheme.primary),
              label: 'Payments'),
          NavigationDestination(
              icon: Icon(Icons.receipt_long_outlined),
              selectedIcon: Icon(Icons.receipt_long, color: AppTheme.primary),
              label: 'Bills'),
          NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person, color: AppTheme.primary),
              label: 'Profile'),
        ],
      ),
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
class _ProjectsTab extends StatelessWidget {
  const _ProjectsTab();

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProjectProvider>();
    if (provider.loading) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.primary));
    }
    if (provider.projects.isEmpty) {
      return Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Icon(Icons.home_work_outlined, size: 80, color: Colors.grey.shade300)
              .animate(onPlay: (c) => c.repeat(reverse: true))
              .scaleXY(begin: 0.95, end: 1.05, duration: 1500.ms),
          const SizedBox(height: 16),
          const Text('No Projects Yet',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text('Tap + to request your first project',
              style: TextStyle(color: AppTheme.textGrey)),
        ]),
      );
    }
    return RefreshIndicator(
      color: AppTheme.primary,
      onRefresh: () => context.read<ProjectProvider>().fetchUserProjects(),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: provider.projects.length,
        itemBuilder: (ctx, i) => ProjectCardWidget(
          project: provider.projects[i],
          index: i,
          onPayNow: (p) => showModalBottomSheet(
            context: ctx,
            isScrollControlled: true,
            shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
            builder: (_) => PaymentSheet(project: p),
          ),
        ),
      ),
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
class _PaymentsTab extends StatefulWidget {
  const _PaymentsTab();
  @override
  State<_PaymentsTab> createState() => _PaymentsTabState();
}

class _PaymentsTabState extends State<_PaymentsTab> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final projects = context.read<ProjectProvider>().projects;
      for (final p in projects) {
        await context.read<PaymentProvider>().fetchPaymentsForProject(p['_id']);
      }
    });
  }

  Color _statusColor(String s) {
    return s == 'completed'
        ? Colors.green
        : s == 'failed'
            ? AppTheme.primary
            : Colors.orange;
  }

  @override
  Widget build(BuildContext context) {
    final payments = context.watch<PaymentProvider>().payments;
    if (payments.isEmpty) {
      return Center(
          child: Text('No payments yet.',
              style: TextStyle(color: AppTheme.textGrey)));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: payments.length,
      itemBuilder: (ctx, i) {
        final pay = payments[i];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: AppTheme.primary.withOpacity(0.1),
              child: const Icon(Icons.currency_rupee, color: AppTheme.primary),
            ),
            title: Text('₹${pay['amount']}',
                style: const TextStyle(
                    fontWeight: FontWeight.bold, fontSize: 18)),
            subtitle: Text(pay['method']?.toString().replaceAll('_', ' ') ?? ''),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: _statusColor(pay['status']).withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(pay['status'] ?? '',
                  style: TextStyle(
                      color: _statusColor(pay['status']),
                      fontWeight: FontWeight.bold,
                      fontSize: 12)),
            ),
          ),
        ).animate(delay: Duration(milliseconds: i * 80)).fadeIn().slideY(begin: 0.2);
      },
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
class _BillsTab extends StatelessWidget {
  const _BillsTab();
  @override
  Widget build(BuildContext context) {
    final projects = context.watch<ProjectProvider>().projects;
    return BillsTab(projects: projects);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
class _ProfileTab extends StatelessWidget {
  const _ProfileTab();
  @override
  Widget build(BuildContext context) {
    final auth     = context.watch<AuthProvider>();
    final projects = context.watch<ProjectProvider>().projects;
    final user     = auth.user;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(children: [
        const SizedBox(height: 20),
        // Avatar
        Container(
          width: 90, height: 90,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: const LinearGradient(
              colors: [AppTheme.primary, Color(0xFFF9A8D4)]),
          ),
          child: Center(
            child: Text(
              (user?['name'] ?? 'U')[0].toUpperCase(),
              style: const TextStyle(
                  color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold),
            ),
          ),
        ).animate().scale(duration: 500.ms, curve: Curves.elasticOut),

        const SizedBox(height: 16),
        Text(user?['name'] ?? '',
            style: Theme.of(context).textTheme.displayMedium)
            .animate(delay: 100.ms).fadeIn(),
        Text(user?['email'] ?? '',
            style: TextStyle(color: AppTheme.textGrey))
            .animate(delay: 200.ms).fadeIn(),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration: BoxDecoration(
            color: AppTheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Text('User',
              style: TextStyle(
                  color: AppTheme.primary, fontWeight: FontWeight.bold)),
        ).animate(delay: 300.ms).fadeIn(),

        const SizedBox(height: 32),

        _infoCard(Icons.folder_open, 'Total Projects', '${projects.length}'),
        const SizedBox(height: 12),
        _infoCard(Icons.check_circle_outline, 'Completed',
            '${projects.where((p) => p['status'] == 'completed').length}'),
        const SizedBox(height: 12),
        _infoCard(Icons.pending_outlined, 'Pending',
            '${projects.where((p) => p['status'] == 'pending').length}'),
      ]),
    );
  }

  Widget _infoCard(IconData icon, String label, String value) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AppTheme.primary.withOpacity(0.1),
          child: Icon(icon, color: AppTheme.primary),
        ),
        title: Text(label, style: TextStyle(color: AppTheme.textGrey, fontSize: 13)),
        trailing: Text(value,
            style: const TextStyle(
                fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.secondary)),
      ),
    );
  }
}
