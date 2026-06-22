const Database = require('../models/Database');

class ReportService {
    static async generateFinancialReport() {
        let report = [];
        const courses = await Database.all("SELECT * FROM courses");

        for (const c of courses) {
            let courseData = { course: c.title, revenue: 0, students: [] };
            
            const enrollments = await Database.all("SELECT * FROM enrollments WHERE course_id = ?", [c.id]);

            for (const enr of enrollments) {
                const user = await Database.get("SELECT name, email FROM users WHERE id = ?", [enr.user_id]);
                const payment = await Database.get("SELECT amount, status FROM payments WHERE enrollment_id = ?", [enr.id]);

                if (payment && payment.status === 'PAID') {
                    courseData.revenue += payment.amount;
                }

                courseData.students.push({
                    student: user ? user.name : 'Unknown',
                    paid: payment ? payment.amount : 0
                });
            }

            report.push(courseData);
        }

        return report;
    }
}

module.exports = ReportService;
