from rest_framework import serializers
from employee.models import Department, Employee, Attendance

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"

class EmployeeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer()

    class Meta:
        model = Employee
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['attendance_status'] = getattr(instance, "attendance_status", None)
        return representation

class EmployeeReadOnlySerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = [f.name for f in Employee._meta.fields if f.name != 'id']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['attendance_status'] = getattr(instance, "attendance_status", None)
        return representation

class AttendanceSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        write_only=True
    )

    employee_info = EmployeeReadOnlySerializer(source='employee', read_only=True)

    class Meta:
        model = Attendance
        fields = "__all__"

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['employee'] = rep.pop('employee_info')
        return rep
