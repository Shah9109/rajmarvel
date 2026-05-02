import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../theme/app_theme.dart';

class ProjectCardWidget extends StatelessWidget {
  final Map<String, dynamic> project;
  final int index;
  final void Function(Map<String, dynamic>) onPayNow;

  const ProjectCardWidget({
    super.key,
    required this.project,
    required this.index,
    required this.onPayNow,
  });

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
    final p = project;
    final status   = p['status'] ?? 'pending';
    final progress = (p['progress'] ?? 0).toDouble();
    final agreed   = p['agreedAmount'] ?? 0;
    final paid     = p['amountPaid'] ?? 0;
    final remaining = p['remainingAmount'] ?? 0;

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // ── Title + status ────────────────────────────────────────────
          Row(children: [
            Expanded(
              child: Text(p['title'] ?? '',
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 16)),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: _statusColor(status).withOpacity(0.12),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(status.replaceAll('_', ' ').toUpperCase(),
                  style: TextStyle(
                      color: _statusColor(status),
                      fontWeight: FontWeight.bold,
                      fontSize: 10)),
            ),
          ]),

          if (p['address'] != null) ...[
            const SizedBox(height: 4),
            Row(children: [
              Icon(Icons.location_on_outlined, size: 13, color: AppTheme.textGrey),
              const SizedBox(width: 4),
              Expanded(child: Text(p['address'],
                  style: TextStyle(fontSize: 12, color: AppTheme.textGrey))),
            ]),
          ],

          const SizedBox(height: 16),

          // ── Progress bar ──────────────────────────────────────────────
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text('Progress', style: TextStyle(color: AppTheme.textGrey, fontSize: 12)),
            Text('${progress.toInt()}%',
                style: const TextStyle(
                    fontWeight: FontWeight.bold, color: AppTheme.primary)),
          ]),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: progress / 100,
              backgroundColor: Colors.grey.shade100,
              valueColor: const AlwaysStoppedAnimation(AppTheme.primary),
              minHeight: 8,
            ),
          ),

          const SizedBox(height: 16),

          // ── Financial ────────────────────────────────────────────────
          Row(children: [
            _finChip('Agreed', '₹$agreed', Colors.grey.shade100, AppTheme.textDark),
            const SizedBox(width: 8),
            _finChip('Paid', '₹$paid', Colors.green.shade50, Colors.green.shade700),
            const SizedBox(width: 8),
            _finChip('Due', '₹$remaining', Colors.orange.shade50, Colors.orange.shade700),
          ]),

          // ── Pay now button ────────────────────────────────────────────
          if (remaining > 0) ...[
            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: () => onPayNow(p),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 44)),
              icon: const Icon(Icons.currency_rupee, size: 16),
              label: const Text('Pay Now'),
            ),
          ],
        ]),
      ),
    ).animate(delay: Duration(milliseconds: index * 100)).fadeIn().slideY(begin: 0.15);
  }

  Widget _finChip(String label, String value, Color bg, Color fg) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: bg, borderRadius: BorderRadius.circular(12)),
        child: Column(children: [
          Text(label, style: TextStyle(fontSize: 10, color: fg.withOpacity(0.7))),
          const SizedBox(height: 2),
          Text(value,
              style: TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 13, color: fg)),
        ]),
      ),
    );
  }
}
