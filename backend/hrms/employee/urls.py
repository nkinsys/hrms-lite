from django.urls import path, include
from employee.views import EmployeeModelViewSet, AttendanceModelViewSet
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('V1/employees', EmployeeModelViewSet.as_view({'get': 'list', 'post': 'create'}), name="employees_list_or_create"),
    path(
        'V1/employees/<int:pk>',
        EmployeeModelViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),
        name="author_get_update_or_delete"
    ),
    path(
        'V1/attendance',
        AttendanceModelViewSet.as_view({'get': 'list', 'post': 'create'}),
        name="attendance_list_or_create"
    ),
    path(
        'V1/attendance/<int:pk>',
        AttendanceModelViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),
        name="attendance_get_update_or_delete"
    ),
    path(
        'V1/employees/<int:pk>/attendance',
        AttendanceModelViewSet.as_view({'get': 'employee_attendance'}),
        name="employee_attendance_get"
    ),
    path(
        'V1/attendance/mtd',
        AttendanceModelViewSet.as_view({'get': 'mtd_report'}),
        name="attendance_mtd_report"
    ),
    path(
        'V1/attendance/mtd-by-department',
        AttendanceModelViewSet.as_view({'get': 'mtd_report_by_department'}),
        name="attendance_mtd_report_by_department"
    ),
]
