import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../providers/payment_provider.dart';
import '../../../theme/app_theme.dart';

class BillsTab extends StatefulWidget {
  final List<dynamic> projects;
  const BillsTab({super.key, required this.projects});
  @override
  State<BillsTab> createState() => _BillsTabState();
}

class _BillsTabState extends State<BillsTab> {
  bool _loaded = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_loaded) {
      _loaded = true;
      _fetchAll();
    }
  }

  Future<void> _fetchAll() async {
    for (final p in widget.projects) {
      await context.read<PaymentProvider>().fetchBills(p['_id']);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bills = context.watch<PaymentProvider>().bills;
    if (bills.isEmpty) {
      return Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Icon(Icons.receipt_long_outlined, size: 70, color: Colors.grey.shade300)
              .animate(onPlay: (c) => c.repeat(reverse: true))
              .scaleXY(begin: 0.95, end: 1.05, duration: 1500.ms),
          const SizedBox(height: 16),
          Text('No bills yet', style: TextStyle(color: AppTheme.textGrey)),
        ]),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: bills.length,
      itemBuilder: (ctx, i) {
        final bill = bills[i];
        final id = bill['_id']?.toString().substring(
            (bill['_id']?.toString().length ?? 6) - 6) ?? '';
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: AppTheme.primary.withOpacity(0.1),
              child: const Icon(Icons.receipt, color: AppTheme.primary),
            ),
            title: Text('Invoice #${id.toUpperCase()}',
                style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('₹${bill['totalAmount']} · ${bill['items']?.length ?? 0} items',
                style: TextStyle(color: AppTheme.textGrey)),
            trailing: const Icon(Icons.download_outlined, color: AppTheme.primary),
          ),
        ).animate(delay: Duration(milliseconds: i * 80)).fadeIn().slideX(begin: 0.2);
      },
    );
  }
}
