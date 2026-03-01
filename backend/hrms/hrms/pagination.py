from rest_framework.pagination import CursorPagination
from hrms.utils import querydict_to_nested_dict

class CustomPagination(CursorPagination):
    page_size_query_param = "pagination[pageSize]"
    max_page_size = 100
    ordering = 'pk'
    
    def get_ordering(self, request, queryset, view):
        params = querydict_to_nested_dict(request.query_params)
        # {'pagination': {'pageSize': '20', 'page': '0'}, 'sort': [{'field': 'department', 'sort': 'asc'}]}
        if params.get('sort') and len(params['sort']) > 0:
            self.ordering = []
            for sort in params['sort']:
                if isinstance(sort, dict):
                    field = sort.get('field')
                    if (sort.get('sort') == 'desc'):
                        field = '-' + field
                    self.ordering.append(field)

        return super().get_ordering(request, queryset, view)
