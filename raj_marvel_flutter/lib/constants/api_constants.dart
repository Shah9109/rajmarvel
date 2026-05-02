const String baseUrl = 'https://rajmarvel.onrender.com/api';

class ApiEndpoints {
  // Auth
  static const String login    = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';

  // Projects
  static const String bookProject  = '$baseUrl/projects/book';
  static const String userProjects = '$baseUrl/projects/user';
  static const String allProjects  = '$baseUrl/projects/all';
  static const String adminStats   = '$baseUrl/projects/stats';

  // Payments
  static const String createPayment = '$baseUrl/payments';
  static const String allPayments   = '$baseUrl/payments';
  static String projectPayments(String pid) => '$baseUrl/payments/$pid';
  static String updatePaymentStatus(String id) => '$baseUrl/payments/$id/status';

  // Bills
  static String projectBills(String pid) => '$baseUrl/bills/$pid';
  static String billPdf(String billId) => '$baseUrl/bills/$billId/pdf';

  // Admin project update
  static String updateProject(String id) => '$baseUrl/projects/$id';
}
