from datetime import date, timedelta
from django.shortcuts import render
from django.db.models import Count, Q, F, FilteredRelation
from django.utils import timezone
from django.utils.dateparse import parse_date
from employee.models import Department, Employee, Attendance
from employee.serializers import DepartmentSerializer, EmployeeSerializer, AttendanceSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from hrms.filters import CustomFilterBackend
from hrms.pagination import CustomPagination

# Create your views here.

class DepartmentModelViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class EmployeeModelViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        today = date.today()
        queryset = Employee.objects.annotate(
            today_attendance=FilteredRelation('attendance', condition=Q(attendance__date=today))
        ).annotate(
            attendance_status=F('today_attendance__status')
        ).select_related('department')
        return queryset

class AttendanceModelViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = Attendance.objects.select_related('employee', 'employee__department')
        return queryset

    def create(self, request, *args, **kwargs):
        attendanceDate = request.data.get("date", date.today())
        if isinstance(attendanceDate, str):
            attendanceDate = parse_date(attendanceDate)
        if Attendance.objects.filter(employee = request.data.get("employee"), date = attendanceDate).exists():
            raise ParseError(f"Employee attendance for {attendanceDate.strftime("%-d %b, %Y")} is already marked. Please verify and try again.")
        return super().create(request, args, kwargs)
    
    def update(self, request, *args, **kwargs):
        attendance = self.get_object()
        if attendance.date < timezone.now().date() - timedelta(days=7):
            raise ParseError("The attendance date is beyond the 7-day update window and can no longer be modified.")
        return super().update(request, args, kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        attendance = self.get_object()
        if attendance.date < timezone.now().date() - timedelta(days=7):
            raise ParseError("The attendance date is beyond the 7-day update window and can no longer be modified.")
        data = {
            "status": request.data.get("status"),
            "date": attendance.date,
            "employee": attendance.employee.id
        }
        request.data.update(data)
        return super().partial_update(request, args, kwargs)

    def employee_attendance(self, request, pk, *args, **kwargs):
        instances = self.get_queryset().filter(
            employee = pk,
        ).all()
        serializer = self.get_serializer(instances, many=True)
        return Response(serializer.data)
    
    def mtd_report(self, request, *args, **kwargs):
        today = date.today()
        first_day_of_month = today.replace(day=1)
        queryset = Attendance.objects.filter(date__range=(first_day_of_month, today))

        queryset = queryset.values(
            'date'
        ).annotate(
            total_employees=Count('employee', distinct=True),
            present=Count('id', filter=Q(status=Attendance.StatusChoices.PRESENT)),
            absent=Count('id', filter=Q(status=Attendance.StatusChoices.ABSENT)),
        )

        filter = CustomFilterBackend()
        queryset = filter.filter_queryset(request, queryset, self)
        paginator = CustomPagination()
        paginator.ordering = ["-date"]
        data = paginator.paginate_queryset(queryset, request)
        return paginator.get_paginated_response(data)
    
    def mtd_report_by_department(self, request, *args, **kwargs):
        today = date.today()
        first_day_of_month = today.replace(day=1)
        queryset = Attendance.objects.filter(date__range=(first_day_of_month, today))

        queryset = queryset.values(
            'date',
        ).annotate(
            department_id=F('employee__department__id'),
            department_name=F('employee__department__name'),
            total_employees=Count('employee', distinct=True),
            present=Count('id', filter=Q(status=Attendance.StatusChoices.PRESENT)),
            absent=Count('id', filter=Q(status=Attendance.StatusChoices.ABSENT)),
        )

        filter = CustomFilterBackend()
        queryset = filter.filter_queryset(request, queryset, self)
        paginator = CustomPagination()
        paginator.ordering = ["-date", "department_id"]
        data = paginator.paginate_queryset(queryset, request)
        return paginator.get_paginated_response(data)
