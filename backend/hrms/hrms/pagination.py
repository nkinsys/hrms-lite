from rest_framework.response import Response
from rest_framework.pagination import CursorPagination

class CustomPagination(CursorPagination):
    page_size_query_param = "pagination[pageSize]"
    max_page_size = 100
    ordering = 'pk'
