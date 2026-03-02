from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Department(models.Model):
    name = models.CharField(_('department name'), max_length=254, unique=True)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    
    def __str__(self):
        return self.name

class Employee(models.Model):
    name = models.CharField(_("full name"), max_length=254)
    email = models.EmailField(_("email address"), unique=True)
    department = models.ForeignKey(
        to=Department,
        db_column="department_id",
        on_delete=models.SET_NULL,
        related_name="department",
        null=True,
        blank=True,
        verbose_name=_("department")
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("modified at"), auto_now=True)

    def __str__(self):
        return self.name

class Attendance(models.Model):
    class StatusChoices(models.IntegerChoices):
        ABSENT = 0, _('Absent')
        PRESENT = 1, _('Present')

    employee = models.ForeignKey(
        to=Employee,
        db_column="employee_id",
        on_delete=models.CASCADE,
        related_name="attendance",
        null=True,
        blank=True,
        verbose_name=_("employee")
    )
    date = models.DateField(_("date"))
    status = models.PositiveSmallIntegerField(
        _("Status"),
        choices=StatusChoices,
        help_text=_("Employee attendance status."),
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["employee", "date"],
                name="EMPLOYEE_ATTENDANCE_EMPLOYEE_ID_DATE"
            )
        ]
        ordering = ["-date", "employee"]
