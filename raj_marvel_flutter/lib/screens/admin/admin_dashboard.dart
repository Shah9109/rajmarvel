import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/project_provider.dart';
import '../../providers/payment_provider.dart';
import '../../theme/app_theme.dart';
import '../login_screen.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});
  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  int _tab = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProjectProvider>()
        ..fetchAllProjects()
        ..fetchAdminStats();
      context.read<PaymentProvider>().fetchAllPayments();
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
              child: const Text('Admin Panel',
                  style: TextStyle(
                      fontSize: 16, fontWeight: FontWeight.w900,
                      color: Colors.white)),
            ),
            Text('Raj Marvel',
                style: TextStyle(fontSize: 10, color: AppTheme.textGrey)),
          ]),
        ]),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: AppTheme.primary),
            onPressed: _logout,
          ),
        ],
      ),
      body: IndexedStack(
        index: _tab,
        children: const [
          _OverviewTab(),
          _AdminProjectsTab(),
          _AdminPaymentsTab(),
          _AdminProfileTab(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        backgroundColor: Colors.white,
        indicatorColor: AppTheme.primary.withOpacity(0.1),
        destinations: const [
          NavigationDestination(
              icon: Icon(Icons.dashboard_outlined),
              selectedIcon: Icon(Icons.dashboard, color: AppTheme.primary),
              label: 'Overview'),
          NavigationDestination(
              icon: Icon(Icons.folder_outlined),
              selectedIcon: Icon(Icons.folder, color: AppTheme.primary),
              label: 'Projects'),
          NavigationDestination(
              icon: Icon(Icons.credit_card_outlined),
              selectedIcon: Icon(Icons.credit_card, color: AppTheme.primary),
              label: 'Payments'),
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
class _OverviewTab extends StatelessWidget {
  const _OverviewTab();

  @override
  Widget build(BuildContext context) {
    final stats    = context.watch<ProjectProvider>().stats;
    final projects = context.watch<ProjectProvider>().projects;
    final pending  = projects.where((p) => p['status'] == 'pending').toList();

    final cards = [
      _Stat('Total Revenue',  '₹${stats['totalRevenue'] ?? 0}',
          Icons.currency_rupee, Colors.green),
      _Stat('Total Projects', '${stats['totalProjects'] ?? 0}',
          Icons.folder_copy, Colors.blue),
      _Stat('Active',         '${stats['activeProjects'] ?? 0}',
          Icons.trending_up, Colors.purple),
      _Stat('Pending',        '${stats['pendingProjects'] ?? 0}',
          Icons.hourglass_top, Colors.orange),
    ];

    return RefreshIndicator(
      color: AppTheme.primary,
      onRefresh: () async {
        await context.read<ProjectProvider>()
          ..fetchAllProjects()
          ..fetchAdminStats();
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // ── Stat grid ───────────────────────────────────────────────
          GridView.builder(
            shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, crossAxisSpacing: 12,
                mainAxisSpacing: 12, childAspectRatio: 1.6),
            itemCount: cards.length,
            itemBuilder: (_, i) {
              final s = cards[i];
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      CircleAvatar(
                        radius: 18,
                        backgroundColor: s.color.withOpacity(0.12),
                        child: Icon(s.icon, color: s.color, size: 18)),
                      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(s.label,
                            style: TextStyle(fontSize: 11, color: AppTheme.textGrey)),
                        Text(s.value,
                            style: const TextStyle(
                                fontSize: 22, fontWeight: FontWeight.bold)),
                      ]),
                    ],
                  ),
                ),
              ).animate(delay: Duration(milliseconds: i * 100))
                  .fadeIn().scale(begin: const Offset(0.9, 0.9));
            },
          ),

          const SizedBox(height: 24),

          // ── Pending bookings ─────────────────────────────────────────
          const Text('Pending Bookings',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),

          if (pending.isEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Center(child: Text('No pending bookings 🎉',
                    style: TextStyle(color: AppTheme.textGrey))),
              ),
            )
          else
            ...pending.map((p) => _PendingCard(project: p)),
        ]),
      ),
    );
  }
}

class _Stat {
  final String label, value;
  final IconData icon;
  final Color color;
  _Stat(this.label, this.value, this.icon, this.color);
}

class _PendingCard extends StatelessWidget {
  final Map<String, dynamic> project;
  const _PendingCard({required this.project});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(project['title'] ?? '',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          if (project['personName'] != null)
            Text('${project['personName']} · ${project['phone']}',
                style: TextStyle(fontSize: 12, color: AppTheme.textGrey)),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () async {
                  await context.read<ProjectProvider>()
                      .updateProject(project['_id'], {'status': 'planning'});
                },
                icon: const Icon(Icons.check_circle, color: Colors.green),
                label: const Text('Accept',
                    style: TextStyle(color: Colors.green)),
                style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.green)),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () async {
                  await context.read<ProjectProvider>()
                      .updateProject(project['_id'], {'status': 'rejected'});
                },
                icon: const Icon(Icons.cancel, color: AppTheme.primary),
                label: const Text('Reject',
                    style: TextStyle(color: AppTheme.primary)),
                style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppTheme.primary)),
              ),
            ),
          ]),
        ]),
      ),
    ).animate().fadeIn().slideY(begin: 0.2);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
class _AdminProjectsTab extends StatelessWidget {
  const _AdminProjectsTab();

  Color _statusColor(String s) {
    const m = {
      'pending':     Colors.orange,
      'planning':    Colors.blue,
      'in_progress': Colors.purple,
      'completed':   Colors.green,
      'rejected':    AppTheme.primary,
      'on_hold':     Colors.grey,
    };
    return m[s] ?? Colors.grey;
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProjectProvider>();
    if (provider.loading) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.primary));
    }
    return RefreshIndicator(
      color: AppTheme.primary,
      onRefresh: () => context.read<ProjectProvider>().fetchAllProjects(),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: provider.projects.length,
        itemBuilder: (ctx, i) {
          final p      = provider.projects[i];
          final status = p['status'] ?? 'pending';
          return Card(
            margin: const EdgeInsets.only(bottom: 14),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Expanded(child: Text(p['title'] ?? '',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15))),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: _statusColor(status).withOpacity(0.12),
                      borderRadius: BorderRadius.circular(20)),
                    child: Text(status.replaceAll('_', ' ').toUpperCase(),
                        style: TextStyle(
                            color: _statusColor(status),
                            fontWeight: FontWeight.bold, fontSize: 10)),
                  ),
                ]),
                if (p['personName'] != null) ...[
                  const SizedBox(height: 4),
                  Text('${p['personName']} · ${p['phone']}',
                      style: TextStyle(fontSize: 12, color: AppTheme.textGrey)),
                ],
                const SizedBox(height: 10),

                // Progress bar
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: (p['progress'] ?? 0) / 100.0,
                    backgroundColor: Colors.grey.shade100,
                    valueColor: const AlwaysStoppedAnimation(AppTheme.primary),
                    minHeight: 6,
                  ),
                ),
                const SizedBox(height: 4),
                Text('${p['progress'] ?? 0}% complete',
                    style: TextStyle(fontSize: 11, color: AppTheme.textGrey)),

                const SizedBox(height: 10),

                // Status dropdown
                DropdownButtonFormField<String>(
                  value: status,
                  isDense: true,
                  decoration: const InputDecoration(
                    labelText: 'Update Status', isDense: true,
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10)),
                  items: ['pending','planning','in_progress','completed','on_hold','rejected']
                      .map((s) => DropdownMenuItem(
                          value: s, child: Text(s.replaceAll('_', ' '))))
                      .toList(),
                  onChanged: (v) => context.read<ProjectProvider>()
                      .updateProject(p['_id'], {'status': v}),
                ),
              ]),
            ),
          ).animate(delay: Duration(milliseconds: i * 80)).fadeIn().slideY(begin: 0.1);
        },
      ),
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
class _AdminPaymentsTab extends StatelessWidget {
  const _AdminPaymentsTab();

  @override
  Widget build(BuildContext context) {
    final payments = context.watch<PaymentProvider>().payments;
    if (payments.isEmpty) {
      return Center(child: Text('No payments yet.',
          style: TextStyle(color: AppTheme.textGrey)));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: payments.length,
      itemBuilder: (ctx, i) {
        final pay    = payments[i];
        final status = pay['status'] ?? 'pending';
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Expanded(child: Text(
                  pay['projectId']?['title'] ?? 'Payment',
                  style: const TextStyle(fontWeight: FontWeight.bold))),
                Text('₹${pay['amount']}',
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold,
                        color: AppTheme.primary)),
              ]),
              if (pay['userId']?['name'] != null)
                Text(pay['userId']['name'],
                    style: TextStyle(fontSize: 12, color: AppTheme.textGrey)),
              const SizedBox(height: 10),
              if (status == 'pending')
                Row(children: [
                  Expanded(child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green, minimumSize: const Size(0, 36)),
                    onPressed: () => context.read<PaymentProvider>()
                        .updatePaymentStatus(pay['_id'], 'completed'),
                    child: const Text('Confirm'),
                  )),
                  const SizedBox(width: 8),
                  Expanded(child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppTheme.primary),
                        minimumSize: const Size(0, 36)),
                    onPressed: () => context.read<PaymentProvider>()
                        .updatePaymentStatus(pay['_id'], 'failed'),
                    child: const Text('Reject',
                        style: TextStyle(color: AppTheme.primary)),
                  )),
                ])
              else
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: status == 'completed'
                        ? Colors.green.withOpacity(0.1) : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(20)),
                  child: Text(status.toUpperCase(),
                      style: TextStyle(
                          color: status == 'completed' ? Colors.green : Colors.grey,
                          fontWeight: FontWeight.bold, fontSize: 12)),
                ),
            ]),
          ),
        ).animate(delay: Duration(milliseconds: i * 80)).fadeIn().slideY(begin: 0.2);
      },
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
class _AdminProfileTab extends StatelessWidget {
  const _AdminProfileTab();

  @override
  Widget build(BuildContext context) {
    final auth  = context.watch<AuthProvider>();
    final stats = context.watch<ProjectProvider>().stats;
    final user  = auth.user;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(children: [
        const SizedBox(height: 20),
        Container(
          width: 90, height: 90,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              colors: [AppTheme.primary, AppTheme.secondary])),
          child: Center(child: Text(
            (user?['name'] ?? 'A')[0].toUpperCase(),
            style: const TextStyle(
                color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold),
          )),
        ).animate().scale(duration: 500.ms, curve: Curves.elasticOut),

        const SizedBox(height: 16),
        Text(user?['name'] ?? '', style: Theme.of(context).textTheme.displayMedium)
            .animate(delay: 100.ms).fadeIn(),
        Text(user?['email'] ?? '', style: TextStyle(color: AppTheme.textGrey))
            .animate(delay: 200.ms).fadeIn(),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration: BoxDecoration(
            color: AppTheme.secondary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(20)),
          child: const Text('Administrator',
              style: TextStyle(color: AppTheme.secondary, fontWeight: FontWeight.bold)),
        ).animate(delay: 300.ms).fadeIn(),

        const SizedBox(height: 32),

        _stat(Icons.currency_rupee, 'Total Revenue',
            '₹${stats['totalRevenue'] ?? 0}', Colors.green),
        const SizedBox(height: 12),
        _stat(Icons.folder_copy, 'Total Projects',
            '${stats['totalProjects'] ?? 0}', Colors.blue),
        const SizedBox(height: 12),
        _stat(Icons.hourglass_top, 'Pending Bookings',
            '${stats['pendingProjects'] ?? 0}', Colors.orange),
      ]),
    );
  }

  Widget _stat(IconData icon, String label, String value, Color color) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.1),
          child: Icon(icon, color: color)),
        title: Text(label, style: TextStyle(color: AppTheme.textGrey, fontSize: 13)),
        trailing: Text(value,
            style: const TextStyle(
                fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.secondary)),
      ),
    );
  }
}
