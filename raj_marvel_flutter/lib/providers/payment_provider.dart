import 'package:flutter/material.dart';
import '../services/api_service.dart';

class PaymentProvider extends ChangeNotifier {
  List<dynamic> _payments = [];
  List<dynamic> _bills    = [];
  bool _loading = false;

  List<dynamic> get payments => _payments;
  List<dynamic> get bills    => _bills;
  bool get loading => _loading;

  Future<void> fetchPaymentsForProject(String projectId) async {
    _loading = true; notifyListeners();
    try {
      _payments = await ApiService.getProjectPayments(projectId);
    } catch (_) {}
    _loading = false; notifyListeners();
  }

  Future<void> fetchAllPayments() async {
    _loading = true; notifyListeners();
    try {
      _payments = await ApiService.getAllPayments();
    } catch (_) {}
    _loading = false; notifyListeners();
  }

  Future<void> fetchBills(String projectId) async {
    try {
      _bills = await ApiService.getProjectBills(projectId);
      notifyListeners();
    } catch (_) {}
  }

  Future<bool> submitPayment(Map<String, dynamic> data) async {
    try {
      await ApiService.createPayment(data);
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> updatePaymentStatus(String id, String status) async {
    try {
      await ApiService.updatePaymentStatus(id, status);
      await fetchAllPayments();
      return true;
    } catch (_) {
      return false;
    }
  }
}
