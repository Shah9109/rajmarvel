import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/project_provider.dart';
import '../../../theme/app_theme.dart';

class BookProjectSheet extends StatefulWidget {
  const BookProjectSheet({super.key});
  @override
  State<BookProjectSheet> createState() => _BookProjectSheetState();
}

class _BookProjectSheetState extends State<BookProjectSheet> {
  final _formKey     = GlobalKey<FormState>();
  final _titleCtrl   = TextEditingController();
  final _nameCtrl    = TextEditingController();
  final _phoneCtrl   = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _amountCtrl  = TextEditingController();
  final _descCtrl    = TextEditingController();
  bool _submitting   = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);
    final ok = await context.read<ProjectProvider>().bookProject({
      'title':        _titleCtrl.text.trim(),
      'personName':   _nameCtrl.text.trim(),
      'phone':        _phoneCtrl.text.trim(),
      'address':      _addressCtrl.text.trim(),
      'agreedAmount': int.tryParse(_amountCtrl.text.trim()) ?? 0,
      'description':  _descCtrl.text.trim(),
    });
    setState(() => _submitting = false);
    if (!mounted) return;
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(ok ? 'Project request submitted!' : 'Failed to submit'),
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
            // Handle
            Container(width: 40, height: 4,
                decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(4))),
            const SizedBox(height: 16),

            const Text('Request a Project',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),

            _field(_titleCtrl,   'Project Title', Icons.title),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: _field(_nameCtrl,  'Your Name',  Icons.person_outline)),
              const SizedBox(width: 12),
              Expanded(child: _field(_phoneCtrl, 'Phone',      Icons.phone_outlined,
                  type: TextInputType.phone)),
            ]),
            const SizedBox(height: 12),
            _field(_addressCtrl, 'Site Address', Icons.location_on_outlined),
            const SizedBox(height: 12),
            _field(_amountCtrl, 'Agreed Amount (₹)', Icons.currency_rupee,
                type: TextInputType.number),
            const SizedBox(height: 12),
            TextFormField(
              controller: _descCtrl,
              maxLines: 2,
              decoration: const InputDecoration(
                labelText: 'Description (optional)',
                prefixIcon: Icon(Icons.notes)),
            ),
            const SizedBox(height: 20),

            _submitting
                ? const CircularProgressIndicator(color: AppTheme.primary)
                : ElevatedButton(
                    onPressed: _submit,
                    child: const Text('Submit Request')),
            const SizedBox(height: 20),
          ]),
        ),
      ),
    );
  }

  Widget _field(TextEditingController ctrl, String label, IconData icon,
      {TextInputType type = TextInputType.text}) {
    return TextFormField(
      controller: ctrl,
      keyboardType: type,
      decoration: InputDecoration(labelText: label, prefixIcon: Icon(icon)),
      validator: (v) => v!.isEmpty ? 'Required' : null,
    );
  }
}
