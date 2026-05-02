import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ProjectProvider extends ChangeNotifier {
  List<dynamic> _projects = [];
  Map<String, dynamic> _stats = {};
  bool _loading = false;
  String? _error;

  List<dynamic> get projects => _projects;
  Map<String, dynamic> get stats => _stats;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> fetchUserProjects() async {
    _loading = true; notifyListeners();
    try {
      _projects = await ApiService.getUserProjects();
    } catch (e) {
      _error = 'Failed to load projects';
    } finally {
      _loading = false; notifyListeners();
    }
  }

  Future<void> fetchAllProjects() async {
    _loading = true; notifyListeners();
    try {
      _projects = await ApiService.getAllProjects();
    } catch (e) {
      _error = 'Failed to load projects';
    } finally {
      _loading = false; notifyListeners();
    }
  }

  Future<void> fetchAdminStats() async {
    try {
      _stats = await ApiService.getAdminStats();
      notifyListeners();
    } catch (_) {}
  }

  Future<bool> bookProject(Map<String, dynamic> data) async {
    try {
      await ApiService.bookProject(data);
      await fetchUserProjects();
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> updateProject(String id, Map<String, dynamic> data) async {
    try {
      await ApiService.updateProject(id, data);
      await fetchAllProjects();
      return true;
    } catch (_) {
      return false;
    }
  }
}
