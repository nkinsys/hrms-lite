from rest_framework import serializers
from employee.models import Department, Employee, Attendance

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if (instance.department):
            representation['department'] = DepartmentSerializer(instance.department).data  # Include full department data
        return representation

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if (instance.employee):
            representation['employee'] = EmployeeSerializer(instance.employee).data  # Include full employee data
        return representation
