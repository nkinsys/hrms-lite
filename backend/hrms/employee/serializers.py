from rest_framework import serializers
from employee.models import Department, Employee, Attendance

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"

class EmployeeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)  # Avoid fetching again

    class Meta:
        model = Employee
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['attendance_status'] = getattr(instance, "attendance_status", None)
        return representation

class AttendanceSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)  # Avoid fetching employee again

    class Meta:
        model = Attendance
        fields = "__all__"
