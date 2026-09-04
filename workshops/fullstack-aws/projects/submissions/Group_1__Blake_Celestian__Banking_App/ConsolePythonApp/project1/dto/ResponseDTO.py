from typing import Generic, TypeVar

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


T = TypeVar("T")


class ResponseDTO(JSONResponse, Generic[T]):

    def __init__(
        self,
        status_code: int,
        message: str,
        data: T | None = None
    ):
        content = {
            "status_code": status_code,
            "message": message,
            "data": data
        }

        super().__init__(
            status_code=status_code,
            content=jsonable_encoder(content)
        )