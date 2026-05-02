import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/payment_provider.dart';
import '../../../theme/app_theme.dart';

class PaymentSheet extends StatefulWidget {
  final Map<String, dynamic> project;
  const PaymentSheet({super.key, required this.project});
  @override
  State<PaymentSheet> createState() => _PaymentSheetState();
}

class _PaymentSheetState extends State<PaymentSheet> {
  final _formKey   = GlobalKey<FormState>();
  final _amtCtrl   = TextEditingController();
  final _txnCtrl   = TextEditingController();
  String _method   = 'upi';
  bool _submitting = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);
    final ok = await context.read<PaymentProvider>().submitPayment({
      'projectId':     widget.project['_id'],
      'amount':        double.tryParse(_amtCtrl.text.trim()) ?? 0,
      'method':        _method,
      'transactionId': _txnCtrl.text.trim(),
    });
    setState(() => _submitting = false);
    if (!mounted) return;
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(ok ? 'Payment submitted for approval!' : 'Failed to submit'),
      backgroundColor: ok ? Colors.green : AppTheme.primary,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        left: 20, right: 20, top: 20),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Container(width: 40, height: 4,
                decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(4))),
            const SizedBox(height: 16),
            const Text('Submit Payment',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(widget.project['title'] ?? '',
                style: TextStyle(color: AppTheme.textGrey)),
            const SizedBox(height: 20),

            TextFormField(
              controller: _amtCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Amount (₹)',
                prefixIcon: Icon(Icons.currency_rupee)),
              validator: (v) => v!.isEmpty ? 'Enter amount' : null,
            ),
            const SizedBox(height: 12),

            DropdownButtonFormField<String>(
              value: _method,
              decoration: const InputDecoration(
                labelText: 'Payment Method',
                prefixIcon: Icon(Icons.payment)),
              items: const [
                DropdownMenuItem(value: 'upi',          child: Text('UPI')),
                DropdownMenuItem(value: 'bank_transfer', child: Text('Bank Transfer')),
                DropdownMenuItem(value: 'cash',          child: Text('Cash')),
              ],
              onChanged: (v) => setState(() => _method = v!),
            ),
            const SizedBox(height: 12),

            TextFormField(
              controller: _txnCtrl,
              decoration: const InputDecoration(
                labelText: 'Transaction ID / UTR',
                prefixIcon: Icon(Icons.tag)),
              validator: (v) => v!.isEmpty ? 'Enter transaction ID' : null,
            ),
            const SizedBox(height: 20),

            _submitting
                ? const CircularProgressIndicator(color: AppTheme.primary)
                : ElevatedButton(
                    onPressed: _submit,
                    child: const Text('Submit Payment')),
            const SizedBox(height: 20),
          ]),
        ),
      ),
    );
  }
}
