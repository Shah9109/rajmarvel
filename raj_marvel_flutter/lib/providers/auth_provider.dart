import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  Map<String, dynamic>? _user;
  String? _token;
  bool _loading = false;
  String? _error;

  Map<String, dynamic>? get user => _user;
  String? get token => _token;
  bool get isLoggedIn => _token != null;
  bool get isAdmin => _user?['role'] == 'admin';
  bool get loading => _loading;
  String? get error => _error;

  AuthProvider() {
    _loadFromPrefs();
  }

  Future<void> _loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    final name  = prefs.getString('userName');
    final email = prefs.getString('userEmail');
    final role  = prefs.getString('userRole');
    if (_token != null && name != null) {
      _user = {'name': name, 'email': email, 'role': role};
    }
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final data = await ApiService.login(email, password);
      await _saveSession(data);
      return true;
    } catch (e) {
      _error = _parseError(e);
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<bool> register(String name, String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final data = await ApiService.register(name, email, password);
      await _saveSession(data);
      return true;
    } catch (e) {
      _error = _parseError(e);
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> _saveSession(Map<String, dynamic> data) async {
    _token = data['token'];
    _user  = data['user'] ?? data;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token',     _token ?? '');
    await prefs.setString('userName',  _user?['name'] ?? '');
    await prefs.setString('userEmail', _user?['email'] ?? '');
    await prefs.setString('userRole',  _user?['role'] ?? 'user');
  }

  Future<void> logout() async {
    _token = null;
    _user  = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    notifyListeners();
  }

  String _parseError(dynamic e) {
    try {
      return e.response?.data?['message'] ?? 'Something went wrong';
    } catch (_) {
      return 'Connection failed. Please check your internet.';
    }
  }
}
