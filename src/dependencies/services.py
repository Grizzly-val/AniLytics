from fastapi import Request


class Services:
    def __init__(self, request: Request):
        self.client = request.app.state.client