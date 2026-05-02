import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';

class ApiService {
  static final Dio _dio = Dio(BaseOptions(
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
  ));

  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<Options> _authOptions() async {
    final token = await _getToken();
    return Options(headers: {'Authorization': 'Bearer $token'});
  }

  // ── Auth ───────────────────────────────────────────────────────────────
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post(ApiEndpoints.login,
        data: {'email': email, 'password': password});
    return response.data;
  }

  static Future<Map<String, dynamic>> register(
      String name, String email, String password) async {
    final response = await _dio.post(ApiEndpoints.register,
        data: {'name': name, 'email': email, 'password': password});
    return response.data;
  }

  // ── Projects ───────────────────────────────────────────────────────────
  static Future<List<dynamic>> getUserProjects() async {
    final opts = await _authOptions();
    final response = await _dio.get(ApiEndpoints.userProjects, options: opts);
    return response.data;
  }

  static Future<List<dynamic>> getAllProjects() async {
    final opts = await _authOptions();
    final response = await _dio.get(ApiEndpoints.allProjects, options: opts);
    return response.data;
  }

  static Future<Map<String, dynamic>> getAdminStats() async {
    final opts = await _authOptions();
    final response = await _dio.get(ApiEndpoints.adminStats, options: opts);
    return response.data;
  }

  static Future<void> bookProject(Map<String, dynamic> data) async {
    final opts = await _authOptions();
    await _dio.post(ApiEndpoints.bookProject, data: data, options: opts);
  }

  static Future<void> updateProject(String id, Map<String, dynamic> data) async {
    final opts = await _authOptions();
    await _dio.put(ApiEndpoints.updateProject(id), data: data, options: opts);
  }

  // ── Payments ───────────────────────────────────────────────────────────
  static Future<void> createPayment(Map<String, dynamic> data) async {
    final opts = await _authOptions();
    await _dio.post(ApiEndpoints.createPayment, data: data, options: opts);
  }

  static Future<List<dynamic>> getProjectPayments(String projectId) async {
    final opts = await _authOptions();
    final response = await _dio.get(
        ApiEndpoints.projectPayments(projectId), options: opts);
    return response.data;
  }

  static Future<List<dynamic>> getAllPayments() async {
    final opts = await _authOptions();
    final response = await _dio.get(ApiEndpoints.allPayments, options: opts);
    return response.data;
  }

  static Future<void> updatePaymentStatus(String id, String status) async {
    final opts = await _authOptions();
    await _dio.put(ApiEndpoints.updatePaymentStatus(id),
        data: {'status': status}, options: opts);
  }

  // ── Bills ───────────────────────────────────────────────────────────────
  static Future<List<dynamic>> getProjectBills(String projectId) async {
    final opts = await _authOptions();
    final response = await _dio.get(
        ApiEndpoints.projectBills(projectId), options: opts);
    return response.data;
  }
}
