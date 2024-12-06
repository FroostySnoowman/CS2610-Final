import requests
import os
from django.http import StreamingHttpResponse

def asset_proxy_middleware(next):
    def middleware(request):
        if "." in request.path:
            response = requests.get(f"{os.environ.get('ASSET_URL')}{request.path.replace('/static', '')}", stream=True)

            return StreamingHttpResponse(
                response.raw,
                content_type=response.headers.get('content-type'),
                status=response.status_code,
                reason=response.reason
            )

        return next(request)

    return middleware