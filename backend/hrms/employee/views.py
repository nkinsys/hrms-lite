from datetime import date
from django.shortcuts import render
from django.db.models import Count, Q, F
from employee.models import Employee, Attendance
from employee.serializers import EmployeeSerializer, AttendanceSerializer
from rest_framework import viewsets
from rest_framework.response import Response

# Create your views here.

class EmployeeModelViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class AttendanceModelViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def employee_attendance(self, request, pk, *args, **kwargs):
        instances = Attendance.objects.filter(
            employee = pk,
        ).all()
        serializer = self.get_serializer(instances, many=True)
        return Response(serializer.data)
    
    def mtd_report(self, request, *args, **kwargs):
        date_param = request.query_params.get('date', None)
        sort_order = []

        if date_param:
            queryset = Attendance.objects.filter(date=date_param)
        else:
            today = date.today()
            first_day_of_month = today.replace(day=1)
            queryset = Attendance.objects.filter(date__range=(first_day_of_month, today))
            sort_order.append("date")

        today = date.today()
        first_day_of_month = today.replace(day=1)
        data = queryset.values(
            'date'
        ).annotate(
            total_employees=Count('employee', distinct=True),  # total employees recorded for that day
            present=Count('id', filter=Q(status=Attendance.StatusChoices.PRESENT)),
            absent=Count('id', filter=Q(status=Attendance.StatusChoices.ABSENT)),
        ).order_by(*sort_order)
        return Response(data)
    
    def mtd_report_by_department(self, request, *args, **kwargs):
        date_param = request.query_params.get('date', None)
        department_id = request.query_params.get('department_id', None)
        sort_order = []

        if date_param:
            queryset = Attendance.objects.filter(date=date_param)
        else:
            today = date.today()
            first_day_of_month = today.replace(day=1)
            queryset = Attendance.objects.filter(date__range=(first_day_of_month, today))
            sort_order.append("date")

        if department_id:
            queryset = queryset.filter(employee__department__id=department_id)
        else:
            sort_order.append("department_name")

        data = queryset.values(
            'date',
        ).annotate(
            department_id=F('employee__department__id'),
            department_name=F('employee__department__name'),
            total_employees=Count('employee', distinct=True),
            present=Count('id', filter=Q(status=Attendance.StatusChoices.PRESENT)),
            absent=Count('id', filter=Q(status=Attendance.StatusChoices.ABSENT)),
        ).order_by(*sort_order)
        return Response(data)
