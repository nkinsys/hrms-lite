from django.db.models import Q;
from hrms.utils import querydict_to_nested_dict
from rest_framework.exceptions import ParseError
from rest_framework.filters import BaseFilterBackend

class CustomFilterBackend(BaseFilterBackend):
    def construct(self, items, queryset, logicOperator="and"):
        if not isinstance(items, list):
            return
        
        filter = {}
        exclude = {}

        for item in items:
            if isinstance(item, dict):
                field = item.get('field')
                operator = item.get('operator', 'iexact')
                value = item.get('value', None)

                if isinstance(field, str) and isinstance(operator, str):
                    if operator.endswith('exact') and value is None:
                        pass
                    elif operator == 'in' and type(value) is list:
                        pass
                    elif not isinstance(value, str):
                        raise ParseError("Invalid filter params")
                    if (operator.startswith('~')):
                        operator = operator[1:]
                        exclude[field + '__' + operator] = value
                    else:
                        if (operator == 'isnull'):
                            value = True if (value == 1 or value == 'True') else False
                        filter[field + '__' + operator] = value
                else:
                    raise ParseError("Invalid filter params")

        if len(filter) > 0:
            conditions = None
            for field in filter:
                condition = {field: filter[field]}
                if conditions is None:
                    conditions = Q(**condition)
                elif logicOperator == 'or':
                    conditions = conditions | Q(**condition)
                else:
                    conditions = conditions & Q(**condition)
            queryset = queryset.filter(conditions)

        if len(exclude) > 0:
            queryset = queryset.exclude(**exclude)

        return queryset

    def filter_queryset(self, request, queryset, view):
        params = querydict_to_nested_dict(request.query_params)

        if params.get('filter') and params['filter'].get('items'):
            queryset = self.construct(
                params['filter']['items'],
                queryset,
                params['filter'].get('logicOperator', 'and')
            )

        return queryset
